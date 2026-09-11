"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { MemberAvatar } from "./MemberAvatar";
import { Card } from "../ui/Card";
import { INITIAL_TRIP_INVITATIONS, type MockTripInvitation } from "@/lib/mockTripData";

type TripInvitationsProps = {
  className?: string;
  onAccepted?: (invitation: MockTripInvitation) => void;
};

export function TripInvitations({ className = "", onAccepted }: TripInvitationsProps) {
  const [invitations, setInvitations] = useState<MockTripInvitation[]>(INITIAL_TRIP_INVITATIONS);
  const [actionFeedback, setActionFeedback] = useState<{ id: string; message: string; type: "accepted" | "declined" } | null>(null);

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");

  const handleAccept = (inv: MockTripInvitation) => {
    setInvitations((prev) =>
      prev.map((item) => (item.id === inv.id ? { ...item, status: "accepted" as const } : item))
    );
    setActionFeedback({
      id: inv.id,
      message: `You accepted the invite to ${inv.tripName}!`,
      type: "accepted",
    });
    if (onAccepted) onAccepted(inv);
  };

  const handleDecline = (inv: MockTripInvitation) => {
    setInvitations((prev) =>
      prev.map((item) => (item.id === inv.id ? { ...item, status: "declined" as const } : item))
    );
    setActionFeedback({
      id: inv.id,
      message: `Declined invite for ${inv.tripName}.`,
      type: "declined",
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral-soft text-coral">
            <Icon name="mail" size={15} />
          </span>
          <h2 className="font-display text-xl text-ink">Trip Invitations</h2>
          {pendingInvitations.length > 0 ? (
            <span className="rounded-full bg-coral-soft px-2 py-0.5 text-xs font-bold text-coral">
              {pendingInvitations.length} pending
            </span>
          ) : null}
        </div>
      </div>

      {actionFeedback ? (
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold animate-in fade-in ${
            actionFeedback.type === "accepted"
              ? "bg-moss text-pine-dark"
              : "bg-sand/80 text-ink"
          }`}
        >
          <span className="flex items-center gap-2">
            <Icon name={actionFeedback.type === "accepted" ? "check-circle" : "info"} size={15} />
            {actionFeedback.message}
          </span>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {pendingInvitations.length === 0 ? (
        <Card padding="md" className="border-dashed bg-paper/60 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-moss/70 text-pine">
            <Icon name="check" size={18} />
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">No pending invitations</p>
          <p className="mt-1 text-xs text-muted">
            When friends invite you to collaborate on a trip, they will appear right here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pendingInvitations.map((inv) => (
            <Card
              key={inv.id}
              padding="md"
              className="flex flex-col justify-between border-line transition hover:border-pine/30 hover:shadow-card"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="eyebrow text-[10px] font-bold text-coral">Invited to join</span>
                    <h3 className="truncate font-display text-lg tracking-[-0.02em] text-ink">
                      {inv.tripName}
                    </h3>
                  </div>
                  <span className="rounded-full bg-moss/80 px-2 py-0.5 text-[10px] font-bold text-pine">
                    Room invite
                  </span>
                </div>

                {/* Invited By */}
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-canvas/60 p-2 text-xs text-muted">
                  <MemberAvatar initials={inv.invitedBy.initials} tone={inv.invitedBy.tone} size="sm" />
                  <span>
                    Invited by <strong className="text-ink">{inv.invitedBy.name}</strong>
                  </span>
                </div>

                {/* Destination & Date details */}
                <div className="mt-3 space-y-1.5 text-xs text-muted">
                  <p className="flex items-center gap-1.5">
                    <Icon name="map-pin" size={14} className="text-coral shrink-0" />
                    <span className="truncate text-ink font-medium">{inv.destination}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Icon name="calendar" size={14} className="text-pine shrink-0" />
                    <span>{inv.date}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 border-t border-line/70 pt-3">
                <button
                  type="button"
                  onClick={() => handleAccept(inv)}
                  className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-pine px-3 text-xs font-bold text-white transition hover:bg-pine-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/30"
                >
                  <Icon name="check" size={14} /> Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleDecline(inv)}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-line bg-paper px-3 text-xs font-semibold text-muted transition hover:bg-coral-soft/50 hover:text-coral hover:border-coral/40 focus-visible:outline-none"
                >
                  <Icon name="x" size={14} /> Decline
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
