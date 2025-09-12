import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import { queryClient } from "@/services/queryClient";
import { HomePage } from "@/pages/HomePage";
import { QuizPage } from "@/pages/QuizPage";
import { ScorePage } from "@/pages/ScorePage";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ErrorFallback } from "@/components/common/ErrorFallback";
import "@/styles/globals.scss";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingScreen />}>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz/:flow" element={<QuizPage />} />
              <Route path="/score" element={<ScorePage />} />
            </Routes>
          </Router>
        </Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
