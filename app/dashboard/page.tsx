"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { MemberAvatar } from "@/components/trips/MemberAvatar";
import { TripCard } from "@/components/trips/TripCard";
import { AuthNotice } from "@/components/auth/AuthNotice";

const friends = [
  { initials: "RK", name: "Rahul Kapoor", username: "@rahul.k", tone: "coral" as const, online: true },
  { initials: "PS", name: "Priya Shah", username: "@priyashah", tone: "blue" as const, online: false },
  { initials: "AM", name: "Aarav Mehta", username: "@aaravm", tone: "sand" as const, online: true },
];

const places = [
  { title: "The Hilltop Table", location: "Koregaon Park · Pune", tag: "Cafés", rating: "4.8", cost: "₹₹", image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=700&q=80" },
  { title: "Pawna Lake", location: "Lonavala · Maharashtra", tag: "Hidden gem", rating: "4.9", cost: "₹₹", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80" },
  { title: "Kala Ghoda Walk", location: "Fort · Mumbai", tag: "Culture", rating: "4.7", cost: "₹", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=700&q=80" },
];

const actions = [
  { label: "Plan journey", copy: "Turn a feeling into a plan", href: "/plan", icon: "wand" as const, tone: "bg-coral-soft text-coral" },
  { label: "Invite friends", copy: "Make it a shared idea", href: "/friends", icon: "user-plus" as const, tone: "bg-moss text-pine" },
  { label: "Explore nearby", copy: "Places for right now", href: "/explore", icon: "navigation" as const, tone: "bg-blue-soft text-[#47727d]" },
  { label: "Saved places", copy: "Your little wish list", href: "/explore", icon: "bookmark" as const, tone: "bg-sand text-[#8b6f43]" },
  { label: "Open map", copy: "See the shape of it", href: "/explore", icon: "map" as const, tone: "bg-moss text-pine" },
  { label: "Weather", copy: "Plan around the sky", href: "/explore", icon: "sun" as const, tone: "bg-[#f7edcf] text-[#9b793e]" },
];

export default function DashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return <AppShell><div className="mx-auto max-w-6xl relative"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow text-xs font-bold text-coral">Tuesday, September 11 · Pune</p><h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Good evening, traveler.</h1><p className="mt-3 text-sm leading-6 text-muted sm:text-base">Where are we going?</p></div><Link href="/profile" className="hidden items-center gap-2 text-xs font-bold text-pine transition hover:text-coral sm:flex"><span className="h-2 w-2 rounded-full bg-pine" /> Your preferences are ready</Link></div>
    <Card padding="none" className="relative mt-9 overflow-hidden border-0 bg-pine text-white shadow-soft"><div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(216,123,97,.35),transparent_33%),radial-gradient(circle_at_10%_100%,rgba(255,255,255,.11),transparent_28%)]" /><div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10"><div className="max-w-xl"><div className="flex items-center gap-2 text-coral-soft"><Icon name="sparkle" size={18} /><span className="eyebrow text-[10px] font-bold">Your AI travel companion</span></div><h2 className="mt-6 font-display text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">Tell me what kind of journey you want.</h2><div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-2 text-ink shadow-[0_12px_30px_rgba(8,42,38,.18)]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-soft text-coral"><Icon name="wand" size={18} /></span><span className="flex-1 px-1 text-sm text-ink/45">Plan a 6-hour trip in Pune for 4 friends under ₹2,000</span><Link href="/plan" className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-coral px-3 text-xs font-bold text-white transition hover:bg-[#c66a50]">Plan <Icon name="arrow-right" size={15} /></Link></div><div className="mt-4 flex flex-wrap gap-2"><Link href="/plan" className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">Plan with AI</Link><Link href="/explore" className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">Explore nearby</Link></div></div><div className="hidden items-end justify-end lg:flex"><div className="w-full max-w-[250px] rounded-[1.6rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">A gentle nudge</span><Icon name="more" size={16} className="text-white/55" /></div><p className="mt-7 font-display text-2xl leading-tight">The best plans leave a little room.</p><div className="mt-8 flex items-center gap-2 text-xs text-white/60"><Icon name="clock" size={14} /> 6 hrs · flexible</div></div></div></div></Card>
    <section className="mt-9"><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Make a move</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Quick actions</h2></div><span className="text-xs text-muted">For today, or later</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{actions.map((action) => {
      const isComingSoon = action.href === "/explore" || action.href === "#";
      return (
        <Link key={action.label} href={isComingSoon ? "#" : action.href} onClick={(e) => {
          if (isComingSoon) {
            e.preventDefault();
            showToast(`${action.label} is coming soon!`);
          }
        }} className="group rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-pine/30 hover:shadow-card"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.tone}`}><Icon name={action.icon} size={18} /></span><p className="mt-4 text-xs font-bold text-ink">{action.label}</p><p className="mt-1 text-[11px] leading-4 text-muted">{action.copy}</p></Link>
      );
    })}</div></section>
    <section className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><div><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Keep planning together</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Your trips</h2></div><Link href="/trips" className="text-xs font-bold text-pine hover:text-coral">See all trips <Icon name="arrow-right" size={14} className="ml-1 inline" /></Link></div><div className="grid gap-4 sm:grid-cols-2"><TripCard title="Lonavala Weekend" dates="Oct 12 – 14, 2025" location="Lonavala" tone="pine" members={["AT", "RK", "PS", "+2"]} /><Link href="/trips/create-trip" className="group flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-muted/35 bg-paper p-6 text-center transition hover:border-pine hover:bg-moss/25"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss text-pine transition group-hover:scale-105"><Icon name="plus" size={21} /></span><p className="mt-4 font-display text-xl text-ink">Create new trip</p><p className="mt-2 max-w-[170px] text-xs leading-5 text-muted">Start with a destination, a feeling, or just a free afternoon.</p></Link></div></div><Card padding="lg"><div className="flex items-start justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">The travel circle</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Your friends</h2></div><Link href="/friends" className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-pine"><Icon name="user-plus" size={16} /></Link></div><div className="mt-5 space-y-4">{friends.map((friend) => <div key={friend.username} className="flex items-center gap-3"><div className="relative"><MemberAvatar initials={friend.initials} tone={friend.tone} size="md" />{friend.online ? <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-paper bg-[#66a77b]" /> : null}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{friend.name}</p><p className="mt-0.5 truncate text-xs text-muted">{friend.username}</p></div><button type="button" className="rounded-full px-2 py-1 text-[10px] font-bold text-pine transition hover:bg-moss">Invite</button></div>)}</div><Link href="/friends" className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-xs font-bold text-muted transition hover:border-pine hover:text-pine"><Icon name="search" size={15} /> Find friends</Link></Card></section>
    <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Curated for your interests</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Recommended for you</h2></div><Link href="/explore" className="text-xs font-bold text-pine hover:text-coral">Explore all <Icon name="arrow-right" size={14} className="ml-1 inline" /></Link></div><div className="grid gap-4 md:grid-cols-3">{places.map((place) => <Link href="/explore" key={place.title} className="group overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"><div className="relative h-44 overflow-hidden bg-moss"><div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${place.image})` }} /><div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 text-[10px] font-bold text-pine backdrop-blur">{place.tag}</span><button type="button" aria-label={`Save ${place.title}`} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/85 text-ink backdrop-blur transition hover:bg-white hover:text-coral"><Icon name="bookmark" size={15} /></button><span className="absolute bottom-3 left-4 flex items-center gap-1 text-xs font-bold text-white"><Icon name="star" size={13} /> {place.rating}</span></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-xl tracking-[-0.02em] text-ink">{place.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-muted"><Icon name="map-pin" size={13} /> {place.location}</p></div><span className="text-xs font-bold text-muted">{place.cost}</span></div></div></Link>)}</div></section>
    
    {toastMessage ? (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-max shadow-card animate-[scale-in_200ms_ease-out]">
        <AuthNotice tone="info">{toastMessage}</AuthNotice>
      </div>
    ) : null}
  </div></AppShell>;
}
