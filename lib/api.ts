import { getCurrentUser } from "./auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Obtain a fresh Firebase Auth ID token from the currently authenticated user.
 */
export async function getAuthToken(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return user.getIdToken();
}

export interface CreateTripPayload {
  title: string;
  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
}

export interface BackendTripMember {
  uid: string;
  role: "owner" | "member";
  joinedAt: string | null;
}

export interface BackendTrip {
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
  members?: BackendTripMember[];
}

/**
 * Call POST /api/trips with the authenticated user's ID token.
 */
export async function createBackendTrip(payload: CreateTripPayload): Promise<BackendTrip> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please sign in to create a trip.");
  }

  const res = await fetch(`${API_BASE_URL}/api/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create trip (${res.status})`);
  }

  return res.json();
}

/**
 * Call GET /api/trips/:tripId with the authenticated user's ID token.
 */
export async function getBackendTrip(tripId: string): Promise<BackendTrip> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please sign in to view this trip.");
  }

  const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to load trip (${res.status})`);
  }

  return res.json();
}
