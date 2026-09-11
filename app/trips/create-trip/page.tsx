import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function CreateTripPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-pine"><Icon name="sparkle" size={16} /></span><span>New journey</span><Icon name="chevron-right" size={15} /></div>
        <div className="mb-9 max-w-2xl"><p className="eyebrow text-xs font-bold text-coral">Let’s make a plan</p><h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">Tell us what you’re dreaming of.</h1><p className="mt-4 text-sm leading-6 text-muted sm:text-base">A few starting details will give your trip a shape. You can always change things later.</p></div>
        <Card padding="lg">
          <form className="space-y-9">
            <section><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">01</span><div><h2 className="font-display text-xl">The basics</h2><p className="text-xs text-muted">Where and when are you going?</p></div></div><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><Input label="Destination" placeholder="City, country, or somewhere in between" /></div><Input label="Start date" type="date" /><Input label="End date" type="date" /></div></section>
            <div className="h-px bg-line" />
            <section><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">02</span><div><h2 className="font-display text-xl">Your travel rhythm</h2><p className="text-xs text-muted">Set the practical details.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><Input label="Number of travelers" type="number" min="1" placeholder="How many people?" /><Input label="Budget" placeholder="e.g. ₹50,000 per person" /><Select label="Travel style" options={["Slow & easy", "Balanced", "Packed with plans", "Still deciding"]} /><Select label="Transportation preference" options={["Walk & public transit", "Rental car", "A little of everything", "Still deciding"]} /></div></section>
            <div className="h-px bg-line" />
            <section><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">03</span><div><h2 className="font-display text-xl">Make it yours</h2><p className="text-xs text-muted">We’ll use these to shape your workspace.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><Select label="Interests" options={["Food & local culture", "Nature & outdoors", "Art & design", "History & architecture"]} /><Select label="Food preferences" options={["Open to everything", "Vegetarian", "Vegan", "Local specialties"]} /></div></section>
            <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center"><p className="flex items-start gap-2 text-xs leading-5 text-muted"><Icon name="info" size={15} className="mt-0.5 shrink-0" /> This is a starting point. Nothing is saved just yet.</p><Button type="button" className="sm:min-w-44">Continue <Icon name="arrow-right" size={17} /></Button></div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
