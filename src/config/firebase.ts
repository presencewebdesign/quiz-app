import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
// Replace these values with your actual Firebase config
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbd1PC4_SXts0FvG5zVr3LdJ2OWHxg01c",
  authDomain: "quiz-app-98108.firebaseapp.com",
  projectId: "quiz-app-98108",
  storageBucket: "quiz-app-98108.firebasestorage.app",
  messagingSenderId: "1061145609546",
  appId: "1:1061145609546:web:2d9bb7d94e58f422462db3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
export default app;
