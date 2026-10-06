import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import {
  countUnreadNotices,
  fetchLiveNotices,
  parseSinceParam,
} from "@/lib/notices/live-feed";
import { getMembership } from "@/lib/teams/queries";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("team");
  if (!slug) {
    return NextResponse.json({ error: "Missing team" }, { status: 400 });
  }
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const since = parseSinceParam(request.nextUrl.searchParams.get("since"));
  const [notices, unread] = await Promise.all([
    fetchLiveNotices(user.id, ctx.team.id, since),
    countUnreadNotices(user.id, ctx.team.id),
  ]);
  return NextResponse.json({
    notices: notices.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      readAt: row.readAt?.toISOString() ?? null,
    })),
    unread,
    serverTime: new Date().toISOString(),
  });
}
