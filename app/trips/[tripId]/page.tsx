"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TripWorkspaceView } from "@/components/trips/TripWorkspaceView";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getBackendTrip, type BackendTrip } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  INITIAL_SAMPLE_TRIP,
  type MockTripDetail,
  type MockTripMember,
} from "@/lib/mockTripData";

type TripDetailsPageProps = {
  params: {
    tripId: string;
  };
};

function formatDates(startDate?: string | null, endDate?: string | null): string {
  if (startDate && endDate) {
    return `${startDate} – ${endDate}`;
  }
  if (startDate) return `From ${startDate}`;
  if (endDate) return `Until ${endDate}`;
  return "Dates to come";
}

function formatBudget(budget?: number | null): string {
  if (budget !== null && budget !== undefined && !isNaN(budget)) {
    return `₹${budget.toLocaleString("en-IN")}`;
  }
  return "Not set";
}

function mapBackendTripToView(
  trip: BackendTrip,
  currentUid?: string,
  currentName?: string | null,
  currentEmail?: string | null
): MockTripDetail {
  const tones: ("coral" | "pine" | "sand" | "blue")[] = ["coral", "pine", "sand", "blue"];

  const members: MockTripMember[] =
    trip.members && trip.members.length > 0
      ? trip.members.map((m, idx) => {
          const isCurrent = m.uid === currentUid;
          const name = isCurrent
            ? currentName || "You"
            : `Traveler ${m.uid.slice(0, 4)}`;
          const initials =
            name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "TR";
          return {
            id: m.uid,
            name,
            handle: `@${m.uid.slice(0, 6)}`,
            email: isCurrent ? currentEmail || "" : "",
            role: m.role,
            initials,
            tone: tones[idx % tones.length],
          };
        })
      : [
          {
            id: trip.ownerId,
            name: currentName || "Trip Owner",
            handle: `@${trip.ownerId.slice(0, 6)}`,
            email: currentEmail || "",
            role: "owner",
            initials: "TO",
            tone: "coral",
          },
        ];

  return {
    id: trip.id,
    title: trip.title,
    destination: trip.destination,
    dates: formatDates(trip.startDate, trip.endDate),
    budget: formatBudget(trip.budget),
    members,
    itinerary: INITIAL_SAMPLE_TRIP.itinerary,
  };
}

export default function TripDetailsPage({ params }: TripDetailsPageProps) {
  const { tripId } = params;
  const isSample = tripId === "sample-trip";
  const [loading, setLoading] = useState(!isSample);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<MockTripDetail>(INITIAL_SAMPLE_TRIP);

  useEffect(() => {
    if (isSample) {
      setTripData(INITIAL_SAMPLE_TRIP);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadTrip() {
      setLoading(true);
      setError(null);

      try {
        const user = await getCurrentUser();
        const data = await getBackendTrip(tripId);

        if (isMounted) {
          const mapped = mapBackendTripToView(
            data,
            user?.uid,
            user?.displayName,
            user?.email
          );
          setTripData(mapped);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Unable to load trip workspace. Please verify your permissions and try again.";
          setError(msg);
          setLoading(false);
        }
      }
    }

    loadTrip();

    return () => {
      isMounted = false;
    };
  }, [tripId, isSample]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <span className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-moss text-pine">
            <Icon name="sparkle" size={26} />
          </span>
          <h2 className="mt-5 font-display text-2xl tracking-[-0.02em] text-ink">
            Loading trip workspace…
          </h2>
          <p className="mt-2 text-xs text-muted">
            Connecting to your shared Vistara journey
          </p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg py-16 text-center">
          <div className="rounded-3xl border border-line bg-paper p-8 shadow-card sm:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-soft text-coral">
              <Icon name="info" size={26} />
            </span>
            <h2 className="mt-5 font-display text-2xl tracking-[-0.02em] text-ink">
              Could not open trip
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{error}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/trips" variant="outline">
                <Icon name="arrow-left" size={15} /> All Trips
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return <TripWorkspaceView tripId={tripId} initialTrip={tripData} />;
}
