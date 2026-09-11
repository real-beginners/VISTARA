"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const notifications = [
  { title: "Your Vistara space is ready", body: "Complete your preferences to make recommendations feel like you.", time: "Just now", icon: "sparkle" as const },
  { title: "Rain is expected this evening", body: "We’ll keep an eye on the weather for your planned activity.", time: "2h ago", icon: "sun" as const },
  { title: "Ideas are waiting nearby", body: "A few places match your love of cafés and hidden gems.", time: "Yesterday", icon: "map-pin" as const },
];

export function NotificationsButton() {
  const [open, setOpen] = useState(false);
  return <div className="relative"><button type="button" onClick={() => setOpen((value) => !value)} className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-moss hover:text-pine" aria-label="Notifications" aria-expanded={open}><Icon name="bell" size={19} /><span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-coral" /></button>{open ? <div className="absolute right-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-paper shadow-soft"><div className="flex items-center justify-between border-b border-line px-5 py-4"><div><p className="font-display text-lg text-ink">Notifications</p><p className="mt-0.5 text-xs text-muted">A calm pulse on your travel circle.</p></div><span className="rounded-full bg-coral-soft px-2 py-1 text-[10px] font-bold text-coral">3 new</span></div><div className="divide-y divide-line">{notifications.map((item) => <div key={item.title} className="flex gap-3 px-5 py-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-moss text-pine"><Icon name={item.icon} size={16} /></span><div><p className="text-xs font-bold text-ink">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted">{item.body}</p><p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted/55">{item.time}</p></div></div>)}</div><div className="border-t border-line px-5 py-3 text-center text-xs font-bold text-pine">All caught up</div></div> : null}</div>;
}
