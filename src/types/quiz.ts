// Base interfaces
export interface BaseQuestion {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: string[];
  feedback: string;
}

export interface Activity {
  activity_name: string;
  order: number;
  questions: Question[];
}

export interface Round {
  round_title: string;
  order: number;
  questions: Question[];
}

// Flow-specific interfaces
export interface Flow1Activity {
  activity_name: string;
  order: number;
  questions: BaseQuestion[];
}

export interface Flow2Activity {
  activity_name: string;
  order: number;
  questions: Round[];
}

export interface QuizData {
  name: string;
  heading: string;
  activities: Activity[];
}

// Union type for flexibility
export type Question = BaseQuestion;

// User answer tracking
export interface UserAnswer {
  questionId: string;
  answer: string;
  timestamp: number;
}

// Quiz state
export interface QuizState {
  currentActivity: number;
  currentQuestionIndex: number;
  currentRound?: number; // For Flow 2
  userAnswers: Map<string, string>;
  currentFlow: "flow1" | "flow2";
  isSubmitting: boolean;
}

// Score calculation
export interface ScoreResult {
  correct: number;
  total: number;
  percentage: number;
}

// Component props
export interface ErrorFindQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  userAnswer?: string;
  isSubmitting?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
}

export interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  color?: string;
}
