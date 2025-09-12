import { useQuizData } from "@/services/quizApiService";
import { QuizProvider } from "@/contexts/QuizContext";
import { Flow1Quiz } from "./Flow1Quiz";
import { Flow2Quiz } from "./Flow2Quiz";

interface QuizContentProps {
  flow: "flow1" | "flow2";
}

export const QuizContent = ({ flow }: QuizContentProps) => {
  const { data: quizData } = useQuizData();

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <QuizProvider quizData={quizData} flow={flow}>
      {flow === "flow1" ? <Flow1Quiz /> : <Flow2Quiz />}
    </QuizProvider>
  );
};
