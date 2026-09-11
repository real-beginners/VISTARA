import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb } from "../config/firebaseAdmin";
import { isTripMember } from "./tripService";

export interface TripInvitation {
  id: string;
  tripId: string;
  senderId: string;
  recipientId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string | null;
  respondedAt?: string | null;
  tripDetails?: {
    title: string;
    destination: string;
  } | null;
}

const INVITATIONS_COLLECTION = "tripInvitations";
const TRIPS_COLLECTION = "trips";
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
 * Invite an existing Vistara user to a trip.
 */
export async function createTripInvitation(
  tripId: string,
  senderId: string,
  recipientId: string
): Promise<{ error?: string; status?: number; invitation?: TripInvitation }> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  if (senderId === recipientId) {
    return { error: "You cannot invite yourself to a trip.", status: 400 };
  }

  // 1. Check if trip exists
  const tripRef = db.collection(TRIPS_COLLECTION).doc(tripId);
  const tripDoc = await tripRef.get();
  if (!tripDoc.exists) {
    return { error: "Trip not found.", status: 404 };
  }

  // 2. Check if sender is a member of the trip
  const senderIsMember = await isTripMember(tripId, senderId);
  if (!senderIsMember) {
    return { error: "Only trip members can invite new travelers.", status: 403 };
  }

  // 3. Check if recipient exists in users collection
  const recipientDoc = await db.collection(USERS_COLLECTION).doc(recipientId).get();
  if (!recipientDoc.exists) {
    return { error: "Recipient user does not exist in Vistara.", status: 404 };
  }

  // 4. Check if recipient is already a member
  const recipientIsMember = await isTripMember(tripId, recipientId);
  if (recipientIsMember) {
    return { error: "User is already a member of this trip.", status: 400 };
  }

  // 5. Check if there is already a pending invitation for this recipient on this trip
  const existingPending = await db
    .collection(INVITATIONS_COLLECTION)
    .where("tripId", "==", tripId)
    .where("recipientId", "==", recipientId)
    .where("status", "==", "pending")
    .get();

  if (!existingPending.empty) {
    return { error: "A pending invitation already exists for this user on this trip.", status: 400 };
  }

  // 6. Create the invitation document
  const inviteRef = db.collection(INVITATIONS_COLLECTION).doc();
  const now = FieldValue.serverTimestamp();

  const inviteData = {
    id: inviteRef.id,
    tripId,
    senderId,
    recipientId,
    status: "pending" as const,
    createdAt: now,
    respondedAt: null,
  };

  await inviteRef.set(inviteData);

  const tripData = tripDoc.data();

  return {
    invitation: {
      id: inviteRef.id,
      tripId,
      senderId,
      recipientId,
      status: "pending",
      createdAt: new Date().toISOString(),
      respondedAt: null,
      tripDetails: tripData
        ? {
            title: tripData.title,
            destination: tripData.destination,
          }
        : null,
    },
  };
}

/**
 * Get all invitations received by the authenticated user.
 */
export async function getUserInvitations(recipientId: string): Promise<TripInvitation[]> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const snapshot = await db
    .collection(INVITATIONS_COLLECTION)
    .where("recipientId", "==", recipientId)
    .get();

  const invitations: TripInvitation[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    invitations.push({
      id: doc.id,
      tripId: data.tripId,
      senderId: data.senderId,
      recipientId: data.recipientId,
      status: data.status,
      createdAt: formatTimestamp(data.createdAt),
      respondedAt: formatTimestamp(data.respondedAt),
    });
  }

  // Sort in-memory by createdAt descending
  invitations.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return invitations;
}

/**
 * Accept a pending trip invitation.
 * Atomically updates the invitation and adds the recipient to trips/{tripId}/members/{recipientId}.
 */
export async function acceptTripInvitation(
  invitationId: string,
  recipientId: string
): Promise<{ error?: string; status?: number; tripId?: string }> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const inviteRef = db.collection(INVITATIONS_COLLECTION).doc(invitationId);
  const inviteSnapshot = await inviteRef.get();

  if (!inviteSnapshot.exists) {
    return { error: "Invitation not found.", status: 404 };
  }

  const inviteData = inviteSnapshot.data()!;

  // Verify recipient
  if (inviteData.recipientId !== recipientId) {
    return { error: "You are not authorized to accept this invitation.", status: 403 };
  }

  // Verify status is pending
  if (inviteData.status !== "pending") {
    return { error: `Invitation has already been ${inviteData.status}.`, status: 400 };
  }

  const tripId = inviteData.tripId;
  const tripRef = db.collection(TRIPS_COLLECTION).doc(tripId);
  const tripSnapshot = await tripRef.get();

  if (!tripSnapshot.exists) {
    return { error: "The associated trip no longer exists.", status: 404 };
  }

  const memberRef = tripRef.collection("members").doc(recipientId);
  const now = FieldValue.serverTimestamp();

  // Atomically add membership, update memberUids array, and update invitation status
  const batch = db.batch();

  batch.set(memberRef, {
    uid: recipientId,
    role: "member",
    joinedAt: now,
  });

  batch.update(tripRef, {
    memberUids: FieldValue.arrayUnion(recipientId),
    updatedAt: now,
  });

  batch.update(inviteRef, {
    status: "accepted",
    respondedAt: now,
  });

  await batch.commit();

  return { tripId };
}

/**
 * Decline a pending trip invitation.
 */
export async function declineTripInvitation(
  invitationId: string,
  recipientId: string
): Promise<{ error?: string; status?: number }> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore database is not available.");
  }

  const inviteRef = db.collection(INVITATIONS_COLLECTION).doc(invitationId);
  const inviteSnapshot = await inviteRef.get();

  if (!inviteSnapshot.exists) {
    return { error: "Invitation not found.", status: 404 };
  }

  const inviteData = inviteSnapshot.data()!;

  // Verify recipient
  if (inviteData.recipientId !== recipientId) {
    return { error: "You are not authorized to decline this invitation.", status: 403 };
  }

  // Verify status is pending
  if (inviteData.status !== "pending") {
    return { error: `Invitation has already been ${inviteData.status}.`, status: 400 };
  }

  await inviteRef.update({
    status: "declined",
    respondedAt: FieldValue.serverTimestamp(),
  });

  return {};
}
