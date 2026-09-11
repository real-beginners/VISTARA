"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function SignOutButton({ variant = "outline" }: { variant?: "outline" | "ghost" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function handleSignOut() { setLoading(true); await signOut(); router.replace("/"); }
  return <Button type="button" variant={variant} onClick={handleSignOut} disabled={loading}><Icon name="logout" size={16} />{loading ? "Signing out…" : "Sign out"}</Button>;
}
