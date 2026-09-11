import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow text-xs font-bold text-coral">Tuesday, September 11</p><h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Good morning, traveler.</h1><p className="mt-3 text-sm leading-6 text-muted sm:text-base">A blank page is a beautiful place to start.</p></div><Button href="/trips/create-trip"><Icon name="plus" size={17} /> Create new trip</Button></div>
        <div className="mt-10 grid gap-5 md:grid-cols-[1.35fr_0.65fr]">
          <Card padding="lg" className="relative overflow-hidden bg-pine text-white"><div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[42px] border-white/[0.06]" /><div className="relative"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Icon name="sparkle" size={19} className="text-coral-soft" /></span><span className="eyebrow text-[10px] font-bold text-white/45">Your workspace</span></div><h2 className="mt-12 max-w-md font-display text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">Where will your curiosity take you next?</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/60">Start a trip and shape it around the people, places, and pace that matter to you.</p><Button href="/trips/create-trip" variant="soft" className="mt-7 bg-white text-pine hover:bg-white/90">Start planning <Icon name="arrow-right" size={16} /></Button></div></Card>
          <Card padding="lg" className="flex flex-col justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Planning at a glance</p><div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-soft text-coral"><Icon name="map" size={22} /></div><p className="mt-5 font-display text-2xl tracking-[-0.03em]">Your travel board is ready.</p><p className="mt-2 text-sm leading-6 text-muted">Trips, ideas, and shared decisions will live here.</p></div><div className="mt-8 border-t border-line pt-4 text-xs font-semibold text-muted">No trips planned yet</div></Card>
        </div>
        <section className="mt-12"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Your journeys</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Recent & upcoming trips</h2></div><span className="hidden text-xs text-muted sm:block">0 trips</span></div><Card padding="none"><EmptyState icon="compass" title="Nothing on the horizon yet" description="When you create your first trip, it will appear here for easy access." action={<Button href="/trips/create-trip" variant="outline">Create your first trip <Icon name="arrow-right" size={16} /></Button>} /></Card></section>
      </div>
    </AppShell>
  );
}
