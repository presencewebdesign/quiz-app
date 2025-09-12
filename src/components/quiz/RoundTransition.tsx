import { Button } from "@/components/common/Button";
import styles from "./RoundTransition.module.scss";

interface RoundTransitionProps {
  currentRound: number;
  totalRounds: number;
  onNextRound: () => void;
  onFinish: () => void;
}

export const RoundTransition = ({
  currentRound,
  totalRounds,
  onNextRound,
  onFinish,
}: RoundTransitionProps) => {
  const isLastRound = currentRound >= totalRounds;

  return (
    <div className={styles.roundTransition}>
      <div className={styles.transitionContent}>
        <h3>Round {currentRound} Complete!</h3>
        <p>
          {isLastRound
            ? "You have completed all rounds. Ready to see your score?"
            : `Great job! You've completed Round ${currentRound}. Ready for the next round?`}
        </p>

        <div className={styles.transitionActions}>
          <Button
            onClick={isLastRound ? onFinish : onNextRound}
            variant="primary"
            size="large"
          >
            {isLastRound ? "View Score" : "Next Round"}
          </Button>
        </div>
      </div>
    </div>
  );
};
