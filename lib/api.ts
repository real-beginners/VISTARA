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

export interface AiTripSuggestionsResponse {
  tripId: string;
  destination: string;
  suggestions: string;
}

/**
 * Call POST /api/ai/trip-suggestions with the authenticated user's ID token.
 * Returns Gemini-generated activity suggestions for the given trip.
 */
export async function getAiTripSuggestions(tripId: string): Promise<AiTripSuggestionsResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please sign in to get AI suggestions.");
  }

  const res = await fetch(`${API_BASE_URL}/api/ai/trip-suggestions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tripId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get AI suggestions (${res.status})`);
  }

  return res.json();
}

export interface DriveFolderResponse {
  folderId: string;
  folderUrl: string;
}

/**
 * Initializes a Google Drive folder for the trip.
 */
export async function initTripDriveFolder(tripId: string, accessToken: string): Promise<DriveFolderResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required.");
  }

  const res = await fetch(`${API_BASE_URL}/api/drive/init-folder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tripId, accessToken }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to initialize Drive folder (${res.status})`);
  }

  return res.json();
}

export interface UploadPhotoResponse {
  fileName: string;
  fileUrl: string;
  fileId: string;
}

/**
 * Uploads a photo to the initialized Google Drive folder for the trip.
 */
export async function uploadTripPhoto(
  tripId: string,
  file: File,
  accessToken: string
): Promise<UploadPhotoResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required.");
  }

  const formData = new FormData();
  formData.append("tripId", tripId);
  formData.append("accessToken", accessToken);
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/drive/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: do not set Content-Type header manually for FormData, browser will set it with boundary
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to upload photo (${res.status})`);
  }

  return res.json();
}

export interface TripMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export async function getTripMessages(tripId: string): Promise<TripMessage[]> {
  const token = await getAuthToken();
  if (!token) throw new Error("Authentication required.");

  const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch messages (${res.status})`);
  }

  return res.json();
}

export async function sendTripMessage(tripId: string, text: string): Promise<TripMessage> {
  const token = await getAuthToken();
  if (!token) throw new Error("Authentication required.");

  const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send message (${res.status})`);
  }

  return res.json();
}
