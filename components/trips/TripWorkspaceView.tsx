"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { MemberAvatar } from "./MemberAvatar";
import { MemberDisplay } from "./MemberDisplay";
import { InviteFriendsModal } from "./InviteFriendsModal";
import {
  INITIAL_SAMPLE_TRIP,
  type MockTripDetail,
  type MockInvitableUser,
  type MockTripMember,
} from "@/lib/mockTripData";

type WorkspaceTab = "itinerary" | "chat" | "ai";

export function TripWorkspaceView({
  tripId,
  initialTrip,
}: {
  tripId?: string;
  initialTrip?: MockTripDetail;
}) {
  const [trip, setTrip] = useState<MockTripDetail>(initialTrip || INITIAL_SAMPLE_TRIP);

  useEffect(() => {
    if (initialTrip) {
      setTrip(initialTrip);
    }
  }, [initialTrip]);

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("itinerary");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New activity form state for local planning demonstration
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newDay, setNewDay] = useState("Day 01");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUserInvited = (invitedUser: MockInvitableUser) => {
    // Add invited member to the trip's members list if not already present
    setTrip((prev) => {
      const exists = prev.members.some((m) => m.id === invitedUser.id);
      if (exists) return prev;
      const newMember: MockTripMember = {
        id: invitedUser.id,
        name: invitedUser.name,
        handle: invitedUser.handle,
        email: invitedUser.email,
        role: "member",
        initials: invitedUser.initials,
        tone: invitedUser.tone,
      };
      return {
        ...prev,
        members: [...prev.members, newMember],
      };
    });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setTrip((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: newDay,
          title: newTitle.trim(),
          description: newDesc.trim() || "Activity planned with trip members.",
          time: newTime || "Flexible",
          tag: "Member note",
        },
      ],
    }));

    setNewTitle("");
    setNewDesc("");
    setNewTime("");
    setShowAddActivity(false);
  };

  const owner = trip.members.find((m) => m.role === "owner");
  const membersOnly = trip.members.filter((m) => m.role !== "owner");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2">
            <Link href="/trips" className="transition hover:text-pine flex items-center gap-1 font-semibold">
              <Icon name="arrow-left" size={13} /> All Trips
            </Link>
            <span className="text-muted/40">/</span>
            <span className="font-semibold text-ink">Trip Room</span>
            <span className="text-muted/40">/</span>
            <span className="truncate max-w-[180px] sm:max-w-none">{trip.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted transition hover:border-pine hover:text-pine"
            >
              {copiedLink ? (
                <>
                  <Icon name="check" size={13} className="text-pine" /> Link copied!
                </>
              ) : (
                <>
                  <Icon name="compass" size={13} /> Share Room
                </>
              )}
            </button>
          </div>
        </div>

        {/* HEADER: Trip title, destination, dates, member count */}
        <div className="rounded-3xl border border-line bg-paper p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-coral-soft px-3 py-0.5 text-xs font-bold text-coral">
                  <Icon name="sparkle" size={12} /> Collaborative Room
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-moss px-3 py-0.5 text-xs font-bold text-pine">
                  <Icon name="users" size={12} /> {trip.members.length} members
                </span>
              </div>

              <h1 className="mt-3 font-display text-3xl tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl">
                {trip.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <Icon name="map-pin" size={16} className="text-coral" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Icon name="calendar" size={16} className="text-pine" />
                  {trip.dates}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Icon name="wallet" size={16} className="text-[#8b6f43]" />
                  Budget: <strong className="text-ink font-semibold">{trip.budget}</strong>
                </span>
              </div>
            </div>

            {/* Quick Header Action */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() => setIsInviteOpen(true)}
                className="shadow-sm"
              >
                <Icon name="user-plus" size={16} /> Invite Friends
              </Button>
              <Button href="/trips/create-trip" variant="outline">
                <Icon name="settings" size={16} /> Edit Details
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Selector for Main Area */}
        <div className="flex border-b border-line">
          <button
            type="button"
            onClick={() => setActiveTab("itinerary")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
              activeTab === "itinerary"
                ? "border-pine text-pine"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Icon name="calendar" size={16} /> Itinerary & Planning
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`relative flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
              activeTab === "chat"
                ? "border-pine text-pine"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Icon name="message" size={16} /> Group Chat
            <span className="rounded-full bg-sand px-2 py-0.5 text-[9px] font-bold text-[#8b6f43]">
              Upcoming
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`relative flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${
              activeTab === "ai"
                ? "border-pine text-pine"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Icon name="wand" size={16} /> AI Co-Planner
            <span className="rounded-full bg-coral-soft px-2 py-0.5 text-[9px] font-bold text-coral">
              Upcoming
            </span>
          </button>
        </div>

        {/* Workspace Grid Layout */}
        <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* MAIN AREA */}
          <div className="space-y-6 min-w-0">
            {/* 1. ITINERARY / PLANNING AREA */}
            {activeTab === "itinerary" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <Card padding="none" className="overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between border-b border-line p-5 sm:p-6">
                    <div>
                      <p className="eyebrow text-[10px] font-bold text-coral">Day by day</p>
                      <h2 className="mt-1 font-display text-2xl tracking-[-0.02em] text-ink">
                        Shared Itinerary
                      </h2>
                    </div>

                    <Button
                      variant="soft"
                      onClick={() => setShowAddActivity((v) => !v)}
                      className="min-h-9 px-3.5 text-xs font-semibold"
                    >
                      <Icon name="plus" size={14} /> Add activity
                    </Button>
                  </div>

                  {/* Add activity form */}
                  {showAddActivity ? (
                    <form
                      onSubmit={handleAddActivity}
                      className="border-b border-line bg-canvas/40 p-5 space-y-4 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-ink">Add a stop or activity</p>
                        <button
                          type="button"
                          onClick={() => setShowAddActivity(false)}
                          className="text-xs text-muted hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <select
                          value={newDay}
                          onChange={(e) => setNewDay(e.target.value)}
                          className="h-10 rounded-xl border border-line bg-paper px-3 text-xs font-semibold text-ink"
                        >
                          <option value="Day 01">Day 01</option>
                          <option value="Day 02">Day 02</option>
                          <option value="Day 03">Day 03</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Time (e.g. 02:00 PM)"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="h-10 rounded-xl border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-pine"
                        />
                        <input
                          type="text"
                          placeholder="Activity title *"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          required
                          className="h-10 rounded-xl border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-pine"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Description or notes for the group"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-pine"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="rounded-full bg-pine px-4 py-2 text-xs font-bold text-white hover:bg-pine-dark"
                        >
                          Save to itinerary
                        </button>
                      </div>
                    </form>
                  ) : null}

                  {/* Itinerary Day Cards */}
                  <div className="divide-y divide-line">
                    {trip.itinerary.map((item, index) => (
                      <div key={index} className="flex flex-col gap-4 p-5 sm:flex-row sm:p-6">
                        <div className="w-20 shrink-0">
                          <span className="eyebrow inline-block rounded-md bg-coral-soft px-2 py-0.5 text-[10px] font-bold text-coral">
                            {item.day}
                          </span>
                          {item.time ? (
                            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted">
                              <Icon name="clock" size={12} /> {item.time}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg text-ink font-semibold">
                              {item.title}
                            </h3>
                            {item.tag ? (
                              <span className="rounded-full bg-moss/60 px-2 py-0.5 text-[10px] font-semibold text-pine-dark">
                                {item.tag}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Collaborative planning notes card */}
                <Card padding="md" className="border-line bg-paper">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="eyebrow text-[10px] font-bold text-muted">Collaborative notes</p>
                      <h3 className="mt-1 font-display text-lg text-ink">Room Checklist</h3>
                    </div>
                    <span className="text-xs text-muted">Shared with all {trip.members.length} members</span>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-muted">
                    <div className="flex items-center gap-2.5 rounded-xl bg-canvas/60 p-2.5">
                      <Icon name="check-circle" size={15} className="text-pine shrink-0" />
                      <span className="line-through text-muted/70">Confirm villa booking near Pawna</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-canvas/60 p-2.5">
                      <Icon name="check-circle" size={15} className="text-pine shrink-0" />
                      <span className="line-through text-muted/70">Car pool routes coordinated</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-canvas/60 p-2.5">
                      <span className="h-4 w-4 rounded-full border border-muted/50 shrink-0" />
                      <span className="text-ink font-medium">Pick up trekking snacks & monsoon ponchos</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* 2. GROUP DISCUSSION / CHAT PLACEHOLDER */}
            {activeTab === "chat" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <Card padding="lg" className="border-line text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-moss text-pine">
                    <Icon name="message" size={26} />
                  </div>

                  <span className="mt-4 inline-block rounded-full bg-sand px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-[#8b6f43]">
                    Feature Placeholder · Coming Soon
                  </span>

                  <h2 className="mt-3 font-display text-2xl tracking-[-0.03em] text-ink sm:text-3xl">
                    Group Discussion & Chat
                  </h2>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
                    Real-time chat is being built in the collaborative trip engine. Soon, you and your travel companions will be able to share recommendations, debate destinations, drop links, and vote on activities right in this room.
                  </p>

                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line bg-canvas/60 p-4 text-left">
                    <p className="eyebrow text-[10px] font-bold text-muted">Room participant feed preview</p>
                    <div className="mt-3 space-y-3 opacity-60">
                      <div className="flex items-start gap-2.5 text-xs">
                        <MemberAvatar initials="RK" tone="pine" size="sm" />
                        <div className="rounded-2xl rounded-tl-sm bg-paper p-3 border border-line shadow-xs">
                          <p className="font-bold text-ink text-[11px]">Rahul Kapoor</p>
                          <p className="text-muted mt-0.5">Found a great café for Day 02 breakfast!</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs">
                        <MemberAvatar initials="SR" tone="blue" size="sm" />
                        <div className="rounded-2xl rounded-tl-sm bg-paper p-3 border border-line shadow-xs">
                          <p className="font-bold text-ink text-[11px]">Sneha Rao</p>
                          <p className="text-muted mt-0.5">Added it to our shared wish list.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-muted/80">
                    Live socket communication will connect to this room in the next milestone.
                  </p>
                </Card>
              </div>
            )}

            {/* 3. AI ASSISTANT PLACEHOLDER */}
            {activeTab === "ai" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <Card padding="lg" className="border-line text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-soft text-coral">
                    <Icon name="wand" size={26} />
                  </div>

                  <span className="mt-4 inline-block rounded-full bg-coral-soft px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-coral">
                    Feature Placeholder · Coming Soon
                  </span>

                  <h2 className="mt-3 font-display text-2xl tracking-[-0.03em] text-ink sm:text-3xl">
                    Vistara AI Co-Planner
                  </h2>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
                    Your dedicated AI travel assistant for this room. When enabled, it will automatically optimize itineraries, resolve group schedule conflicts, suggest route timings, and balance budgets.
                  </p>

                  <div className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
                    <div className="rounded-xl border border-line bg-canvas/60 p-3.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-moss text-pine">
                        <Icon name="sparkle" size={14} />
                      </span>
                      <p className="mt-2 text-xs font-bold text-ink">Route Optimization</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted">
                        Minimizes driving time through the ghats between stops.
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-canvas/60 p-3.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sand text-[#8b6f43]">
                        <Icon name="wallet" size={14} />
                      </span>
                      <p className="mt-2 text-xs font-bold text-ink">Budget Splitter</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted">
                        Keeps group spending within the {trip.budget} target.
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-muted/80">
                    AI generation functionality will be integrated once the backend trip model is live.
                  </p>
                </Card>
              </div>
            )}
          </div>

          {/* MEMBERS AREA (Sidebar / Column) */}
          <div className="space-y-6">
            {/* Members Area Card */}
            <Card padding="md" className="border-line">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="eyebrow text-[10px] font-bold text-coral">Room circle</p>
                  <h2 className="font-display text-xl text-ink">Trip Members</h2>
                </div>
                <span className="rounded-full bg-moss px-2.5 py-0.5 text-xs font-bold text-pine">
                  {trip.members.length}
                </span>
              </div>

              {/* Members List with distinguished owner indicator */}
              <div className="mt-4 space-y-2.5">
                {/* Owner displayed first with clear Owner indicator */}
                {owner ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-coral">
                      Trip Owner
                    </p>
                    <MemberDisplay member={owner} />
                  </div>
                ) : null}

                {/* Co-planners */}
                {membersOnly.length > 0 ? (
                  <div className="space-y-1 pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      Co-planners ({membersOnly.length})
                    </p>
                    <div className="space-y-2">
                      {membersOnly.map((member) => (
                        <MemberDisplay key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-line p-4 text-center">
                    <p className="text-xs font-medium text-muted">No other members yet</p>
                    <p className="mt-1 text-[11px] text-muted/70">
                      Invite friends to plan this escape together.
                    </p>
                  </div>
                )}
              </div>

              {/* Invite Friends Button */}
              <div className="mt-5 border-t border-line pt-4">
                <Button
                  variant="soft"
                  fullWidth
                  onClick={() => setIsInviteOpen(true)}
                  className="h-10 text-xs font-semibold"
                >
                  <Icon name="user-plus" size={15} /> Invite Friends
                </Button>
              </div>
            </Card>

            {/* Quick Room Overview Card */}
            <Card padding="md" className="border-line bg-canvas/50">
              <p className="eyebrow text-[10px] font-bold text-muted">Room Summary</p>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Destination</span>
                  <span className="font-semibold text-ink">{trip.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Dates</span>
                  <span className="font-semibold text-ink">{trip.dates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Budget</span>
                  <span className="font-semibold text-ink">{trip.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Per traveler</span>
                  <span className="font-semibold text-pine">
                    ≈ ₹{Math.round(25000 / trip.members.length).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Invite Friends Modal Component */}
        <InviteFriendsModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          tripTitle={trip.title}
          onInviteUser={handleUserInvited}
        />
      </div>
    </AppShell>
  );
}
