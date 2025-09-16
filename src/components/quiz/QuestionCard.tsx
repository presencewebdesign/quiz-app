import { QuizEngine } from "@/services/quizEngine";
import { useAnswerOptions } from "@/hooks/useAnswerOptions";
import { AnswerOptions } from "./AnswerOptions";
import { QuizResult } from "./QuizResult";
import type { QuestionCardProps } from "@/types/quiz";
import styles from "./QuestionCard.module.scss";

export const QuestionCard = ({
  question,
  userAnswer,
  onAnswer,
  showFeedback = false,
  isSubmitting = false,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) => {
  const answerOptions = useAnswerOptions(question);
  const correctAnswer = question.feedback.replace(/\*([^*]+)\*/g, "$1");
  const isCorrect = userAnswer ? userAnswer === correctAnswer : false;
  const displayStimulus = QuizEngine.cleanStimulus(question.stimulus);

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionText}>
        {questionNumber && totalQuestions && (
          <div className={styles.questionNumber}>
            Question {questionNumber} of {totalQuestions}
          </div>
        )}
        <p className={styles.stimulus}>{displayStimulus}</p>
      </div>

      {!userAnswer ? (
        <AnswerOptions
          options={answerOptions}
          selectedAnswer={userAnswer}
          onSelect={onAnswer}
          disabled={isSubmitting}
          questionId={question.order.toString()}
        />
      ) : (
        <QuizResult
          isCorrect={isCorrect}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
          feedback={question.feedback}
          showFeedback={showFeedback}
        />
      )}
    </div>
  );
};
