import { useMemo } from "react";
import { QuizEngine } from "@/services/quizEngine";
import type { Question, AnswerOption } from "@/types/quiz";

export const useAnswerOptions = (question: Question): AnswerOption[] => {
  return useMemo(() => {
    return QuizEngine.generateAnswerOptions(question);
  }, [question.stimulus, question.feedback]);
};
