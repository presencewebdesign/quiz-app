import { parseFeedback } from "@/utils/textParser";
import { Button } from "@/components/common/Button";
import type { QuizResultProps } from "@/types/quiz";
import styles from "./QuizResult.module.scss";

export const QuizResult = ({
  isCorrect,
  correctAnswer,
  userAnswer,
  feedback,
  onNext,
  nextButtonText,
  showFeedback = true,
}: QuizResultProps) => {
  return (
    <div className={styles.result}>
      {isCorrect ? (
        <div className={styles.congratulations}>
          <h3>🎉 Correct!</h3>
          <p>You selected the right answer.</p>
        </div>
      ) : (
        <div className={styles.incorrect}>
          <h3>❌ Incorrect</h3>
          <p>The correct answer is: <span dangerouslySetInnerHTML={{ __html: parseFeedback(feedback || '') }} /></p>
        </div>
      )}
      
      {showFeedback && (
        <div className={styles.feedback}>
          <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: parseFeedback(feedback || '') }} /></p>
        </div>
      )}
      
      {onNext && (
        <div className={styles.actionButtons}>
          <Button onClick={onNext} variant="primary">
            {nextButtonText || "Next"}
          </Button>
        </div>
      )}
    </div>
  );
};
