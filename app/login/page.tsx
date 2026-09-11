import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
      <div className="hidden bg-pine p-10 text-white lg:flex lg:flex-col lg:justify-between"><Logo light /><div className="max-w-sm"><Icon name="compass" size={32} className="mb-8 text-coral-soft" /><p className="font-display text-4xl leading-tight tracking-[-0.04em]">Come back to the places you’re planning.</p><p className="mt-5 text-sm leading-6 text-white/60">Your next journey is waiting in the wings.</p></div><p className="text-xs text-white/40">VISTARA · Plan with intention.</p></div>
      <div className="flex flex-col bg-canvas px-5 py-6 sm:px-10 lg:px-20 lg:py-10"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><p className="eyebrow text-xs font-bold text-coral">Welcome back</p><h1 className="mt-4 font-display text-4xl tracking-[-0.04em]">Let’s continue planning.</h1><p className="mt-3 text-sm leading-6 text-muted">Sign in to pick up where your next journey left off.</p><form className="mt-9 space-y-5"><Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" /><Input label="Password" type="password" placeholder="Enter your password" autoComplete="current-password" /><Button type="button" fullWidth className="mt-2">Log in <Icon name="arrow-right" size={17} /></Button></form><p className="mt-8 text-center text-sm text-muted">New to VISTARA? <Link href="/signup" className="font-bold text-pine hover:text-coral">Create an account</Link></p><p className="mt-12 text-center text-xs leading-5 text-muted/70">This is a visual foundation for the VISTARA workspace. Account access will be connected in a later step.</p></div></div>
    </main>
  );
}
