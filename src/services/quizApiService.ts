import { useQuery } from "@tanstack/react-query";
import type { QuizData, Flow1Activity, Flow2Activity } from "@/types/quiz";

const QUIZ_QUERY_KEY = "quiz-data";
// Use Firebase Function for CORS proxy
const API_URL =
  "https://us-central1-quiz-app-98108.cloudfunctions.net/getQuizData";

// Type guards
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Data normalization utilities
const normalizeQuizData = (rawData: unknown): QuizData => {
  const data = isRecord(rawData) ? rawData : {};
  return {
    name: typeof data.name === "string" ? data.name : "Error Find Quiz",
    heading:
      typeof data.heading === "string"
        ? data.heading
        : "Find mistakes in written text",
    activities: isArray(data.activities)
      ? data.activities.map(normalizeActivity)
      : [],
  };
};

const normalizeActivity = (activity: unknown) => {
  const act = isRecord(activity) ? activity : {};
  return {
    activity_name:
      typeof act.activity_name === "string"
        ? act.activity_name
        : "Unknown Activity",
    order: typeof act.order === "number" ? act.order : 0,
    questions: isArray(act.questions)
      ? act.questions.map((questionOrRound: unknown) => {
          const qr = isRecord(questionOrRound) ? questionOrRound : {};
          // Check if this is a round (has round_title and questions array) or a direct question
          if (typeof qr.round_title === "string" && isArray(qr.questions)) {
            // This is a round - normalize the round structure
            return {
              round_title: qr.round_title,
              order: typeof qr.order === "number" ? qr.order : 0,
              questions: qr.questions.map(normalizeQuestion),
            };
          } else {
            // This is a direct question - normalize it
            return normalizeQuestion(questionOrRound);
          }
        })
      : [],
  };
};

const normalizeQuestion = (question: unknown) => {
  const q = isRecord(question) ? question : {};
  return {
    is_correct: Boolean(q.is_correct),
    stimulus: typeof q.stimulus === "string" ? q.stimulus : "",
    order: typeof q.order === "number" ? q.order : 0,
    user_answers: isArray(q.user_answers)
      ? q.user_answers.filter(
          (answer): answer is string => typeof answer === "string"
        )
      : [],
    feedback: typeof q.feedback === "string" ? q.feedback : "",
  };
};

// Main quiz data query
export const useQuizData = () => {
  return useQuery({
    queryKey: [QUIZ_QUERY_KEY],
    queryFn: async (): Promise<QuizData> => {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch quiz data: ${response.status}`);
      }

      const data = await response.json();
      return normalizeQuizData(data);
    },
  });
};

// Flow-specific queries
export const useFlow1Data = () => {
  return useQuery({
    queryKey: [QUIZ_QUERY_KEY, "flow1"],
    queryFn: async (): Promise<Flow1Activity> => {
      const data = await fetchQuizData();
      return data.activities[0] as Flow1Activity;
    },
  });
};

export const useFlow2Data = () => {
  return useQuery({
    queryKey: [QUIZ_QUERY_KEY, "flow2"],
    queryFn: async (): Promise<Flow2Activity> => {
      const data = await fetchQuizData();
      return data.activities[1] as unknown as Flow2Activity;
    },
  });
};

// Helper function to fetch raw data
const fetchQuizData = async (): Promise<QuizData> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch quiz data: ${response.status}`);
  }
  const data = await response.json();
  return normalizeQuizData(data);
};
