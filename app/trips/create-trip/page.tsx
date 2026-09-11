"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import { createBackendTrip } from "@/lib/api";

function parseBudgetNumber(val: string): number | null {
  if (!val.trim()) return null;
  const clean = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) || num < 0 ? null : num;
}

export default function CreateTripPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [travelStyle, setTravelStyle] = useState("Slow & easy");
  const [transportation, setTransportation] = useState("A little of everything");
  const [interests, setInterests] = useState("Nature & outdoors");
  const [foodPrefs, setFoodPrefs] = useState("Open to everything");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please give your trip a title.");
      return;
    }
    if (!destination.trim()) {
      setErrorMessage("Please enter a destination.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const createdTrip = await createBackendTrip({
        title: title.trim(),
        destination: destination.trim(),
        startDate: startDate ? startDate.trim() : null,
        endDate: endDate ? endDate.trim() : null,
        budget: parseBudgetNumber(budget),
      });

      router.push(`/trips/${createdTrip.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create trip room. Please try again.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };


  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-pine">
            <Icon name="sparkle" size={16} />
          </span>
          <span>New journey</span>
          <Icon name="chevron-right" size={15} />
        </div>

        <div className="mb-9 max-w-2xl">
          <p className="eyebrow text-xs font-bold text-coral">Let’s make a plan</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
            Tell us what you’re dreaming of.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            A few starting details will give your collaborative trip workspace a shape. You can always refine details later.
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-9">
            {errorMessage ? (
              <div className="flex items-center gap-2 rounded-xl bg-coral-soft/70 px-4 py-3 text-xs font-semibold text-coral">
                <Icon name="info" size={15} />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            {/* Section 01: The Basics */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">
                  01
                </span>
                <div>
                  <h2 className="font-display text-xl">The basics</h2>
                  <p className="text-xs text-muted">What is the trip called and where are you headed?</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Trip title"
                    placeholder="e.g. Lonavala Monsoon Escape, Goa Beach Week"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Destination"
                    placeholder="City, country, or somewhere in between"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </section>

            <div className="h-px bg-line" />

            {/* Section 02: Travel rhythm & Budget */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">
                  02
                </span>
                <div>
                  <h2 className="font-display text-xl">Your travel rhythm</h2>
                  <p className="text-xs text-muted">Set the practical details and budget.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Number of travelers"
                  type="number"
                  min="1"
                  placeholder="How many people?"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                />
                <Input
                  label="Budget"
                  placeholder="e.g. ₹25,000 per person"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <Select
                  label="Travel style"
                  options={["Slow & easy", "Balanced", "Packed with plans", "Still deciding"]}
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                />
                <Select
                  label="Transportation preference"
                  options={["Walk & public transit", "Rental car", "A little of everything", "Still deciding"]}
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                />
              </div>
            </section>

            <div className="h-px bg-line" />

            {/* Section 03: Preferences */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">
                  03
                </span>
                <div>
                  <h2 className="font-display text-xl">Make it yours</h2>
                  <p className="text-xs text-muted">We’ll use these to shape your collaborative room.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Interests"
                  options={["Food & local culture", "Nature & outdoors", "Art & design", "History & architecture"]}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
                <Select
                  label="Food preferences"
                  options={["Open to everything", "Vegetarian", "Vegan", "Local specialties"]}
                  value={foodPrefs}
                  onChange={(e) => setFoodPrefs(e.target.value)}
                />
              </div>
            </section>

            <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
              <p className="flex items-start gap-2 text-xs leading-5 text-muted">
                <Icon name="info" size={15} className="mt-0.5 shrink-0" />
                This opens your collaborative room. You can invite friends immediately.
              </p>
              <Button type="submit" disabled={isSubmitting} className="sm:min-w-48">
                {isSubmitting ? (
                  <>
                    <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white" />
                    Opening workspace...
                  </>
                ) : (
                  <>
                    Create trip room <Icon name="arrow-right" size={17} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
