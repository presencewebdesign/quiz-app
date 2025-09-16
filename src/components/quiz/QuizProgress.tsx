import { ProgressBar } from "@/components/common/ProgressBar";
import type { QuizProgressProps } from "@/types/quiz";
import styles from "./QuizProgress.module.scss";

export const QuizProgress = ({
  currentIndex,
  total,
  progress,
  showPercentage = false,
  label,
}: QuizProgressProps) => {
  return (
    <div className={styles.progressContainer}>
      {label && (
        <div className={styles.progressLabel}>
          {label}
        </div>
      )}
      <div className={styles.progressInfo}>
        Question {currentIndex + 1} of {total}
      </div>
      <ProgressBar 
        progress={progress} 
        showPercentage={showPercentage} 
      />
    </div>
  );
};
