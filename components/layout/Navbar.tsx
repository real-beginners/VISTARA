import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "../ui/Button";

export function Navbar({ light = false }: { light?: boolean }) {
  return (
    <header className={`relative z-10 ${light ? "text-white" : "text-ink"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Logo light={light} />
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Main navigation">
          <Link href="/#approach" className="opacity-80 transition hover:opacity-100">Our approach</Link>
          <Link href="/#groups" className="opacity-80 transition hover:opacity-100">For groups</Link>
          <Link href="/#about" className="opacity-80 transition hover:opacity-100">About Vistara</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button href="/login" variant="ghost" className={light ? "text-white hover:bg-white/10 hover:text-white" : ""}>Log in</Button>
          <Button href="/signup" variant={light ? "soft" : "primary"} className={light ? "bg-white text-pine hover:bg-white/90" : "hidden sm:inline-flex"}>Sign up</Button>
        </div>
      </div>
    </header>
  );
}
