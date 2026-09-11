"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";

export function SocialButtons({ nextPath = "/onboarding" }: { nextPath?: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setMessage("");
    setLoading(true);
    try {
      await signInWithGoogle(nextPath);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google sign in is unavailable right now.");
      setLoading(false);
    }
  }

  return <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={handleGoogle} disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:border-pine hover:bg-moss/30 disabled:opacity-60"><Icon name="google" size={17} /> {loading ? "Opening Google…" : "Continue with Google"}</button><button type="button" disabled className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-canvas px-4 text-sm font-semibold text-muted transition disabled:cursor-not-allowed disabled:opacity-75"><Icon name="apple" size={17} /> Apple <span className="text-[10px] font-bold uppercase tracking-[0.08em]">Soon</span></button></div>{message ? <p role="status" className="rounded-xl bg-coral-soft px-3 py-2.5 text-xs leading-5 text-[#984f3a]">{message}</p> : null}</div>;
}
