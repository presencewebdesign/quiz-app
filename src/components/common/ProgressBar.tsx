import type { ProgressBarProps } from "@/types/quiz";
import styles from "./ProgressBar.module.scss";

export const ProgressBar = ({
  progress,
  showPercentage = false,
  color,
}: ProgressBarProps) => (
  <div className={styles.progressBar}>
    <div
      className={styles.progressFill}
      style={{
        width: `${Math.min(100, Math.max(0, progress))}%`,
        backgroundColor: color,
      }}
    />
    {showPercentage && (
      <span className={styles.progressText}>{Math.round(progress)}%</span>
    )}
  </div>
);
