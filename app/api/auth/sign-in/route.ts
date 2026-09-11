import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { identifier?: string; password?: string };
    const identifier = body.identifier?.trim().toLowerCase();
    const password = body.password;
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!identifier || !password || !url || !anonKey || !serviceKey) return Response.json({ error: "We couldn't sign you in with those details." }, { status: 401 });

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: profile } = await admin.from("profiles").select("email").eq("username", identifier).maybeSingle();
    if (!profile?.email) return Response.json({ error: "We couldn't sign you in with those details." }, { status: 401 });

    const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: profile.email, password });
    if (error || !data.session) return Response.json({ error: "We couldn't sign you in with those details." }, { status: 401 });
    return Response.json({ session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } });
  } catch {
    return Response.json({ error: "We couldn't sign you in with those details." }, { status: 401 });
  }
}
