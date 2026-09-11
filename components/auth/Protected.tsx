"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    getSession().then((session) => {
      if (!active) return;
      if (!session) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      else setReady(true);
    });
    return () => { active = false; };
  }, [pathname, router]);

  if (!ready) return <div className="flex min-h-[70vh] items-center justify-center"><div className="text-center"><span className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-moss text-pine"><span className="h-4 w-4 rotate-45 rounded border-2 border-coral" /></span><p className="mt-4 text-xs font-semibold text-muted">Preparing your travel space…</p></div></div>;
  return <>{children}</>;
}
