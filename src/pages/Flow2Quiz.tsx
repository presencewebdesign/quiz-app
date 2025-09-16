import { useQuiz } from "@/contexts/QuizContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { calculateScore, parseFeedback } from "@/utils/textParser";
import type { Flow2Activity } from "@/types/quiz";
import { useState } from "react";
import styles from "./Flow2Quiz.module.scss";

export const Flow2Quiz = () => {
  const navigate = useNavigate();
  const {
    quizData,
    currentRound = 0,
    userAnswers,
    setAnswer,
    nextRound,
  } = useQuiz();

  // State for tracking current question within a round
  const [currentQuestionInRound, setCurrentQuestionInRound] = useState(0);

  const activity = quizData.activities[1] as unknown as Flow2Activity;
  
  // Add safety checks
  if (!activity) {
    return <div>Loading activity data...</div>;
  }
  
  if (!activity.questions || activity.questions.length === 0) {
    return <div>No questions available for this activity.</div>;
  }
  
  const currentRoundData = activity.questions[currentRound];
  if (!currentRoundData || !currentRoundData.questions) {
    return <div>Loading round data...</div>;
  }
  
  const question = currentRoundData.questions[currentQuestionInRound];
  if (!question) {
    return <div>Loading question data...</div>;
  }
  
  const isLastRound = currentRound >= activity.questions.length - 1;
  const isLastQuestionInRound = currentQuestionInRound >= currentRoundData.questions.length - 1;
  const overallProgress = ((currentRound + 1) / activity.questions.length) * 100;

  // Check if all questions in current round are answered (regardless of correctness)
  const areAllQuestionsInRoundAnswered = () => {
    return currentRoundData.questions.every(q => {
      const uniqueKey = `${currentRound}-${q.order}`;
      return userAnswers.has(uniqueKey);
    });
  };

  // Generate answer options for the question
  const generateAnswerOptions = (question: any) => {
    const options: Array<{ value: string; label: string; isCorrect: boolean }> = [];
    
    // Add the correct answer (from feedback)
    const correctAnswer = question.feedback.replace(/\*([^*]+)\*/g, '$1');
    options.push({ value: correctAnswer, label: correctAnswer, isCorrect: true });
    
    // Add the incorrect answer (from stimulus)
    const incorrectAnswer = question.stimulus.replace(/\*([^*]+)\*/g, '$1');
    if (incorrectAnswer !== correctAnswer) {
      options.push({ value: incorrectAnswer, label: incorrectAnswer, isCorrect: false });
    }
    
    // Generate more intelligent alternatives based on the question content
    const alternatives = [];
    
    // For questions with "haven't finished" pattern, create alternatives
    if (question.stimulus.includes("haven't finished")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "didn't finish"),
        question.stimulus.replace(/\*([^*]+)\*/g, "hasn't finished"),
        question.stimulus.replace(/\*([^*]+)\*/g, "won't finish")
      );
    }
    // For questions with "like listening" pattern, create alternatives
    else if (question.stimulus.includes("like listening")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "likes to listen"),
        question.stimulus.replace(/\*([^*]+)\*/g, "like to listen"),
        question.stimulus.replace(/\*([^*]+)\*/g, "likes listening")
      );
    }
    // For questions with "more cheaper" pattern, create alternatives
    else if (question.stimulus.includes("more cheaper")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "more cheap"),
        question.stimulus.replace(/\*([^*]+)\*/g, "cheaper"),
        question.stimulus.replace(/\*([^*]+)\*/g, "most cheap")
      );
    }
    // For questions with "In the other hand" pattern, create alternatives
    else if (question.stimulus.includes("In the other hand")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "On the other hand"),
        question.stimulus.replace(/\*([^*]+)\*/g, "In other hand"),
        question.stimulus.replace(/\*([^*]+)\*/g, "On other hand")
      );
    }
    // Default alternatives for other patterns
    else {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, 'playing'),
        question.stimulus.replace(/\*([^*]+)\*/g, 'to play'),
        question.stimulus.replace(/\*([^*]+)\*/g, 'play')
      );
    }
    
    alternatives.forEach(alt => {
      if (alt !== correctAnswer && alt !== incorrectAnswer && !options.find(opt => opt.value === alt)) {
        options.push({ value: alt, label: alt, isCorrect: false });
      }
    });
    
    // Randomize the order of options to prevent easy guessing
    const shuffledOptions = options.slice(0, 4).sort(() => Math.random() - 0.5);
    
    return shuffledOptions;
  };

  const handleAnswer = (answer: string) => {
    // Use round and question order to make key unique
    const uniqueKey = `${currentRound}-${question.order}`;
    setAnswer(uniqueKey, answer);
    
    // Auto-progress to next question in round if not the last question
    if (!isLastQuestionInRound) {
      setTimeout(() => {
        setCurrentQuestionInRound(currentQuestionInRound + 1);
      }, 1000); // Small delay to show the result
    }
  };

  const handleNextRound = () => {
    if (isLastRound) {
      // Calculate final score - include all questions from all rounds
      const allQuestions: any[] = [];
      activity.questions.forEach(round => {
        allQuestions.push(...round.questions);
      });
      
      // Convert userAnswers to use question order as key for score calculation
      const scoreAnswers = new Map<string, string>();
      userAnswers.forEach((answer, key) => {
        // Extract question order from key (format: "round-questionOrder")
        const questionOrder = key.split('-')[1];
        scoreAnswers.set(questionOrder, answer);
      });
      
      const score = calculateScore(scoreAnswers, allQuestions);
      navigate("/score", { state: { score, flow: "flow2" } });
    } else {
      // Allow progression if ALL questions in current round are answered (regardless of correctness)
      if (areAllQuestionsInRoundAnswered()) {
        setCurrentQuestionInRound(0); // Reset to first question of next round
        nextRound();
      }
    }
  };


  const answerOptions = generateAnswerOptions(question);
  // Use round and question order to make key unique
  const uniqueKey = `${currentRound}-${question.order}`;
  const userAnswer = userAnswers.get(uniqueKey);
  const correctAnswer = question.feedback.replace(/\*([^*]+)\*/g, '$1');
  const isCorrect = userAnswer ? userAnswer === correctAnswer : false;
  
  // Remove asterisks from stimulus for display (make it more challenging)
  const displayStimulus = question.stimulus.replace(/\*([^*]+)\*/g, '$1');
  

  return (
    <div className={styles.flow2Quiz}>
      <div className={styles.header}>
        <h1>{quizData.heading}</h1>
        <h2>{activity.activity_name}</h2>
        <div className={styles.progressContainer}>
          <div className={styles.roundInfo}>
            Round {currentRound + 1} of {activity.questions.length} - Question {currentQuestionInRound + 1} of {currentRoundData.questions.length}
          </div>
          <ProgressBar 
            progress={overallProgress} 
            showPercentage 
          />
        </div>
      </div>

      <div className={styles.questionContainer}>
        <div className={styles.questionCard}>
          <div className={styles.questionText}>
            <h3>Round {currentRound + 1}: {currentRoundData.round_title}</h3>
            <p className={styles.stimulus}>{displayStimulus}</p>
          </div>

          {!userAnswer ? (
            <div className={styles.answerOptions}>
              <h4>Choose the correct version:</h4>
              {answerOptions.map((option, index) => (
                <label key={index} className={styles.radioOption}>
                  <input
                    type="radio"
                    name={`question-${question.order}`}
                    value={option.value}
                    checked={userAnswer === option.value}
                    onChange={() => handleAnswer(option.value)}
                  />
                  <span className={styles.radioLabel}>{option.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className={styles.result}>
              {isCorrect ? (
                <div className={styles.congratulations}>
                  <h2 className={styles.congratsTitle}>🎉 Correct!</h2>
                  <p className={styles.congratsMessage}>
                    {isLastQuestionInRound && areAllQuestionsInRoundAnswered() 
                      ? isLastRound 
                        ? `You completed Round ${currentRound + 1}! Click "View Score" to see your results.`
                        : `You completed Round ${currentRound + 1}! You can now proceed to the next round.`
                      : "Great job! Moving to the next question in this round."
                    }
                  </p>
                  <div className={styles.correctAnswer}>
                    <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: parseFeedback(question.feedback) }} /></p>
                  </div>
                </div>
              ) : (
                <div className={styles.incorrectResult}>
                  <h2 className={styles.incorrectTitle}>❌ Incorrect</h2>
                  <p className={styles.incorrectMessage}>
                    {isLastQuestionInRound && areAllQuestionsInRoundAnswered() 
                      ? isLastRound 
                        ? `You completed Round ${currentRound + 1}! Click "View Score" to see your results.`
                        : `You completed Round ${currentRound + 1}! You can now proceed to the next round.`
                      : "Keep going! Moving to the next question in this round."
                    }
                  </p>
                  <div className={styles.correctAnswer}>
                    <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: parseFeedback(question.feedback) }} /></p>
                  </div>
                </div>
              )}
              
              <div className={styles.actionButtons}>
                {isLastRound && isLastQuestionInRound && areAllQuestionsInRoundAnswered() ? (
                  <Button onClick={handleNextRound} variant="primary">
                    View Score
                  </Button>
                ) : isLastQuestionInRound && areAllQuestionsInRoundAnswered() ? (
                  <Button onClick={handleNextRound} variant="primary">
                    Next Round
                  </Button>
                ) : (
                  <div className={styles.waitingMessage}>
                    <p>Complete all questions in this round to proceed</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.navigation}>
          <Button onClick={() => navigate("/")} variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};