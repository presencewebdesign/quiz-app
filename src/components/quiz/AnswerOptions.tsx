import type { AnswerOptionsProps } from "@/types/quiz";
import styles from "./AnswerOptions.module.scss";

export const AnswerOptions = ({
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
  questionId,
}: AnswerOptionsProps) => {
  return (
    <div className={styles.answerOptions}>
      <h4>Choose the correct version:</h4>
      {options.map((option, index) => (
        <label key={index} className={styles.radioOption}>
          <input
            type="radio"
            name={`question-${questionId}`}
            value={option.value}
            checked={selectedAnswer === option.value}
            onChange={() => onSelect(option.value)}
            disabled={disabled}
          />
          <span className={styles.radioLabel}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};
