"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthNotice } from "@/components/auth/AuthNotice";
import { AuthVisual } from "@/components/auth/AuthVisual";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { resendVerification } from "@/lib/auth";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState(() => typeof window !== "undefined" ? window.localStorage.getItem("vistara_pending_email") ?? "" : "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function resend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try { await resendVerification(email); } catch { /* Keep the response non-sensitive. */ } finally { setMessage("A fresh verification link is on its way if that email is pending verification."); setLoading(false); }
  }

  return <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[0.9fr_1.1fr]"><AuthVisual mode="signup" /><div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-20 lg:py-10"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss text-pine"><Icon name="mail" size={22} /></span><p className="eyebrow mt-8 text-xs font-bold text-coral">One small step</p><h1 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Verify your email</h1><p className="mt-4 text-sm leading-6 text-muted">Check your inbox to continue your Vistara journey. The link will securely activate your account.</p><form className="mt-8 space-y-5" onSubmit={resend}><Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />{message ? <AuthNotice tone="success">{message}</AuthNotice> : null}<Button type="submit" variant="soft" fullWidth disabled={loading}>{loading ? "Resending…" : "Resend verification email"}</Button></form><div className="mt-5 grid gap-3 sm:grid-cols-2"><Button href="/signup" variant="outline">Change email</Button><Button href="/login" variant="ghost">Back to sign in</Button></div><p className="mt-8 text-xs leading-5 text-muted/70">Already verified? <Link href="/login" className="font-bold text-pine">Sign in here.</Link></p></div></div></main>;
}
