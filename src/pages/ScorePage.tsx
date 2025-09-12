import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/common/Button";
import type { ScoreResult } from "@/types/quiz";
import styles from "./ScorePage.module.scss";

interface ScorePageState {
  score: ScoreResult;
  flow: "flow1" | "flow2";
}

export const ScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, flow } = (location.state as ScorePageState) || {
    score: { correct: 0, total: 0, percentage: 0 },
    flow: "flow1" as const,
  };

  const handleRestart = () => {
    navigate("/");
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent work!";
    if (percentage >= 80) return "Great job!";
    if (percentage >= 70) return "Good effort!";
    if (percentage >= 60) return "Not bad!";
    return "Keep practicing!";
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "#28a745"; // Success
    if (percentage >= 60) return "#ffc107"; // Warning
    return "#dc3545"; // Danger
  };

  return (
    <Layout title="Quiz Complete">
      <div className={styles.scorePage}>
        <div className={styles.scoreHeader}>
          <h2>Quiz Complete!</h2>
          <p>Here are your results:</p>
        </div>

        <div className={styles.scoreDisplay}>
          <div
            className={styles.scoreCircle}
            style={{ borderColor: getScoreColor(score.percentage) }}
          >
            <span
              className={styles.scorePercentage}
              style={{ color: getScoreColor(score.percentage) }}
            >
              {score.percentage}%
            </span>
          </div>

          <div className={styles.scoreMessage}>
            <h3>{getScoreMessage(score.percentage)}</h3>
          </div>

          <div className={styles.scoreDetails}>
            <div className={styles.scoreItem}>
              <span className={styles.label}>Correct Answers:</span>
              <span className={styles.value}>{score.correct}</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.label}>Total Questions:</span>
              <span className={styles.value}>{score.total}</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.label}>Flow Completed:</span>
              <span className={styles.value}>
                {flow === "flow1" ? "Sequential" : "Rounds-based"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.scoreActions}>
          <Button onClick={handleRestart} size="large">
            Take Another Quiz
          </Button>
        </div>
      </div>
    </Layout>
  );
};
