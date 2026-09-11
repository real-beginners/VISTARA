"use client";

import { useState, useMemo } from "react";
import { Icon } from "../ui/Icon";
import { MemberAvatar } from "./MemberAvatar";
import { INITIAL_INVITABLE_USERS, type MockInvitableUser } from "@/lib/mockTripData";

type InviteFriendsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tripTitle?: string;
  onInviteUser?: (user: MockInvitableUser) => void;
};

export function InviteFriendsModal({
  isOpen,
  onClose,
  tripTitle = "Lonavala Monsoon Escape",
  onInviteUser,
}: InviteFriendsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<MockInvitableUser[]>(INITIAL_INVITABLE_USERS);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.handle.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  if (!isOpen) return null;

  const handleInvite = (user: MockInvitableUser) => {
    setSendingId(user.id);
    setFeedbackMessage(null);

    // Realistic brief client-side interaction delay for delightful UI feedback
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: "invited" as const } : u))
      );
      setSendingId(null);
      setFeedbackMessage(`Invitation dispatched to ${user.name}!`);
      if (onInviteUser) {
        onInviteUser(user);
      }
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-paper shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line p-6">
          <div>
            <span className="eyebrow text-[10px] font-bold text-coral">Collaboration</span>
            <h2 id="invite-modal-title" className="mt-1 font-display text-2xl tracking-[-0.03em] text-ink">
              Invite friends to trip
            </h2>
            <p className="mt-1 text-xs text-muted">
              Bring your co-planners into <span className="font-semibold text-ink">{tripTitle}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-muted transition hover:bg-moss hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/30"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-6 pb-3">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, handle, or email (e.g. Rahul, Sneha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-canvas/60 pl-10 pr-9 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-pine focus:bg-paper focus:ring-4 focus:ring-pine/10"
              autoFocus
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-ink"
              >
                <Icon name="x" size={14} />
              </button>
            ) : null}
          </div>

          {feedbackMessage ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-moss/70 px-3 py-2 text-xs font-semibold text-pine-dark animate-in fade-in">
              <Icon name="check-circle" size={15} />
              <span>{feedbackMessage}</span>
            </div>
          ) : null}
        </div>

        {/* User list with empty and matching states */}
        <div className="max-h-80 overflow-y-auto px-6 py-2">
          {filteredUsers.length === 0 ? (
            <div className="my-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sand/60 text-muted">
                <Icon name="search" size={20} />
              </div>
              <p className="mt-3 font-display text-base text-ink">No travellers found</p>
              <p className="mt-1 text-xs text-muted">
                No matching Vistara users for &ldquo;{searchQuery}&rdquo;. Try checking the spelling.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredUsers.map((user) => {
                const isSending = sendingId === user.id;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-line/80 bg-paper p-3 transition hover:border-pine/30 hover:bg-canvas/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MemberAvatar initials={user.initials} tone={user.tone} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {user.status === "already_member" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-line/80 px-3 py-1 text-xs font-semibold text-muted">
                          Already a member
                        </span>
                      ) : user.status === "invited" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-moss px-3 py-1 text-xs font-bold text-pine">
                          <Icon name="check" size={13} />
                          Invitation sent
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isSending}
                          onClick={() => handleInvite(user)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-pine px-3.5 text-xs font-semibold text-white transition hover:bg-pine-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/30 disabled:opacity-60"
                        >
                          {isSending ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                              Sending...
                            </span>
                          ) : (
                            <>
                              <Icon name="user-plus" size={13} />
                              Invite
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line bg-canvas/30 px-6 py-4">
          <p className="flex items-center gap-1.5 text-[11px] text-muted">
            <Icon name="info" size={13} />
            Invited members will receive an in-app invite to join.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-semibold text-ink transition hover:bg-moss/40 focus-visible:outline-none"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
