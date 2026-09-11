import Link from "next/link";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { MemberAvatar } from "./MemberAvatar";

type TripCardProps = {
  title: string;
  dates: string;
  location: string;
  tone?: "coral" | "pine" | "sand" | "blue";
  members?: string[];
  href?: string;
};

export function TripCard({ title, dates, location, tone = "pine", members = ["AT", "MK"], href = "/trips/sample-trip" }: TripCardProps) {
  const artClasses = {
    coral: "from-[#eab19c] via-[#d98268] to-[#7e6a58]",
    pine: "from-[#7fa9a0] via-[#386e67] to-[#173b38]",
    sand: "from-[#edcf99] via-[#bd9a63] to-[#6f7259]",
    blue: "from-[#b6d6d8] via-[#6e9a9d] to-[#3e626d]",
  };

  return (
    <Link href={href} className="group block">
      <Card padding="none" className="overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft">
        <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${artClasses[tone]}`}>
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[22px] border-white/10" />
          <div className="absolute -bottom-16 left-7 h-36 w-36 rounded-full border-[17px] border-white/10" />
          <div className="absolute bottom-4 left-5 flex items-center gap-2 rounded-full bg-black/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Icon name="map" size={14} /> {location}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl tracking-[-0.02em] text-ink">{title}</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"><Icon name="calendar" size={14} /> {dates}</p>
            </div>
            <Icon name="arrow-up-right" size={18} className="text-muted transition group-hover:text-pine" />
          </div>
          <div className="mt-5 flex items-center">
            <div className="flex -space-x-2">
              {members.map((member, index) => <MemberAvatar key={member} initials={member} size="sm" tone={index % 2 === 0 ? "coral" : "pine"} />)}
            </div>
            <span className="ml-3 text-xs text-muted">{members.length} travelers</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
