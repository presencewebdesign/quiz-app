import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// CORS proxy function for quiz data
export const getQuizData = onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    logger.info("Fetching quiz data from S3");

    // Fetch data from S3
    const response = await fetch(
      "https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json"
    );

    if (!response.ok) {
      throw new Error(`S3 request failed: ${response.status}`);
    }

    const data = await response.json();

    logger.info("Successfully fetched quiz data", {
      dataSize: JSON.stringify(data).length,
    });

    // Return the data with proper CORS headers
    res.status(200).json(data);
  } catch (error) {
    logger.error("Error fetching quiz data:", error);
    res.status(500).json({ error: "Failed to fetch quiz data" });
  }
});
