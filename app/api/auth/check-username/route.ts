import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { username?: string } | null;
  const username = body?.username?.trim().toLowerCase();
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!username || !/^[a-z0-9_]{3,20}$/.test(username) || !url || !serviceKey) return Response.json({ available: null });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.from("profiles").select("id").eq("username", username).maybeSingle();
  if (error) return Response.json({ available: null });
  return Response.json({ available: !data });
}
