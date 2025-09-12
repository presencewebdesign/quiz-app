import { useQuiz } from "@/contexts/QuizContext";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { calculateScore } from "@/utils/textParser";
import type { Flow2Activity } from "@/types/quiz";
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
  
  const question = currentRoundData.questions[0]; // Only use the first question of each round
  if (!question) {
    return <div>Loading question data...</div>;
  }
  
  const isLastRound = currentRound >= activity.questions.length - 1;
  const overallProgress = ((currentRound + 1) / activity.questions.length) * 100;

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
    
    return options.slice(0, 4); // Limit to 4 options
  };

  const handleAnswer = (answer: string) => {
    // Use round and question order to make key unique
    const uniqueKey = `${currentRound}-${question.order}`;
    setAnswer(uniqueKey, answer);
  };

  const handleNextRound = () => {
    if (isLastRound) {
      // Calculate final score
      const allQuestions = activity.questions.map(round => round.questions[0]);
      
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
      // Only allow progression if current round is completed correctly
      if (isCorrect) {
        nextRound();
      }
    }
  };

  const handleBackToHome = () => {
    navigate("/");
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
            Round {currentRound + 1} of {activity.questions.length}
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
                  <h2 className={styles.congratsTitle}>🎉 Congratulations!</h2>
                  <p className={styles.congratsMessage}>
                    You passed Round {currentRound + 1}!
                    {!isLastRound && " You can now proceed to the next round."}
                  </p>
                  <div className={styles.correctAnswer}>
                    <p><strong>Correct Answer:</strong> {question.feedback}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.incorrectResult}>
                  <h2 className={styles.incorrectTitle}>❌ Incorrect</h2>
                  <p className={styles.incorrectMessage}>Better luck next time!</p>
                  <div className={styles.correctAnswer}>
                    <p><strong>Correct Answer:</strong> {question.feedback}</p>
                  </div>
                </div>
              )}
              
              <div className={styles.actionButtons}>
                {isLastRound ? (
                  <Button onClick={handleBackToHome} variant="primary">
                    Back to Home
                  </Button>
                ) : isCorrect ? (
                  <Button onClick={handleNextRound} variant="primary">
                    Next Round
                  </Button>
                ) : (
                  <Button onClick={handleBackToHome} variant="secondary">
                    Back to Home
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};