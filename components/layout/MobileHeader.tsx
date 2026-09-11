import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "../ui/Icon";

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between border-b border-line bg-canvas px-5 py-4 lg:hidden">
      <Logo />
      <div className="flex items-center gap-2">
        <Link href="/trips/create-trip" className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-white" aria-label="Create new trip">
          <Icon name="plus" size={18} />
        </Link>
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-xs font-bold text-white" aria-label="Open profile">AT</Link>
      </div>
    </header>
  );
}
