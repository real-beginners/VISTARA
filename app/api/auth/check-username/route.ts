export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string } | null;
  const username = body?.username?.trim().toLowerCase();
  if (!username || !/^[a-z0-9_]{3,20}$/.test(username)) {
    return Response.json({ available: false });
  }

  // Username checking will query the Firestore 'users' collection in Task 2.
  return Response.json({ available: true });
}
