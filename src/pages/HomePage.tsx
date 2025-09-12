import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/common/Button";
import styles from "./HomePage.module.scss";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleFlow1 = () => navigate("/quiz/flow1");
  const handleFlow2 = () => navigate("/quiz/flow2");

  return (
    <Layout title="Error Find Quiz">
      <div className={styles.homePage}>
        <div className={styles.welcomeSection}>
          <h2>Welcome to Error Find!</h2>
          <p>This game teaches you to find mistakes in written text.</p>
        </div>

        <div className={styles.flowSelection}>
          <div className={styles.flowCard}>
            <h3>Flow 1: Sequential Questions</h3>
            <p>Answer all questions in sequence, then see your score.</p>
            <Button onClick={handleFlow1} size="large">
              Start Flow 1
            </Button>
          </div>

          <div className={styles.flowCard}>
            <h3>Flow 2: Rounds-based Questions</h3>
            <p>Answer questions in rounds, with breaks between rounds.</p>
            <Button onClick={handleFlow2} size="large">
              Start Flow 2
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
