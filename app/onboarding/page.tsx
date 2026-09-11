"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthNotice } from "@/components/auth/AuthNotice";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { subscribeToAuth, updateOnboarding, type OnboardingPreferences } from "@/lib/auth";

const steps = [
  { title: "What do you love?", copy: "Choose as many as feel like you.", options: [["🌿", "Nature"], ["🏔️", "Adventure"], ["🍜", "Food"], ["☕", "Cafés"], ["🎉", "Nightlife"], ["📸", "Photography"], ["🏛️", "History"], ["🎭", "Culture"], ["🛍️", "Shopping"], ["💎", "Hidden gems"], ["🎵", "Events"], ["🌅", "Relaxation"], ["🏖️", "Beaches"], ["🏕️", "Camping"], ["🚗", "Road trips"]] as [string, string][], multiple: true, key: "interests" as const },
  { title: "Who do you travel with?", copy: "This helps us shape the right kind of plan.", options: [["🧭", "Solo"], ["🫶", "Friends"], ["🌙", "Partner"], ["🏡", "Family"], ["✨", "Mixed groups"]] as [string, string][], multiple: false, key: "travel_companions" as const },
  { title: "What’s your usual budget?", copy: "We’ll keep suggestions grounded in reality.", options: [["₹", "Under ₹500"], ["₹₹", "₹500–₹1,000"], ["₹₹₹", "₹1,000–₹2,000"], ["₹₹₹₹", "₹2,000–₹5,000"], ["₹₹₹₹₹", "₹5,000+"]] as [string, string][], multiple: false, key: "budget" as const },
  { title: "What’s your travel style?", copy: "There’s no wrong pace to take.", options: [["🌿", "Relaxed"], ["⚖️", "Balanced"], ["⚡", "Packed"], ["🎲", "Spontaneous"], ["🥂", "Luxury"], ["🎒", "Budget"]] as [string, string][], multiple: false, key: "travel_style" as const },
  { title: "How far do you usually travel?", copy: "From a nearby afternoon to anywhere.", options: [["📍", "Nearby"], ["🚶", "Up to 10 km"], ["🚲", "Up to 25 km"], ["🚗", "Up to 50 km"], ["✈️", "Anywhere"]] as [string, string][], multiple: false, key: "distance" as const },
  { title: "What matters most?", copy: "Pick the details Vistara should protect.", options: [["₹", "Low cost"], ["⏱️", "Less travel time"], ["🍽️", "Best food"], ["🌄", "Beautiful scenery"], ["🧗", "Adventure"], ["🛋️", "Comfort"], ["💎", "Unique experiences"], ["📸", "Instagram-worthy places"], ["🤝", "Local experiences"]] as [string, string][], multiple: true, key: "priorities" as const },
] as const;

const initialPreferences: OnboardingPreferences = { interests: [], travel_companions: "", budget: "", travel_style: "", distance: "", priorities: [] };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [userId, setUserId] = useState("");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const current = steps[step];

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setUserId(user.uid);
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);
  const selected = useMemo(() => { const value = preferences[current.key]; return Array.isArray(value) ? value : value ? [value] : []; }, [current.key, preferences]);

  function toggle(value: string) {
    setError("");
    if (current.multiple) {
      const currentValues = preferences[current.key] as string[];
      setPreferences((previous) => ({ ...previous, [current.key]: currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value] }));
    } else setPreferences((previous) => ({ ...previous, [current.key]: value }));
  }

  async function next() {
    if (!selected.length) return setError(current.multiple ? "Choose at least one option to continue." : "Pick the option that feels closest to you.");
    if (step < steps.length - 1) return setStep((value) => value + 1);
    setSaving(true);
    try { await updateOnboarding(userId, preferences); router.replace("/dashboard"); } catch { setError("We couldn’t save your preferences. Please try again."); setSaving(false); }
  }

  if (checking) return <main className="flex min-h-screen items-center justify-center bg-canvas"><div className="text-center"><span className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-moss text-pine"><span className="h-4 w-4 rotate-45 rounded border-2 border-coral" /></span><p className="mt-4 text-xs font-semibold text-muted">Setting up your first journey…</p></div></main>;

  return <main className="min-h-screen bg-canvas"><header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8"><Logo /><span className="text-xs font-semibold text-muted">Step {step + 1} of {steps.length}</span></header><div className="mx-auto grid max-w-6xl gap-10 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16 lg:pt-14"><aside className="hidden lg:block"><div className="sticky top-10"><p className="eyebrow text-[10px] font-bold text-coral">Your Vistara, your way</p><h1 className="mt-4 max-w-xs font-display text-4xl leading-tight tracking-[-0.04em]">Let’s personalize your journeys.</h1><p className="mt-5 max-w-xs text-sm leading-6 text-muted">A few thoughtful choices help Vistara make better suggestions from the very first search.</p><div className="mt-10 space-y-3">{steps.map((item, index) => <button key={item.title} type="button" onClick={() => index < step && setStep(index)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${index === step ? "bg-moss text-pine" : index < step ? "text-pine hover:bg-moss/60" : "text-muted/55"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${index < step ? "bg-pine text-white" : index === step ? "bg-pine text-white" : "bg-line text-muted"}`}>{index < step ? "✓" : `0${index + 1}`}</span>{item.title}</button>)}</div></div></aside><section className="max-w-3xl"><div className="mb-8 lg:hidden"><p className="eyebrow text-[10px] font-bold text-coral">Let’s personalize Vistara</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-pine transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div></div><p className="eyebrow text-xs font-bold text-coral">{step === 0 ? "A little about you" : "Keep going"}</p><h2 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">{current.title}</h2><p className="mt-4 text-sm leading-6 text-muted">{current.copy}</p><div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{current.options.map(([emoji, label]) => <button key={label} type="button" onClick={() => toggle(label)} className={`group rounded-2xl border p-4 text-left transition ${selected.includes(label) ? "border-pine bg-moss shadow-card" : "border-line bg-paper hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"}`}><span className="flex items-center justify-between"><span className="text-2xl">{emoji}</span><span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${selected.includes(label) ? "border-pine bg-pine text-white" : "border-line text-transparent"}`}>✓</span></span><span className="mt-6 block text-sm font-bold text-ink">{label}</span>{current.multiple ? <span className="mt-1 block text-[10px] text-muted">Tap to select</span> : null}</button>)}</div>{error ? <div className="mt-6"><AuthNotice tone="error">{error}</AuthNotice></div> : null}<div className="mt-9 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center"><Button type="button" variant="ghost" onClick={() => step > 0 ? setStep((value) => value - 1) : router.replace("/signup")}><Icon name="arrow-left" size={16} /> {step > 0 ? "Back" : "Exit"}</Button><Button type="button" onClick={next} disabled={saving}>{saving ? "Saving your preferences…" : step === steps.length - 1 ? "Take me to Vistara" : "Continue"} {!saving ? <Icon name="arrow-right" size={17} /> : null}</Button></div></section></div></main>;
}
