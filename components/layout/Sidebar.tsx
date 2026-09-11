import Link from "next/link";
import { Logo } from "./Logo";
import { Icon, type IconName } from "../ui/Icon";

type NavItem = { label: string; href: string; icon: IconName };

const primaryNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "home" },
  { label: "My trips", href: "/dashboard", icon: "map" },
];

const secondaryNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: "users" },
  { label: "Preferences", href: "/profile", icon: "sliders" },
];

function NavLink({ item }: { item: NavItem }) {
  return (
    <Link href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-moss/60 hover:text-pine">
      <Icon name={item.icon} size={18} className="transition group-hover:text-pine" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-line bg-canvas px-5 py-6 lg:flex">
      <Logo />
      <div className="mt-12 flex flex-1 flex-col">
        <p className="eyebrow mb-3 px-3 text-[10px] font-bold text-muted/70">Workspace</p>
        <nav className="space-y-1" aria-label="Workspace navigation">
          {primaryNav.map((item) => <NavLink item={item} key={item.label} />)}
        </nav>
        <p className="eyebrow mb-3 mt-10 px-3 text-[10px] font-bold text-muted/70">Account</p>
        <nav className="space-y-1" aria-label="Account navigation">
          {secondaryNav.map((item) => <NavLink item={item} key={item.label} />)}
        </nav>
        <div className="mt-auto rounded-2xl bg-pine p-4 text-white">
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Icon name="sparkle" size={18} className="text-coral-soft" />
          </div>
          <p className="text-sm font-semibold">Start with your next place</p>
          <p className="mt-1 text-xs leading-5 text-white/65">Bring your people, ideas, and wish list together.</p>
          <Link href="/trips/create-trip" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-coral-soft hover:text-white">
            Create a trip <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
