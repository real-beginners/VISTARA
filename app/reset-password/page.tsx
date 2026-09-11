"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthNotice } from "@/components/auth/AuthNotice";
import { AuthVisual } from "@/components/auth/AuthVisual";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { sendPasswordReset } from "@/lib/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim()) return setError("Enter the email address connected to your account.");
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <AuthVisual mode="login" />
      <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-20 lg:py-10">
        <div className="lg:hidden"><Logo /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <Link href="/login" className="mb-9 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-pine">
            <Icon name="arrow-left" size={15} /> Back to sign in
          </Link>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-soft text-coral">
            <Icon name="lock" size={22} />
          </span>
          <p className="eyebrow mt-8 text-xs font-bold text-coral">A fresh start</p>
          <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Reset your password</h1>
          <p className="mt-4 text-sm leading-6 text-muted">We&apos;ll send a secure link to the email on your Vistara account.</p>
          {sent ? (
            <div className="mt-8">
              <AuthNotice tone="success">Check your email. We&apos;ve sent you a secure password reset link if an account matches that address.</AuthNotice>
              <Button href="/login" variant="outline" fullWidth className="mt-5">Back to sign in <Icon name="arrow-right" size={16} /></Button>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Sending secure link…" : "Send reset link"} {!loading ? <Icon name="arrow-right" size={17} /> : null}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
