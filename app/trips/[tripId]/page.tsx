import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { MemberAvatar } from "@/components/trips/MemberAvatar";
import { itineraryPlaceholders } from "@/lib/data";

export default function TripDetailsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-xs font-bold text-coral">Trip workspace</p><h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Your next great escape</h1><p className="mt-3 flex items-center gap-2 text-sm text-muted"><Icon name="calendar" size={16} /> Dates and destination coming together soon</p></div><Button href="/trips/create-trip" variant="outline"><Icon name="settings" size={16} /> Trip settings</Button></div>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <Card padding="none" className="overflow-hidden"><div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#7fa9a0] via-[#386e67] to-[#173b38] sm:h-56"><div className="absolute -right-10 -top-28 h-80 w-80 rounded-full border-[50px] border-white/[0.07]" /><div className="absolute bottom-5 left-6 text-white"><p className="eyebrow text-[10px] font-bold text-white/60">A place to begin</p><p className="mt-2 font-display text-3xl tracking-[-0.03em]">Destination not set</p></div></div><div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div className="p-5"><p className="text-xs font-semibold text-muted">When</p><p className="mt-2 text-sm font-semibold text-ink">Dates to come</p></div><div className="p-5"><p className="text-xs font-semibold text-muted">Travelers</p><p className="mt-2 text-sm font-semibold text-ink">Add your crew</p></div><div className="p-5"><p className="text-xs font-semibold text-muted">Budget</p><p className="mt-2 text-sm font-semibold text-ink">Not set</p></div></div></Card>
            <Card padding="none"><div className="flex items-center justify-between border-b border-line p-5 sm:p-6"><div><p className="eyebrow text-[10px] font-bold text-muted">The shared plan</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Itinerary</h2></div><Button href="/trips/create-trip" variant="soft" className="min-h-9 px-3 text-xs"><Icon name="plus" size={15} /> Add day</Button></div><div className="divide-y divide-line">{itineraryPlaceholders.map((item) => <div key={item.day} className="flex gap-4 p-5 sm:p-6"><div className="w-14 shrink-0"><p className="eyebrow text-[10px] font-bold text-coral">{item.day}</p></div><div><h3 className="text-sm font-semibold text-ink">{item.title}</h3><p className="mt-1.5 text-sm leading-6 text-muted">{item.description}</p></div></div>)}</div></Card>
          </div>
          <div className="space-y-5">
            <Card padding="md"><div className="flex items-center justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Travel circle</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Members</h2></div><Button variant="ghost" className="min-h-8 px-2 text-xs">Invite <Icon name="plus" size={14} /></Button></div><div className="mt-5 flex items-center gap-3"><MemberAvatar initials="AT" tone="coral" size="md" /><div><p className="text-sm font-semibold">Your name</p><p className="text-xs text-muted">Trip owner</p></div></div><div className="mt-4 flex items-center gap-3 border-t border-line pt-4 text-sm text-muted"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-muted/50"><Icon name="plus" size={15} /></span>Invite someone to plan with you</div></Card>
            <Card padding="md"><p className="eyebrow text-[10px] font-bold text-muted">Trip tools</p><div className="mt-4 space-y-2">{[{ icon: "wallet" as const, label: "Budget", copy: "Keep the spend in view" }, { icon: "sparkle" as const, label: "Suggestions", copy: "Ideas for your kind of trip" }, { icon: "message" as const, label: "Chat", copy: "Talk through the details" }].map((item) => <div key={item.label} className="flex items-center gap-3 rounded-xl border border-line p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss text-pine"><Icon name={item.icon} size={17} /></span><div><p className="text-sm font-semibold text-ink">{item.label}</p><p className="mt-0.5 text-xs text-muted">{item.copy}</p></div><Icon name="chevron-right" size={16} className="ml-auto text-muted" /></div>)}</div></Card>
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2"><Card padding="none"><EmptyState compact icon="sparkle" title="Suggestions will live here" description="Save places and ideas as your trip takes shape." /></Card><Card padding="none"><EmptyState compact icon="message" title="A space for the conversation" description="Trip chat will be available when collaboration is connected." /></Card></div>
      </div>
    </AppShell>
  );
}
