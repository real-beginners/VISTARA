"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { subscribeToAuth } from "@/lib/auth";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-moss text-pine">
            <span className="h-4 w-4 rotate-45 rounded border-2 border-coral" />
          </span>
          <p className="mt-4 text-xs font-semibold text-muted">Preparing your travel space…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
