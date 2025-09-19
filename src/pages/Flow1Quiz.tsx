import { useQuiz } from "@/hooks/useQuiz";
import { Button } from "@/components/common/Button";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Question } from "@/types/quiz";
import styles from "./Flow1Quiz.module.scss";

export const Flow1Quiz = () => {
  const navigate = useNavigate();
  const { 
    quizData, 
    userAnswers, 
    currentQuestionIndex, 
    setAnswer, 
    nextQuestion, 
    calculateScore 
  } = useQuiz();

  const [showScore, setShowScore] = useState(false);

  const activity = quizData.activities[0];
  const questions = activity.questions as Question[];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuestion.order.toString(), answer);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowScore(true);
    } else {
      nextQuestion();
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const userAnswer = userAnswers.get(currentQuestion.order.toString());

  // Navigate to score screen when quiz is completed
  useEffect(() => {
    if (showScore) {
      const score = calculateScore();
      navigate("/score", { state: { score, flow: "flow1" } });
    }
  }, [showScore, navigate, calculateScore]);

  // Show loading state while navigating
  if (showScore) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.flow1Quiz}>
      <div className={styles.header}>
        <h1>{quizData.heading}</h1>
        <h2>{activity.activity_name}</h2>
        <QuizProgress
          currentIndex={currentQuestionIndex}
          total={questions.length}
          progress={progress}
          showPercentage
        />
      </div>

      <div className={styles.questionContainer}>
        <QuestionCard
          question={currentQuestion}
          userAnswer={userAnswer}
          onAnswer={handleAnswer}
          showFeedback={true}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

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