"use server";

import { trustedMutationOriginError } from "@/lib/security/mutation-guard";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getMembership } from "@/lib/teams/queries";
import { safeStudioNext } from "@/lib/views/views";

export async function openNoticeAction(formData: FormData) {
  if (await trustedMutationOriginError()) redirect("/home");
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const noticeId = String(formData.get("noticeId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  const notice = await prisma.notification.findFirst({
    where: { id: noticeId, userId: user.id, teamId: ctx.team.id },
  });
  if (!notice) redirect(`/t/${slug}/notices`);
  await prisma.notification.update({
    where: { id: notice.id },
    data: { readAt: new Date() },
  });
  redirect(
    safeStudioNext(slug, `/t/${slug}/notices`, notice.href),
  );
}

export async function markAllNoticesReadAction(formData: FormData) {
  if (await trustedMutationOriginError()) redirect("/home");
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  await prisma.notification.updateMany({
    where: { userId: user.id, teamId: ctx.team.id, readAt: null },
    data: { readAt: new Date() },
  });
  redirect(`/t/${slug}/notices`);
}
