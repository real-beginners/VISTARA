import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      <div className="order-2 flex flex-col bg-canvas px-5 py-6 sm:px-10 lg:order-1 lg:px-20 lg:py-10"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><p className="eyebrow text-xs font-bold text-coral">Begin the journey</p><h1 className="mt-4 font-display text-4xl tracking-[-0.04em]">Make room for somewhere new.</h1><p className="mt-3 text-sm leading-6 text-muted">Create your VISTARA space and start gathering the pieces of your next trip.</p><form className="mt-9 space-y-5"><Input label="Your name" type="text" placeholder="How should we call you?" autoComplete="name" /><Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" /><Input label="Create a password" type="password" placeholder="At least 8 characters" autoComplete="new-password" /><Button type="button" fullWidth className="mt-2">Create account <Icon name="arrow-right" size={17} /></Button></form><p className="mt-8 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-bold text-pine hover:text-coral">Log in</Link></p><p className="mt-12 text-center text-xs leading-5 text-muted/70">Account creation is not connected yet. This page is part of the initial product layout.</p></div></div>
      <div className="order-1 hidden bg-[#eadccc] p-10 text-ink lg:order-2 lg:flex lg:flex-col lg:justify-between"><div className="flex justify-end"><Logo /></div><div className="mx-auto w-full max-w-sm"><div className="relative h-72 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e4a992] via-[#c97d67] to-[#506f68] p-7"><div className="absolute -right-20 -top-16 h-56 w-56 rounded-full border-[28px] border-white/20" /><div className="absolute bottom-6 left-7 right-7 rounded-2xl bg-white/85 p-5 backdrop-blur"><p className="eyebrow text-[10px] font-bold text-coral">Make it yours</p><p className="mt-3 font-display text-2xl leading-tight">The places that stay with you.</p></div></div><p className="mt-6 text-center font-display text-2xl tracking-[-0.03em]">A little planning can make<br />a lot more meaning.</p></div><p className="text-right text-xs text-ink/40">VISTARA · Plan with intention.</p></div>
    </main>
  );
}
