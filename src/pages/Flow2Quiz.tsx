import { useQuiz } from "@/contexts/QuizContext";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import type { Flow2Activity } from "@/types/quiz";
import { useEffect, useState } from "react";
import styles from "./Flow2Quiz.module.scss";

export const Flow2Quiz = () => {
  const navigate = useNavigate();
  const { 
    quizData, 
    userAnswers, 
    currentRound = 0, 
    setAnswer, 
    nextRound, 
    calculateScore 
  } = useQuiz();

  const [currentQuestionInRound, setCurrentQuestionInRound] = useState(0);
  const [showScore, setShowScore] = useState(false);

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
  
  const currentQuestion = currentRoundData.questions[currentQuestionInRound];
  if (!currentQuestion) {
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

  const handleAnswer = (answer: string) => {
    // Use round and question order to make key unique
    const uniqueKey = `${currentRound}-${currentQuestion.order}`;
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
      setShowScore(true);
    } else {
      // Allow progression if ALL questions in current round are answered (regardless of correctness)
      if (areAllQuestionsInRoundAnswered()) {
        setCurrentQuestionInRound(0); // Reset to first question of next round
        nextRound();
      }
    }
  };

  // Use round and question order to make key unique
  const uniqueKey = `${currentRound}-${currentQuestion.order}`;
  const userAnswer = userAnswers.get(uniqueKey);
  

  // Navigate to score screen when quiz is completed
  useEffect(() => {
    if (showScore) {
      const score = calculateScore();
      navigate("/score", { state: { score, flow: "flow2" } });
    }
  }, [showScore, navigate, calculateScore]);

  // Show loading state while navigating
  if (showScore) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.flow2Quiz}>
      <div className={styles.header}>
        <h1>{quizData.heading}</h1>
        <h2>{activity.activity_name}</h2>
        <QuizProgress
          currentIndex={currentRound}
          total={activity.questions.length}
          progress={overallProgress}
          showPercentage
          label={`Round ${currentRound + 1} of ${activity.questions.length} - Question ${currentQuestionInRound + 1} of ${currentRoundData.questions.length}`}
        />
      </div>

      <div className={styles.questionContainer}>
        <div className={styles.roundHeader}>
          <h3>Round {currentRound + 1}: {currentRoundData.round_title}</h3>
        </div>
        
        <QuestionCard
          question={currentQuestion}
          userAnswer={userAnswer}
          onAnswer={handleAnswer}
          showFeedback={true}
          questionNumber={currentQuestionInRound + 1}
          totalQuestions={currentRoundData.questions.length}
        />

        {userAnswer && (
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
        )}

        <div className={styles.navigation}>
          <Button onClick={() => navigate("/")} variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};