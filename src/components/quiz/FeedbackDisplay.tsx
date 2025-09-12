import { useMemo } from "react";
import type { Question } from "@/types/quiz";
import { extractCorrectAnswer, compareAnswers } from "@/utils/textParser";
import { ErrorHighlight } from "./ErrorHighlight";

interface FeedbackDisplayProps {
  question: Question;
  userAnswer?: string;
}

export const FeedbackDisplay = ({
  question,
  userAnswer,
}: FeedbackDisplayProps) => {
  const isCorrect = useMemo(() => {
    if (!userAnswer) return false;
    const correctAnswer = extractCorrectAnswer(question.feedback);
    return compareAnswers(userAnswer, correctAnswer);
  }, [question.feedback, userAnswer]);

  return (
    <div className={`feedback-display ${isCorrect ? "correct" : "incorrect"}`}>
      <div className="feedback-header">
        <h4>{isCorrect ? "Correct!" : "Incorrect"}</h4>
        <span className="feedback-icon">{isCorrect ? "✓" : "✗"}</span>
      </div>

      <div className="feedback-content">
        <div className="user-answer">
          <strong>Your answer:</strong> {userAnswer || "No answer provided"}
        </div>

        <div className="correct-answer">
          <strong>Correct answer:</strong>
          <ErrorHighlight text={question.feedback} />
        </div>

        {question.is_correct && (
          <div className="explanation">
            <strong>Explanation:</strong> The text is already correct.
          </div>
        )}
      </div>
    </div>
  );
};
