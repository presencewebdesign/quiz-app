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

// Calculate score based on answers
export const calculateScore = (
  userAnswers: Map<string, string>,
  questions: any[]
): { correct: number; total: number; percentage: number } => {
  let correct = 0;

  questions.forEach((question) => {
    const userAnswer = userAnswers.get(question.order.toString());
    if (userAnswer) {
      // Get the correct answer from feedback (remove asterisks)
      const correctAnswer = question.feedback.replace(/\*([^*]+)\*/g, "$1");

      // Compare user answer with correct answer
      if (userAnswer === correctAnswer) {
        correct++;
      }
    }
  });

  return {
    correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
  };
};
