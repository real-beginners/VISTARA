import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, hasFirebaseConfig } from "./firebase";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  created_at: string;
};

export type OnboardingPreferences = {
  interests: string[];
  travel_companions: string;
  budget: string;
  travel_style: string;
  distance: string;
  priorities: string[];
};

export type AuthResult = {
  user: User | null;
  needsVerification: boolean;
};

export function isAuthConfigured(): boolean {
  return hasFirebaseConfig();
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email address already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled in the Firebase Console.";
      case "auth/weak-password":
        return "Your password must be at least 6 characters long.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please check your credentials.";
      case "auth/popup-closed-by-user":
        return "Sign in with Google was canceled.";
      case "auth/popup-blocked":
        return "Popup was blocked by your browser. Please allow popups for this site.";
      case "auth/network-request-failed":
        return "Network connection error. Please verify your internet connection.";
      case "auth/too-many-requests":
        return "Too many unsuccessful attempts. Please try again later.";
      default:
        break;
    }
  }
  if (error instanceof Error) return error.message;
  return "An unexpected authentication error occurred. Please try again.";
}

export async function signUp(input: {
  email: string;
  password: string;
  fullName: string;
  username?: string;
}): Promise<AuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* environment variables to enable account creation.");
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
    if (credential.user && input.fullName) {
      await firebaseUpdateProfile(credential.user, {
        displayName: input.fullName.trim(),
      });
    }

    // Save initial profile metadata locally until Firestore is initialized
    if (typeof window !== "undefined" && credential.user) {
      const initialProfile: Profile = {
        id: credential.user.uid,
        full_name: input.fullName.trim() || null,
        username: input.username?.trim().toLowerCase() || null,
        email: credential.user.email || null,
        avatar_url: credential.user.photoURL || null,
        bio: null,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
      };
      window.localStorage.setItem(`vistara_profile_${credential.user.uid}`, JSON.stringify(initialProfile));
    }

    return { user: credential.user, needsVerification: false };
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function signIn(identifier: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* environment variables to enable sign in.");
  }

  const email = identifier.trim();
  if (!email.includes("@")) {
    throw new Error("Please enter a valid email address to sign in with Firebase.");
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function signInWithGoogle(_nextPath = "/onboarding"): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Google sign in is unavailable until Firebase is configured with environment variables.");
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* environment variables to enable password recovery.");
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) return Promise.resolve(null);

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Kept for backward compatibility with existing callers
export async function getSession(): Promise<{ user: User } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return { user };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(`vistara_profile_${userId}`);
    if (stored) {
      try {
        return JSON.parse(stored) as Profile;
      } catch {
        // Fall back below
      }
    }
  }

  const auth = getFirebaseAuth();
  const currentUser = auth?.currentUser;
  if (currentUser && currentUser.uid === userId) {
    return {
      id: currentUser.uid,
      full_name: currentUser.displayName || null,
      username: currentUser.email?.split("@")[0] || null,
      email: currentUser.email || null,
      avatar_url: currentUser.photoURL || null,
      bio: null,
      onboarding_completed: true,
      created_at: new Date().toISOString(),
    };
  }

  return null;
}

export async function isUsernameAvailable(_username: string): Promise<boolean | null> {
  // Username checking will be verified via Firestore when Firestore is connected.
  return true;
}

export async function updateOnboarding(userId: string, preferences: OnboardingPreferences): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(`vistara_preferences_${userId}`, JSON.stringify(preferences));
    const existing = await getProfile(userId);
    const updated: Profile = {
      ...(existing || {
        id: userId,
        full_name: null,
        username: null,
        email: null,
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
      }),
      onboarding_completed: true,
    };
    window.localStorage.setItem(`vistara_profile_${userId}`, JSON.stringify(updated));
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "username" | "bio" | "avatar_url">>
): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth?.currentUser && auth.currentUser.uid === userId && updates.full_name) {
    try {
      await firebaseUpdateProfile(auth.currentUser, { displayName: updates.full_name });
    } catch {
      // Non-blocking
    }
  }

  if (typeof window !== "undefined") {
    const existing = await getProfile(userId);
    if (existing) {
      const updated: Profile = { ...existing, ...updates };
      window.localStorage.setItem(`vistara_profile_${userId}`, JSON.stringify(updated));
    }
  }
}

export async function resendVerification(_email: string): Promise<void> {
  // Handled via Firebase Auth sendEmailVerification when needed
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await firebaseSignOut(auth);
  }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("vistara_preview_profile");
  }
}
