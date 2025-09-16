import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/common/Button";
import { ProgressBar } from "@/components/common/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Flow1Quiz.module.scss";

export const Flow1Quiz = () => {
  const navigate = useNavigate();
  const {
    quizData,
    userAnswers,
    setAnswer,
  } = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const activity = quizData.activities[0];
  const questions = activity.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
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
    
    // Add some common alternatives for variety
    const alternatives = [
      question.stimulus.replace(/\*([^*]+)\*/g, 'playing'),
      question.stimulus.replace(/\*([^*]+)\*/g, 'to play'),
      question.stimulus.replace(/\*([^*]+)\*/g, 'play'),
    ];
    
    alternatives.forEach(alt => {
      if (alt !== correctAnswer && alt !== incorrectAnswer && !options.find(opt => opt.value === alt)) {
        options.push({ value: alt, label: alt, isCorrect: false });
      }
    });
    
    return options.slice(0, 4); // Limit to 4 options
  };

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuestion.order.toString(), answer);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowScore(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q: any) => {
      const userAnswer = userAnswers.get(q.order.toString());
      const correctAnswer = q.feedback.replace(/\*([^*]+)\*/g, '$1');
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };

  const answerOptions = generateAnswerOptions(currentQuestion);
  const userAnswer = userAnswers.get(currentQuestion.order.toString());
  const isCorrect = userAnswer === currentQuestion.feedback.replace(/\*([^*]+)\*/g, '$1');
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Remove asterisks from stimulus for display (make it more challenging)
  const displayStimulus = currentQuestion.stimulus.replace(/\*([^*]+)\*/g, '$1');

  // Navigate to score screen when quiz is completed
  useEffect(() => {
    if (showScore) {
      const score = calculateScore();
      navigate("/score", { state: { score, flow: "flow1" } });
    }
  }, [showScore, navigate]);

  // Show loading state while navigating
  if (showScore) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.flow1Quiz}>
      <div className={styles.header}>
        <h1>{quizData.heading}</h1>
        <h2>{activity.activity_name}</h2>
        <div className={styles.progressContainer}>
          <div className={styles.questionInfo}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <ProgressBar 
            progress={progress} 
            showPercentage 
          />
        </div>
      </div>

      <div className={styles.questionContainer}>
        <div className={styles.questionCard}>
          <div className={styles.questionText}>
            <p className={styles.stimulus}>{displayStimulus}</p>
          </div>

          {!userAnswer ? (
            <div className={styles.answerOptions}>
              <h4>Choose the correct version:</h4>
              {answerOptions.map((option, index) => (
                <label key={index} className={styles.radioOption}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.order}`}
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
                  <h3>🎉 Correct!</h3>
                  <p>You selected the right answer.</p>
                </div>
              ) : (
                <div className={styles.incorrect}>
                  <h3>❌ Incorrect</h3>
                  <p>The correct answer is: <strong>{currentQuestion.feedback.replace(/\*([^*]+)\*/g, '$1')}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.navigation}>
          <Button onClick={handleBackToHome} variant="secondary">
            Back to Home
          </Button>
          {userAnswer && (
            <Button onClick={handleNextQuestion} variant="primary">
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};