import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "./supabase";

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

export function isAuthConfigured() {
  return hasSupabaseConfig();
}

export async function signUp(input: { email: string; password: string; fullName: string; username: string }): Promise<AuthResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured. Add the public environment variables to enable account creation.");

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.fullName, username: input.username } },
  });

  if (error) throw error;
  return { user: data.user, needsVerification: Boolean(data.user && !data.session) };
}

export async function signIn(identifier: string, password: string): Promise<User> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured. Add the public environment variables to enable sign in.");

  let email = identifier.trim();
  if (!email.includes("@")) {
    const response = await fetch("/api/auth/sign-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: email.toLowerCase(), password }) });
    const result = await response.json().catch(() => null) as { session?: { access_token: string; refresh_token: string }; error?: string } | null;
    if (!response.ok || !result?.session) throw new Error(result?.error ?? "We couldn't sign you in with those details.");
    const { data, error } = await supabase.auth.setSession(result.session);
    if (error || !data.user) throw new Error("We couldn't sign you in with those details.");
    return data.user;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error("We couldn't sign you in with those details.");
  return data.user;
}

export async function signInWithGoogle(nextPath = "/onboarding") {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Google sign in is unavailable until Supabase is configured.");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${nextPath}` },
  });
  if (error) throw error;
}

export async function sendPasswordReset(email: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured. Add the public environment variables to enable password recovery.");
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
  if (error) throw error;
}

export async function getSession() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle<Profile>();
  return data;
}

export async function isUsernameAvailable(username: string) {
  const response = await fetch("/api/auth/check-username", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username.toLowerCase() }) });
  if (!response.ok) return null;
  const result = await response.json() as { available?: boolean | null };
  return result.available ?? null;
}

export async function updateOnboarding(userId: string, preferences: OnboardingPreferences) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error: preferenceError } = await supabase.from("travel_preferences").upsert({ user_id: userId, ...preferences }, { onConflict: "user_id" });
  if (preferenceError) throw preferenceError;

  const { error: profileError } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
  if (profileError) throw profileError;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, "full_name" | "username" | "bio" | "avatar_url">>) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;
}

export async function resendVerification(email: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  if (supabase) await supabase.auth.signOut();
  if (typeof window !== "undefined") window.localStorage.removeItem("vistara_preview_profile");
}
