import { createContext, useContext, useReducer, ReactNode } from "react";
import { QuizEngine } from "@/services/quizEngine";
import type { QuizData, QuizState, ScoreResult } from "@/types/quiz";

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
  calculateScore: () => ScoreResult;
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
    // Debug logging can be enabled for troubleshooting
    // console.log('Setting answer:', { questionId, answer });
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

  const calculateScore = (): ScoreResult => {
    // Get questions based on flow
    let questions: any[];
    let userAnswersForScoring: Map<string, string>;
    
    if (flow === "flow1") {
      questions = quizData.activities[0]?.questions || [];
      userAnswersForScoring = state.userAnswers;
    } else {
      // For flow2, collect all questions from all rounds with unique identifiers
      questions = [];
      quizData.activities[1]?.questions?.forEach((round: any, roundIndex: number) => {
        round.questions.forEach((question: any) => {
          // Create a unique identifier for each question
          const uniqueQuestion = {
            ...question,
            uniqueId: `${roundIndex}-${question.order}` // This will be used for matching
          };
          questions.push(uniqueQuestion);
        });
      });
      
      // Convert Flow2 userAnswers to use unique question identifiers
      userAnswersForScoring = new Map<string, string>();
      state.userAnswers.forEach((answer, key) => {
        // Key is already in format "round-questionOrder", use it directly
        userAnswersForScoring.set(key, answer);
      });
    }
    
    const score = QuizEngine.calculateScore(userAnswersForScoring, questions);
    
    // Debug logging can be enabled for troubleshooting
    // console.log('Score Calculation Debug:', {
    //   flow,
    //   originalUserAnswers: Array.from(state.userAnswers.entries()),
    //   convertedUserAnswers: Array.from(userAnswersForScoring.entries()),
    //   questionsCount: questions.length,
    //   questions: questions.map(q => ({ 
    //     order: q.order, 
    //     uniqueId: q.uniqueId || q.order.toString(),
    //     stimulus: q.stimulus 
    //   })),
    //   score
    // });
    
    return score;
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
        calculateScore,
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
