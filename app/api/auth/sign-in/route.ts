export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    { error: "Direct API sign-in is deprecated. Use Firebase client authentication." },
    { status: 400 }
  );
}
