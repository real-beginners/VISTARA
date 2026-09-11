import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import cors from "cors";
import {
  initializeFirebaseAdmin,
  checkFirestoreConnection,
  isFirebaseAdminConfigured,
} from "./config/firebaseAdmin";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Basic middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// Attempt early initialization on startup
if (isFirebaseAdminConfigured()) {
  initializeFirebaseAdmin();
}

/**
 * GET /api/health
 * Health check endpoint showing Express status and Firebase/Firestore connectivity
 */
app.get("/api/health", async (_req: Request, res: Response) => {
  const firebaseConfigured = isFirebaseAdminConfigured();
  let firestoreCheck = {
    connected: false,
    message: "Firebase Admin is not configured yet. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
  };

  if (firebaseConfigured) {
    firestoreCheck = await checkFirestoreConnection();
  }

  const statusCode = firebaseConfigured && !firestoreCheck.connected ? 503 : 200;

  res.status(statusCode).json({
    status: firestoreCheck.connected ? "ok" : firebaseConfigured ? "degraded" : "ready",
    server: "VISTARA Express Backend",
    timestamp: new Date().toISOString(),
    port: Number(PORT),
    firebase: {
      configured: firebaseConfigured,
      firestore: firestoreCheck,
    },
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Server] VISTARA Express backend running on http://localhost:${PORT}`);
  console.log(`[Server] Health endpoint available at http://localhost:${PORT}/api/health`);
  if (!isFirebaseAdminConfigured()) {
    console.log(
      "[Server] Notice: Firebase Admin credentials not found in environment. Provide them in server/.env when ready."
    );
  }
});

export default app;
