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
import { getProfile, signIn } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!identifier.trim() || !password) return setError("Enter your email or username and password to continue.");
    setLoading(true);
    try {
      const user = await signIn(identifier, password);
      if (typeof window !== "undefined") window.localStorage.setItem("vistara_remember_device", String(remember));
      const profile = await getProfile(user.id);
      router.replace(profile?.onboarding_completed ? "/dashboard" : "/onboarding");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We couldn't sign you in with those details.");
      setLoading(false);
    }
  }

  const configured = Boolean(getSupabaseBrowserClient());

  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <AuthVisual mode="login" />
      <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-20 lg:py-10"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><Link href="/" className="mb-9 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-pine"><Icon name="arrow-left" size={15} /> Back to Vistara</Link><p className="eyebrow text-xs font-bold text-coral">Welcome back</p><h1 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Your next adventure is waiting.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-muted">Sign in to pick up where your next journey left off.</p><div className="mt-8"><SocialButtons nextPath="/dashboard" /></div><AuthDivider />
        <form className="space-y-5" onSubmit={handleSubmit}><Input label="Email or username" type="text" placeholder="you@example.com or @yourname" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} /><PasswordField label="Password" placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /><div className="flex items-center justify-between gap-4"><label className="flex items-center gap-2 text-xs font-semibold text-muted"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-line accent-pine" /> Remember this device</label><Link href="/reset-password" className="text-xs font-bold text-pine hover:text-coral">Forgot password?</Link></div>{error ? <AuthNotice tone="error">{error}</AuthNotice> : null}<Button type="submit" fullWidth disabled={loading}>{loading ? "Signing you in…" : "Sign in"} {!loading ? <Icon name="arrow-right" size={17} /> : null}</Button></form>
        <p className="mt-8 text-center text-sm text-muted">Don&apos;t have an account? <Link href="/signup" className="font-bold text-pine hover:text-coral">Create one</Link></p>{!configured ? <p className="mt-8 text-center text-xs leading-5 text-muted/70">Preview build: connect Supabase with <code className="rounded bg-moss px-1">.env.local</code> to enable live authentication.</p> : null}</div></div>
    </main>
  );
}
