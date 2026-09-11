import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { travelPreferences } from "@/lib/data";
import { MemberAvatar } from "@/components/trips/MemberAvatar";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-xs font-bold text-coral">Your account</p><h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Traveler profile</h1><p className="mt-3 text-sm leading-6 text-muted">A few details that help make every journey feel more like yours.</p></div><Button variant="outline"><Icon name="settings" size={16} /> Edit profile</Button></div>
        <div className="mt-9 space-y-5">
          <Card padding="lg"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><MemberAvatar initials="AT" tone="coral" size="lg" /><div><p className="font-display text-2xl tracking-[-0.03em]">Your name</p><p className="mt-1 text-sm text-muted">you@example.com</p></div><span className="rounded-full bg-moss px-3 py-1.5 text-xs font-semibold text-pine sm:ml-auto">Traveler</span></div></Card>
          <Card padding="lg"><div className="mb-6 flex items-center justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">Personal details</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">About you</h2></div><Icon name="users" size={22} className="text-muted" /></div><div className="grid gap-5 sm:grid-cols-2"><Input label="Name" placeholder="Your name" /><Input label="Email" type="email" placeholder="you@example.com" /></div></Card>
          <Card padding="lg"><div className="mb-6 flex items-center justify-between"><div><p className="eyebrow text-[10px] font-bold text-muted">How you like to travel</p><h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">Travel preferences</h2></div><Icon name="sliders" size={22} className="text-muted" /></div><div className="grid gap-x-5 gap-y-6 sm:grid-cols-2"><Select label="Travel style" options={["Slow & easy", "Balanced", "Packed with plans"]} /><Select label="Favorite interests" options={["Food & local culture", "Nature & outdoors", "Art & design"]} /><Select label="Getting around" options={["Walk & public transit", "Rental car", "A little of everything"]} /><Select label="Food preferences" options={["Open to everything", "Vegetarian", "Vegan"]} /></div><div className="mt-7 border-t border-line pt-5"><div className="grid gap-3 sm:grid-cols-2">{travelPreferences.map((preference) => <div key={preference.label} className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3"><span className="text-xs font-semibold text-muted">{preference.label}</span><span className="text-xs text-muted/70">{preference.value}</span></div>)}</div></div></Card>
          <div className="flex justify-end"><Button type="button">Save changes <Icon name="check" size={16} /></Button></div>
        </div>
      </div>
    </AppShell>
  );
}
