import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb } from "../config/firebaseAdmin";

export interface TripMember {
  uid: string;
  role: "owner" | "member";
  joinedAt: string | null;
}

export interface TripDocument {
  id: string;
  ownerId: string;
  title: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  memberUids: string[];
  createdAt: string | null;
  updatedAt: string | null;
  members?: TripMember[];
  driveFolderId?: string;
  driveFolderUrl?: string;
}

export interface CreateTripInput {
  title: string;
  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
}

const TRIPS_COLLECTION = "trips";

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
 * Create a new trip document with the authenticated user as the owner.
 * Atomically creates the trip document and the owner's membership record in the subcollection.
 */
export async function createTrip(
  ownerId: string,
  input: CreateTripInput
): Promise<TripDocument> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const tripRef = db.collection(TRIPS_COLLECTION).doc();
  const memberRef = tripRef.collection("members").doc(ownerId);
  const now = FieldValue.serverTimestamp();

  const tripData = {
    id: tripRef.id,
    ownerId,
    title: input.title,
    destination: input.destination,
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
    budget: input.budget !== undefined ? input.budget : null,
    memberUids: [ownerId],
    createdAt: now,
    updatedAt: now,
  };

  const memberData = {
    uid: ownerId,
    role: "owner" as const,
    joinedAt: now,
  };

  const batch = db.batch();
  batch.set(tripRef, tripData);
  batch.set(memberRef, memberData);
  await batch.commit();

  const snapshot = await tripRef.get();
  const created = snapshot.data() || tripData;

  return {
    id: tripRef.id,
    ownerId,
    title: created.title,
    destination: created.destination,
    startDate: created.startDate ?? null,
    endDate: created.endDate ?? null,
    budget: created.budget ?? null,
    memberUids: [ownerId],
    createdAt: formatTimestamp(created.createdAt),
    updatedAt: formatTimestamp(created.updatedAt),
    members: [
      {
        uid: ownerId,
        role: "owner",
        joinedAt: formatTimestamp(created.createdAt),
      },
    ],
  };
}

/**
 * Check if a user is a member of the given trip.
 */
export async function isTripMember(tripId: string, userId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  const memberDoc = await db
    .collection(TRIPS_COLLECTION)
    .doc(tripId)
    .collection("members")
    .doc(userId)
    .get();

  return memberDoc.exists;
}

/**
 * Get all trips where the user is a member.
 */
export async function getUserTrips(userId: string): Promise<TripDocument[]> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  // Query trips where memberUids contains the authenticated user's UID
  const snapshot = await db
    .collection(TRIPS_COLLECTION)
    .where("memberUids", "array-contains", userId)
    .get();

  const trips: TripDocument[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    trips.push({
      id: doc.id,
      ownerId: data.ownerId,
      title: data.title,
      destination: data.destination,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      budget: data.budget ?? null,
      memberUids: data.memberUids || [data.ownerId],
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
    });
  }

  // Sort in-memory by createdAt descending to avoid requiring composite indexes
  trips.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return trips;
}

/**
 * Get a single trip with its members.
 * Verifies caller is a member. Returns null if not found.
 */
export async function getTripById(
  tripId: string,
  userId: string
): Promise<{ trip: TripDocument | null; isMember: boolean; tripExists: boolean }> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const tripRef = db.collection(TRIPS_COLLECTION).doc(tripId);
  const tripSnapshot = await tripRef.get();

  if (!tripSnapshot.exists) {
    return { trip: null, isMember: false, tripExists: false };
  }

  const memberSnapshot = await tripRef.collection("members").doc(userId).get();
  if (!memberSnapshot.exists) {
    return { trip: null, isMember: false, tripExists: true };
  }

  const tripData = tripSnapshot.data()!;
  const membersSnapshot = await tripRef.collection("members").get();

  const members: TripMember[] = membersSnapshot.docs.map((doc) => {
    const mData = doc.data();
    return {
      uid: doc.id,
      role: mData.role || "member",
      joinedAt: formatTimestamp(mData.joinedAt),
    };
  });

  return {
    isMember: true,
    tripExists: true,
    trip: {

      id: tripSnapshot.id,
      ownerId: tripData.ownerId,
      title: tripData.title,
      destination: tripData.destination,
      startDate: tripData.startDate ?? null,
      endDate: tripData.endDate ?? null,
      budget: tripData.budget ?? null,
      memberUids: tripData.memberUids || [tripData.ownerId],
      createdAt: formatTimestamp(tripData.createdAt),
      updatedAt: formatTimestamp(tripData.updatedAt),
      members,
      driveFolderId: tripData.driveFolderId,
      driveFolderUrl: tripData.driveFolderUrl,
    },
  };
}

/**
 * Updates a trip with its associated Google Drive folder information.
 */
export async function updateTripDriveFolder(
  tripId: string,
  driveFolderId: string,
  driveFolderUrl: string
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const tripRef = db.collection(TRIPS_COLLECTION).doc(tripId);
  await tripRef.update({
    driveFolderId,
    driveFolderUrl,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export interface TripMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

/**
 * Sends a message in the trip's group chat.
 */
export async function sendTripMessage(
  tripId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<TripMessage> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const messagesRef = db.collection(TRIPS_COLLECTION).doc(tripId).collection("messages");
  const newMessageRef = messagesRef.doc();
  const now = FieldValue.serverTimestamp();

  const messageData = {
    id: newMessageRef.id,
    senderId,
    senderName,
    text: text.trim(),
    createdAt: now,
  };

  await newMessageRef.set(messageData);

  return {
    ...messageData,
    createdAt: new Date().toISOString(), // Best approximation before fetching
  };
}

/**
 * Gets all messages for a trip, ordered by creation time.
 */
export async function getTripMessages(tripId: string): Promise<TripMessage[]> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const messagesRef = db.collection(TRIPS_COLLECTION).doc(tripId).collection("messages");
  const snapshot = await messagesRef.orderBy("createdAt", "asc").get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.text,
      createdAt: formatTimestamp(data.createdAt) || new Date().toISOString(),
    };
  });
}
