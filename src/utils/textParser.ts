// Parse stimulus text to highlight errors
export const parseStimulus = (stimulus: string): string => {
  // Convert "*text*" to highlighted error text
  return stimulus.replace(
    /\*(.*?)\*/g,
    '<span class="error-highlight">$1</span>'
  );
};

// Parse feedback text to highlight correct answers in bold
export const parseFeedback = (feedback: string): string => {
  // Convert "*text*" to bold text
  return feedback.replace(
    /\*([^*]+)\*/g,
    (_, group1) => `<strong>${group1}</strong>`
  );
};

// Extract the error text for comparison
export const extractError = (stimulus: string): string => {
  const match = stimulus.match(/\*(.*?)\*/);
  return match ? match[1] : "";
};

// Extract correct answer from feedback
export const extractCorrectAnswer = (feedback: string): string => {
  const match = feedback.match(/\*(.*?)\*/);
  return match ? match[1] : "";
};

// Compare user answer with correct answer
export const compareAnswers = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
};

// Re-export QuizEngine methods for backward compatibility
import { QuizEngine } from "@/services/quizEngine";

export const calculateScore = QuizEngine.calculateScore;
