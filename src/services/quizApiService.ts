import { useQuery } from "@tanstack/react-query";
import type { QuizData, Flow1Activity, Flow2Activity } from "@/types/quiz";

const QUIZ_QUERY_KEY = "quiz-data";

// Use proxy in development, Firebase Function in production
const API_URL = import.meta.env.DEV
  ? "/api/payload.json"
  : "https://us-central1-quiz-app-98108.cloudfunctions.net/getQuizData";

// Data normalization utilities
const normalizeQuizData = (rawData: any): QuizData => {
  return {
    name: rawData.name || "Error Find Quiz",
    heading: rawData.heading || "Find mistakes in written text",
    activities: rawData.activities?.map(normalizeActivity) || [],
  };
};

const normalizeActivity = (activity: any) => {
  return {
    activity_name: activity.activity_name || "Unknown Activity",
    order: activity.order || 0,
    questions:
      activity.questions?.map((questionOrRound: any) => {
        // Check if this is a round (has round_title and questions array) or a direct question
        if (questionOrRound.round_title && questionOrRound.questions) {
          // This is a round - normalize the round structure
          return {
            round_title: questionOrRound.round_title,
            order: questionOrRound.order || 0,
            questions: questionOrRound.questions.map(normalizeQuestion),
          };
        } else {
          // This is a direct question - normalize it
          return normalizeQuestion(questionOrRound);
        }
      }) || [],
  };
};

const normalizeQuestion = (question: any) => {
  return {
    is_correct: Boolean(question.is_correct),
    stimulus: question.stimulus || "",
    order: question.order || 0,
    user_answers: question.user_answers || [],
    feedback: question.feedback || "",
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
