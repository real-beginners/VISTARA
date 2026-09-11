"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthNotice } from "@/components/auth/AuthNotice";
import { AuthVisual } from "@/components/auth/AuthVisual";
import { PasswordField } from "@/components/auth/PasswordField";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { isAuthConfigured, isUsernameAvailable, signUp } from "@/lib/auth";

function passwordScore(password: string) {
  return [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
}

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [usernameState, setUsernameState] = useState<"idle" | "checking" | "available" | "taken" | "unknown">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isAuthConfigured();
  const score = passwordScore(password);

  async function checkUsername() {
    const normalized = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(normalized)) return setUsernameState("idle");
    setUsernameState("checking");
    const available = await isUsernameAvailable(normalized);
    setUsernameState(available === null ? "unknown" : available ? "available" : "taken");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) return setError("Complete all required fields to continue.");
    if (!/^[a-z0-9_]{3,20}$/.test(username.trim().toLowerCase())) return setError("Username must be 3–20 characters using lowercase letters, numbers, or underscores.");
    if (password.length < 6) return setError("Use at least 6 characters for your password.");
    if (password !== confirmPassword) return setError("Your passwords do not match.");
    if (!terms) return setError("Please accept the Terms and Privacy Policy to create your account.");
    setLoading(true);
    try {
      const result = await signUp({ fullName: fullName.trim(), username: username.trim().toLowerCase(), email: email.trim().toLowerCase(), password });
      if (typeof window !== "undefined") window.localStorage.setItem("vistara_pending_email", email.trim().toLowerCase());
      router.replace(result.needsVerification ? "/verify-email" : "/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't create that account. Check your details and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="order-2 flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:order-1 lg:px-20 lg:py-10"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-pine"><Icon name="arrow-left" size={15} /> Back to Vistara</Link><p className="eyebrow text-xs font-bold text-coral">Create your Vistara</p><h1 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Your next journey starts here.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-muted">Build a travel space around the people, places, and pace that matter to you.</p><div className="mt-8"><SocialButtons nextPath="/onboarding" /></div><AuthDivider />
        <form className="space-y-4" onSubmit={handleSubmit}><div className="grid gap-4 sm:grid-cols-2"><Input label="Full name" placeholder="How should we call you?" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} /><div><Input label="Username" placeholder="yourname" autoComplete="username" value={username} onChange={(event) => { setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")); setUsernameState("idle"); }} onBlur={checkUsername} />{usernameState !== "idle" ? <p className={`mt-1.5 text-[11px] font-semibold ${usernameState === "available" ? "text-pine" : usernameState === "taken" ? "text-coral" : "text-muted"}`}>{usernameState === "checking" ? "Checking username…" : usernameState === "available" ? "✓ Username available" : usernameState === "taken" ? "✕ Username already taken" : "We’ll check this when you continue"}</p> : null}</div></div><Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /><PasswordField label="Create a password" placeholder="At least 6 characters" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} hint="Use a mix of letters, numbers, and symbols." />{password ? <div className="-mt-2 flex gap-1.5" aria-label="Password strength">{[0, 1, 2, 3].map((item) => <span key={item} className={`h-1 flex-1 rounded-full ${item < score ? score < 2 ? "bg-coral" : score < 4 ? "bg-[#c8a15a]" : "bg-pine" : "bg-line"}`} />)}</div> : null}<PasswordField label="Confirm password" placeholder="Re-enter your password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /><label className="flex items-start gap-2.5 pt-1 text-xs leading-5 text-muted"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 rounded border-line accent-pine" /><span>I agree to Vistara&apos;s <a href="#terms" className="font-bold text-pine hover:text-coral">Terms</a> and <a href="#privacy" className="font-bold text-pine hover:text-coral">Privacy Policy</a>.</span></label>{error ? <AuthNotice tone="error">{error}</AuthNotice> : null}<Button type="submit" fullWidth disabled={loading}>{loading ? "Creating your account…" : "Create account"} {!loading ? <Icon name="arrow-right" size={17} /> : null}</Button></form>
        <p className="mt-7 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-bold text-pine hover:text-coral">Sign in</Link></p>{!configured ? <p className="mt-7 text-center text-xs leading-5 text-muted/70">Preview build: add Firebase public keys to <code className="rounded bg-moss px-1">.env.local</code> to enable live accounts.</p> : null}</div></div>
      <AuthVisual mode="signup" />
    </main>
  );
}
