import { createContext, useContext, useReducer, ReactNode } from "react";
import type { QuizData, QuizState } from "@/types/quiz";

interface QuizContextType {
  quizData: QuizData;
  currentFlow: "flow1" | "flow2";
  userAnswers: Map<string, string>;
  currentQuestionIndex: number;
  currentRound?: number;
  isSubmitting: boolean;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  nextRound: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

// Quiz reducer
type QuizAction =
  | { type: "SET_ANSWER"; payload: { questionId: string; answer: string } }
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "NEXT_ROUND" }
  | { type: "RESET_QUIZ" }
  | { type: "SET_SUBMITTING"; payload: boolean };

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        userAnswers: new Map(state.userAnswers).set(
          action.payload.questionId,
          action.payload.answer
        ),
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      };
    case "NEXT_ROUND":
      return {
        ...state,
        currentRound: (state.currentRound || 0) + 1,
        currentQuestionIndex: 0,
      };
    case "RESET_QUIZ":
      return {
        ...state,
        currentQuestionIndex: 0,
        currentRound: 0,
        userAnswers: new Map(),
        isSubmitting: false,
      };
    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };
    default:
      return state;
  }
};

interface QuizProviderProps {
  children: ReactNode;
  quizData: QuizData;
  flow: "flow1" | "flow2";
}

export const QuizProvider = ({ children, quizData, flow }: QuizProviderProps) => {
  const [state, dispatch] = useReducer(quizReducer, {
    currentActivity: 0,
    currentQuestionIndex: 0,
    currentRound: 0,
    userAnswers: new Map(),
    currentFlow: flow,
    isSubmitting: false,
  });

  const setAnswer = (questionId: string, answer: string) => {
    dispatch({ type: "SET_ANSWER", payload: { questionId, answer } });
  };

  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  const previousQuestion = () => {
    dispatch({ type: "PREVIOUS_QUESTION" });
  };

  const nextRound = () => {
    dispatch({ type: "NEXT_ROUND" });
  };

  const resetQuiz = () => {
    dispatch({ type: "RESET_QUIZ" });
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        currentFlow: flow,
        userAnswers: state.userAnswers,
        currentQuestionIndex: state.currentQuestionIndex,
        currentRound: state.currentRound,
        isSubmitting: state.isSubmitting,
        setAnswer,
        nextQuestion,
        previousQuestion,
        nextRound,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
};
