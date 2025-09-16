import type { Question, AnswerOption, ScoreResult } from "@/types/quiz";

export class QuizEngine {
  /**
   * Generate answer options for a question
   */
  static generateAnswerOptions(question: Question): AnswerOption[] {
    const options: AnswerOption[] = [];

    // Add the correct answer (from feedback)
    const correctAnswer = question.feedback.replace(/\*([^*]+)\*/g, "$1");
    options.push({
      value: correctAnswer,
      label: correctAnswer,
      isCorrect: true,
    });

    // Add the incorrect answer (from stimulus)
    const incorrectAnswer = question.stimulus.replace(/\*([^*]+)\*/g, "$1");
    if (incorrectAnswer !== correctAnswer) {
      options.push({
        value: incorrectAnswer,
        label: incorrectAnswer,
        isCorrect: false,
      });
    }

    // Debug logging can be enabled for troubleshooting
    // console.log("Answer options generation:", {
    //   questionOrder: question.order,
    //   stimulus: question.stimulus,
    //   feedback: question.feedback,
    //   correctAnswer,
    //   incorrectAnswer,
    //   options: options.map((opt) => ({
    //     value: opt.value,
    //     isCorrect: opt.isCorrect,
    //   })),
    // });

    // Generate intelligent alternatives based on question patterns
    const alternatives = this.generateAlternatives(question);

    alternatives.forEach((alt) => {
      if (
        alt !== correctAnswer &&
        alt !== incorrectAnswer &&
        !options.find((opt) => opt.value === alt)
      ) {
        options.push({ value: alt, label: alt, isCorrect: false });
      }
    });

    // Randomize the order of options to prevent easy guessing
    const shuffledOptions = options.slice(0, 4).sort(() => Math.random() - 0.5);

    return shuffledOptions;
  }

  /**
   * Generate intelligent alternatives based on question patterns
   */
  private static generateAlternatives(question: Question): string[] {
    const alternatives: string[] = [];

    // For questions with "haven't finished" pattern
    if (question.stimulus.includes("haven't finished")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "didn't finish"),
        question.stimulus.replace(/\*([^*]+)\*/g, "hasn't finished"),
        question.stimulus.replace(/\*([^*]+)\*/g, "won't finish")
      );
    }
    // For questions with "like listening" pattern
    else if (question.stimulus.includes("like listening")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "likes to listen"),
        question.stimulus.replace(/\*([^*]+)\*/g, "like to listen"),
        question.stimulus.replace(/\*([^*]+)\*/g, "likes listening")
      );
    }
    // For questions with "more cheaper" pattern
    else if (question.stimulus.includes("more cheaper")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "more cheap"),
        question.stimulus.replace(/\*([^*]+)\*/g, "cheaper"),
        question.stimulus.replace(/\*([^*]+)\*/g, "most cheap")
      );
    }
    // For questions with "In the other hand" pattern
    else if (question.stimulus.includes("In the other hand")) {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "On the other hand"),
        question.stimulus.replace(/\*([^*]+)\*/g, "In other hand"),
        question.stimulus.replace(/\*([^*]+)\*/g, "On other hand")
      );
    }
    // Default alternatives for other patterns
    else {
      alternatives.push(
        question.stimulus.replace(/\*([^*]+)\*/g, "playing"),
        question.stimulus.replace(/\*([^*]+)\*/g, "to play"),
        question.stimulus.replace(/\*([^*]+)\*/g, "play")
      );
    }

    return alternatives;
  }

  /**
   * Calculate score based on answers
   */
  static calculateScore(
    userAnswers: Map<string, string>,
    questions: Question[]
  ): ScoreResult {
    let correct = 0;

    // Debug logging can be enabled for troubleshooting
    // console.log("QuizEngine.calculateScore called with:", {
    //   userAnswers: Array.from(userAnswers.entries()),
    //   questionsCount: questions.length,
    //   sampleQuestion: questions[0],
    // });

    questions.forEach((question) => {
      // Use uniqueId if available (for Flow2), otherwise use order (for Flow1)
      const questionKey = question.uniqueId || question.order.toString();
      const userAnswer = userAnswers.get(questionKey);

      // The correct answer is the text from feedback (without asterisks)
      const correctAnswerText = question.feedback.replace(/\*([^*]+)\*/g, "$1");

      // Debug logging can be enabled for troubleshooting
      // console.log(`Question ${questionKey}:`, {
      //   userAnswer,
      //   correctAnswerText,
      //   stimulus: question.stimulus,
      //   feedback: question.feedback,
      //   isCorrect: userAnswer === correctAnswerText,
      //   questionIsCorrect: question.is_correct,
      // });

      if (userAnswer) {
        // Compare user answer with correct answer text
        if (userAnswer === correctAnswerText) {
          correct++;
        }
      }
    });

    const result = {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };

    // Debug logging can be enabled for troubleshooting
    // console.log("Final score result:", result);
    return result;
  }

  /**
   * Validate if user answer is correct
   */
  static validateAnswer(userAnswer: string, correctAnswer: string): boolean {
    return (
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    );
  }

  /**
   * Extract correct answer from feedback
   */
  static extractCorrectAnswer(feedback: string): string {
    const match = feedback.match(/\*(.*?)\*/);
    return match ? match[1] : "";
  }

  /**
   * Extract error text from stimulus
   */
  static extractError(stimulus: string): string {
    const match = stimulus.match(/\*(.*?)\*/);
    return match ? match[1] : "";
  }

  /**
   * Clean stimulus text for display (remove asterisks)
   */
  static cleanStimulus(stimulus: string): string {
    return stimulus.replace(/\*([^*]+)\*/g, "$1");
  }
}
