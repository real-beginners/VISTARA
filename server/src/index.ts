import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import cors from "cors";
import {
  initializeFirebaseAdmin,
  checkFirestoreConnection,
  isFirebaseAdminConfigured,
} from "./config/firebaseAdmin";
import { requireAuth } from "./middleware/auth";
import userRoutes from "./routes/userRoutes";
import tripRoutes from "./routes/tripRoutes";
import invitationRoutes from "./routes/invitationRoutes";
import aiRoutes from "./routes/aiRoutes";



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

/**
 * GET /api/me
 * Protected endpoint returning safe user identity details from verified Firebase ID token.
 * Does not read or write any Firestore application data.
 */
app.get("/api/me", requireAuth, (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      error: "Unauthorized",
      message: "User identity could not be verified.",
    });
    return;
  }

  res.json({
    uid: req.user.uid,
    email: req.user.email ?? null,
  });
});

// User profile routes: GET /api/users/me, PUT /api/users/me
app.use("/api/users", userRoutes);

// Trip routes: POST /api/trips, GET /api/trips, GET /api/trips/:tripId, POST /api/trips/:tripId/invitations
app.use("/api/trips", tripRoutes);

// Trip invitation routes: GET /api/trip-invitations, POST /api/trip-invitations/:invitationId/accept, POST /api/trip-invitations/:invitationId/decline
app.use("/api/trip-invitations", invitationRoutes);

// AI test route: POST /api/ai/test
app.use("/api/ai", aiRoutes);



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
