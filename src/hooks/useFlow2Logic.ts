import { useState, useCallback, useMemo } from "react";
import { QuizEngine } from "@/services/quizEngine";
import type { Flow2Activity, Question, ScoreResult } from "@/types/quiz";

interface UseFlow2LogicProps {
  activity: Flow2Activity;
}

export const useFlow2Logic = ({ activity }: UseFlow2LogicProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestionInRound, setCurrentQuestionInRound] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(
    new Map()
  );
  const [showScore, setShowScore] = useState(false);

  const currentRoundData = activity.questions[currentRound];
  const currentQuestion = currentRoundData?.questions[currentQuestionInRound];
  const isLastRound = currentRound >= activity.questions.length - 1;
  const isLastQuestionInRound =
    currentQuestionInRound >= (currentRoundData?.questions.length || 0) - 1;
  const overallProgress =
    ((currentRound + 1) / activity.questions.length) * 100;

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setUserAnswers((prev) => new Map(prev).set(questionId, answer));
  }, []);

  const nextQuestionInRound = useCallback(() => {
    if (!isLastQuestionInRound) {
      setCurrentQuestionInRound((prev) => prev + 1);
    }
  }, [isLastQuestionInRound]);

  const nextRound = useCallback(() => {
    if (isLastRound) {
      setShowScore(true);
    } else {
      setCurrentQuestionInRound(0);
      setCurrentRound((prev) => prev + 1);
    }
  }, [isLastRound]);

  const calculateScore = useCallback((): ScoreResult => {
    // Collect all questions from all rounds
    const allQuestions: Question[] = [];
    activity.questions.forEach((round) => {
      allQuestions.push(...round.questions);
    });

    // Convert userAnswers to use question order as key for score calculation
    const scoreAnswers = new Map<string, string>();
    userAnswers.forEach((answer, key) => {
      // Extract question order from key (format: "round-questionOrder")
      const questionOrder = key.split("-")[1];
      scoreAnswers.set(questionOrder, answer);
    });

    return QuizEngine.calculateScore(scoreAnswers, allQuestions);
  }, [userAnswers, activity]);

  const areAllQuestionsInRoundAnswered = useCallback(() => {
    return currentRoundData.questions.every((q) => {
      const uniqueKey = `${currentRound}-${q.order}`;
      return userAnswers.has(uniqueKey);
    });
  }, [currentRoundData, userAnswers, currentRound]);

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
    currentRound,
    currentQuestionInRound,
    currentQuestion,
    currentRoundData,
    userAnswers,
    showScore,
    overallProgress,
    isLastRound,
    isLastQuestionInRound,

    // Actions
    setAnswer,
    nextQuestionInRound,
    nextRound,
    calculateScore,

    // Helpers
    getCurrentAnswer,
    isQuestionAnswered,
    getAnsweredCount,
    areAllQuestionsInRoundAnswered,
  };
};
