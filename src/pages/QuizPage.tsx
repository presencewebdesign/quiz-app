import { Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
// useQuizData is used in QuizContent component
import { QuizLoadingSkeleton } from "@/components/common/QuizLoadingSkeleton";
import { QuizContent } from "./QuizContent";

export const QuizPage = () => {
  const { flow } = useParams<{ flow: "flow1" | "flow2" }>();

  if (!flow || !["flow1", "flow2"].includes(flow)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Suspense fallback={<QuizLoadingSkeleton />}>
        <QuizContent flow={flow} />
      </Suspense>
    </Layout>
  );
};
