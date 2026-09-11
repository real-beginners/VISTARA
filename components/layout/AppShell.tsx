"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { NotificationsButton } from "./NotificationsButton";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";
import { Icon } from "@/components/ui/Icon";
import { Protected } from "@/components/auth/Protected";

export function AppShell({ children }: { children: ReactNode }) {
  return <Protected><div className="min-h-screen bg-canvas"><Sidebar /><div className="lg:pl-[248px]"><MobileHeader /><header className="hidden h-[76px] items-center justify-between border-b border-line bg-canvas/90 px-8 backdrop-blur lg:flex xl:px-12"><label className="flex w-full max-w-sm items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-muted"><Icon name="search" size={17} /><input className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/65" placeholder="Search places, trips, and people" aria-label="Search" /></label><div className="flex items-center gap-2"><NotificationsButton /><Link href="/profile" className="flex items-center gap-2 rounded-full p-1.5 pr-3 transition hover:bg-moss"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">AT</span><span className="hidden text-xs font-bold text-ink xl:block">Your profile</span></Link></div></header><main className="mx-auto w-full max-w-[1440px] px-5 py-7 pb-28 sm:px-8 sm:py-10 lg:px-12 lg:pb-12">{children}</main><nav className="fixed inset-x-4 bottom-4 z-20 grid grid-cols-5 rounded-2xl border border-line bg-paper/95 p-2 shadow-soft backdrop-blur lg:hidden" aria-label="Mobile navigation">{[{ label: "Home", href: "/dashboard", icon: "home" as const }, { label: "Explore", href: "/explore", icon: "compass" as const }, { label: "Plan", href: "/plan", icon: "sparkle" as const }, { label: "Trips", href: "/trips", icon: "map" as const }, { label: "Profile", href: "/profile", icon: "users" as const }].map((item) => <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted transition hover:bg-moss hover:text-pine"><Icon name={item.icon} size={17} /><span>{item.label}</span></Link>)}</nav></div></div></Protected>;
}
