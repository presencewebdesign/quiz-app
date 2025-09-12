import styles from "./QuizLoadingSkeleton.module.scss";

export const QuizLoadingSkeleton = () => (
  <div className={styles.quizSkeleton}>
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonProgress} />
    </div>
    <div className={styles.skeletonQuestion}>
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonInput} />
    </div>
    <div className={styles.skeletonNavigation}>
      <div className={styles.skeletonButton} />
      <div className={styles.skeletonButton} />
    </div>
  </div>
);
