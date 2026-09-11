import { MemberAvatar } from "./MemberAvatar";
import { Icon } from "../ui/Icon";
import type { MockTripMember } from "@/lib/mockTripData";

type MemberDisplayProps = {
  member: MockTripMember;
  compact?: boolean;
  className?: string;
};

export function MemberDisplay({ member, compact = false, className = "" }: MemberDisplayProps) {
  const isOwner = member.role === "owner";

  if (compact) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <MemberAvatar initials={member.initials} tone={member.tone} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-ink">{member.name}</p>
          <span className="text-[10px] text-muted">{isOwner ? "Owner" : "Member"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border border-line bg-paper p-3 transition hover:border-pine/30 ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        <MemberAvatar initials={member.initials} tone={member.tone} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-ink">{member.name}</p>
            {isOwner ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-coral-soft px-2 py-0.5 text-[10px] font-bold text-coral">
                <Icon name="star" size={10} /> Owner
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-muted">{member.handle || member.email}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        {!isOwner ? (
          <span className="rounded-full bg-moss/70 px-2.5 py-1 text-[10px] font-semibold text-pine-dark">
            Co-planner
          </span>
        ) : (
          <span className="rounded-full bg-coral/10 px-2.5 py-1 text-[10px] font-semibold text-coral">
            Trip creator
          </span>
        )}
      </div>
    </div>
  );
}
