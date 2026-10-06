import { readFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { detectAvatarImageKind, avatarContentType } from "@/lib/appearance/avatar";
import { avatarAbsolutePath } from "@/lib/appearance/storage";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { usersShareStudio } from "@/lib/profile/queries";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const viewer = await getCurrentUser();
  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userId } = await context.params;
  if (!userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const allowed = await usersShareStudio(viewer.id, userId);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPath: true },
  });
  if (!user?.avatarPath) {
    return NextResponse.json({ error: "No avatar" }, { status: 404 });
  }
  try {
    const bytes = await readFile(avatarAbsolutePath(user.avatarPath));
    const kind = detectAvatarImageKind(new Uint8Array(bytes));
    if (!kind) {
      return NextResponse.json({ error: "Invalid file" }, { status: 500 });
    }
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": avatarContentType(kind),
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
