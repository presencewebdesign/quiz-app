import { useState, useCallback } from "react";
import type { ErrorFindQuestionProps } from "@/types/quiz";
import { Button } from "@/components/common/Button";
import { TextInput } from "./TextInput";
import { ErrorHighlight } from "./ErrorHighlight";
import { FeedbackDisplay } from "./FeedbackDisplay";
import styles from "./ErrorFindQuestion.module.scss";

export const ErrorFindQuestion = ({
  question,
  onAnswer,
  showFeedback,
  userAnswer,
  isSubmitting = false,
}: ErrorFindQuestionProps) => {
  const [inputValue, setInputValue] = useState(userAnswer || "");

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
    }
  }, [inputValue, onAnswer]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={styles.errorFindQuestion}>
      <div className={styles.questionHeader}>
        <h3>Find the Error</h3>
        <p>Identify the mistake in the text below and provide the correction.</p>
      </div>

      <div className={styles.stimulusText}>
        <ErrorHighlight text={question.stimulus} />
      </div>

      <div className={styles.inputSection}>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          onKeyPress={handleKeyPress}
          placeholder="Enter your correction..."
          disabled={isSubmitting}
        />

        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isSubmitting}
          loading={isSubmitting}
        >
          Submit Answer
        </Button>
      </div>

      {showFeedback && (
        <FeedbackDisplay question={question} userAnswer={userAnswer} />
      )}
    </div>
  );
};
