import { useState, useCallback, useMemo } from "react";
import { QuizEngine } from "@/services/quizEngine";
import type { Question, ScoreResult } from "@/types/quiz";

interface UseQuizLogicProps {
  questions: Question[];
}

export const useQuizLogic = ({ questions }: UseQuizLogicProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(
    new Map()
  );
  const [showScore, setShowScore] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setUserAnswers((prev) => new Map(prev).set(questionId, answer));
  }, []);

  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setShowScore(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [isLastQuestion]);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const calculateScore = useCallback((): ScoreResult => {
    return QuizEngine.calculateScore(userAnswers, questions);
  }, [userAnswers, questions]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowScore(false);
  }, []);

  const getCurrentAnswer = useCallback(
    (questionId: string) => {
      return userAnswers.get(questionId);
    },
    [userAnswers]
  );

  const isQuestionAnswered = useCallback(
    (questionId: string) => {
      return userAnswers.has(questionId);
    },
    [userAnswers]
  );

  const getAnsweredCount = useMemo(() => {
    return userAnswers.size;
  }, [userAnswers]);

  return {
    // State
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    showScore,
    progress,
    isLastQuestion,

    // Actions
    setAnswer,
    nextQuestion,
    previousQuestion,
    calculateScore,
    resetQuiz,

    // Helpers
    getCurrentAnswer,
    isQuestionAnswered,
    getAnsweredCount,
  };
};
