import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TripCard } from "@/components/trips/TripCard";
import { TripInvitations } from "@/components/trips/TripInvitations";

export default function TripsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-xs font-bold text-coral">Your shared rooms</p>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
              Trips, at your pace.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              One trip = one collaborative room. Keep every plan, discussion, and co-planner together.
            </p>
          </div>
          <Button href="/trips/create-trip">
            <Icon name="plus" size={17} /> Create new trip
          </Button>
        </div>

        {/* Pending Trip Invitations Section */}
        <section className="rounded-3xl border border-line bg-canvas/40 p-6 sm:p-7">
          <TripInvitations />
        </section>

        {/* Existing Trips Grid */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="eyebrow text-[10px] font-bold text-muted">Active Spaces</p>
              <h2 className="mt-1 font-display text-2xl tracking-[-0.03em] text-ink">
                Your Trips
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <TripCard
              title="Lonavala Weekend"
              dates="Oct 12 – 14, 2025"
              location="Lonavala"
              tone="pine"
              members={["PM", "RK", "SR"]}
              href="/trips/sample-trip"
            />

            <Link
              href="/trips/create-trip"
              className="group flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-muted/35 bg-paper p-6 text-center transition hover:border-pine hover:bg-moss/25"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss text-pine transition group-hover:scale-105">
                <Icon name="plus" size={21} />
              </span>
              <p className="mt-4 font-display text-xl text-ink">Create a new trip</p>
              <p className="mt-2 max-w-[220px] text-xs leading-5 text-muted">
                Start with a destination, a feeling, or just a free weekend.
              </p>
            </Link>
          </div>
        </section>

        {/* Information Callout */}
        <div className="rounded-2xl border border-line bg-sand/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral-soft text-coral">
              <Icon name="sparkle" size={19} />
            </span>
            <div>
              <p className="eyebrow text-[10px] font-bold text-coral">Room Collaboration</p>
              <h2 className="mt-2 font-display text-2xl text-ink">Invite your people early.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Every Vistara trip is designed as a collaborative room. Co-planners can see the full itinerary, suggest activities, and prepare for upcoming group features.
              </p>
              <Button href="/friends" variant="outline" className="mt-5">
                Find friends <Icon name="arrow-right" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
