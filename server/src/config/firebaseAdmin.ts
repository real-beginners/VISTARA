import admin from "firebase-admin";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let isInitialized = false;
let db: Firestore | null = null;

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

export function initializeFirebaseAdmin(): admin.app.App | null {
  if (admin.apps.length > 0) {
    isInitialized = true;
    return admin.app();
  }

  if (!isFirebaseAdminConfigured()) {
    console.warn(
      "[Firebase Admin] Missing required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). Admin SDK not initialized."
    );
    return null;
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Format private key properly if newlines were escaped in .env
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    isInitialized = true;
    console.log(`[Firebase Admin] Successfully initialized for project: ${projectId}`);
    return app;
  } catch (error) {
    console.error("[Firebase Admin] Initialization failed:", error);
    return null;
  }
}

let authAdmin: admin.auth.Auth | null = null;

export function getFirebaseAuthAdmin(): admin.auth.Auth | null {
  if (!authAdmin) {
    const app = initializeFirebaseAdmin();
    if (app) {
      authAdmin = admin.auth(app);
    }
  }
  return authAdmin;
}

export function getFirestoreDb(): Firestore | null {
  if (!db) {
    const app = initializeFirebaseAdmin();
    if (app) {
      db = getFirestore(app);
    }
  }
  return db;
}


export async function checkFirestoreConnection(): Promise<{
  connected: boolean;
  message: string;
  projectId?: string;
}> {
  if (!isFirebaseAdminConfigured()) {
    return {
      connected: false,
      message: "Firebase Admin credentials are not set in environment variables.",
    };
  }

  try {
    const firestore = getFirestoreDb();
    if (!firestore) {
      return {
        connected: false,
        message: "Failed to obtain Firestore instance from Firebase Admin App.",
      };
    }

    // Read-only metadata check: list top-level collections without writing or creating any data
    await firestore.listCollections();

    return {
      connected: true,
      message: "Firestore connected successfully.",
      projectId: process.env.FIREBASE_PROJECT_ID,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      connected: false,
      message: `Firestore connection check failed: ${errMessage}`,
      projectId: process.env.FIREBASE_PROJECT_ID,
    };
  }
}

export { admin };
