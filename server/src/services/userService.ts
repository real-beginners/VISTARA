import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb } from "../config/firebaseAdmin";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UpdateProfileInput {
  displayName?: string | null;
  photoURL?: string | null;
}

const USERS_COLLECTION = "users";

function formatTimestamp(ts: unknown): string | null {
  if (!ts) return null;
  if (typeof ts === "object" && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  if (ts instanceof Date) {
    return ts.toISOString();
  }
  return String(ts);
}

/**
 * Retrieve user profile document from Firestore collection `users/{uid}`.
 * Returns null if the document does not exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const docRef = db.collection(USERS_COLLECTION).doc(uid);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) return null;

  return {
    uid: data.uid || uid,
    email: data.email ?? null,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  };
}

/**
 * Create or update the authenticated user's own profile document in `users/{uid}`.
 * Only sanitized fields (displayName, photoURL) are written.
 * Server timestamps are applied to createdAt (if new) and updatedAt.
 */
export async function upsertUserProfile(
  uid: string,
  email: string | null,
  updates: UpdateProfileInput
): Promise<UserProfile> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const docRef = db.collection(USERS_COLLECTION).doc(uid);
  const snapshot = await docRef.get();

  const now = FieldValue.serverTimestamp();

  if (!snapshot.exists) {
    const newProfile = {
      uid,
      email: email ?? null,
      displayName: updates.displayName ?? null,
      photoURL: updates.photoURL ?? null,
      createdAt: now,
      updatedAt: now,
    };
    await docRef.set(newProfile);
  } else {
    const updateData: Record<string, unknown> = {
      updatedAt: now,
    };

    if (updates.displayName !== undefined) {
      updateData.displayName = updates.displayName;
    }
    if (updates.photoURL !== undefined) {
      updateData.photoURL = updates.photoURL;
    }
    // Set email if it wasn't previously set and is provided by verified token
    if (email && !snapshot.data()?.email) {
      updateData.email = email;
    }

    await docRef.update(updateData);
  }

  const updatedSnapshot = await docRef.get();
  const data = updatedSnapshot.data() || {};

  return {
    uid: data.uid || uid,
    email: data.email ?? null,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  };
}
