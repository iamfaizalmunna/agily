"use server";

import { unlink } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { trustedMutationOriginError } from "@/lib/security/mutation-guard";
import {
  isIconSetId,
  isThemePreset,
  parseUserAppearance,
  serializeUserAppearance,
} from "@/lib/appearance/appearance";
import {
  avatarStorageFilename,
  validateAvatarBytes,
} from "@/lib/appearance/avatar";
import {
  avatarAbsolutePath,
  ensureAvatarDir,
} from "@/lib/appearance/storage";
import { normalizeColorMode } from "@/lib/theme/theme";

async function guardProfileMutation() {
  if (await trustedMutationOriginError()) redirect("/home");
}

export async function persistColorModeAction(colorMode: string) {
  if (await trustedMutationOriginError()) return;
  const user = await requireUser();
  const mode = normalizeColorMode(colorMode);
  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { appearance: true },
  });
  const current = parseUserAppearance(row?.appearance);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      appearance: serializeUserAppearance({ ...current, colorMode: mode }),
    },
  });
}

export async function updateAppearanceAction(formData: FormData) {
  await guardProfileMutation();
  const user = await requireUser();
  const colorMode = normalizeColorMode(String(formData.get("colorMode") ?? ""));
  const themePreset = String(formData.get("themePreset") ?? "");
  const iconSet = String(formData.get("iconSet") ?? "");
  const current = parseUserAppearance(
    (
      await prisma.user.findUnique({
        where: { id: user.id },
        select: { appearance: true },
      })
    )?.appearance,
  );
  const next = {
    ...current,
    colorMode,
    themePreset: isThemePreset(themePreset) ? themePreset : current.themePreset,
    iconSet: isIconSetId(iconSet) ? iconSet : current.iconSet,
  };
  await prisma.user.update({
    where: { id: user.id },
    data: { appearance: serializeUserAppearance(next) },
  });
  revalidatePath("/home/profile");
  revalidatePath("/home");
  redirect("/home/profile?saved=appearance");
}

export async function removeAvatarAction() {
  await guardProfileMutation();
  const user = await requireUser();
  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { avatarPath: true },
  });
  if (row?.avatarPath) {
    try {
      await unlink(avatarAbsolutePath(row.avatarPath));
    } catch {
      /* missing file */
    }
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { avatarPath: null },
  });
  revalidatePath("/home/profile");
  redirect("/home/profile?saved=avatar");
}

export async function uploadAvatarAction(formData: FormData) {
  await guardProfileMutation();
  const user = await requireUser();
  const file = formData.get("avatar");
  if (!(file instanceof File) || !file.size) {
    redirect("/home/profile?error=avatar");
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const checked = validateAvatarBytes(bytes);
  if (!checked.ok) {
    redirect(`/home/profile?error=${encodeURIComponent(checked.error)}`);
  }
  const filename = avatarStorageFilename(user.id, checked.kind);
  await ensureAvatarDir();
  const previous = await prisma.user.findUnique({
    where: { id: user.id },
    select: { avatarPath: true },
  });
  if (previous?.avatarPath && previous.avatarPath !== filename) {
    try {
      await unlink(avatarAbsolutePath(previous.avatarPath));
    } catch {
      /* ignore */
    }
  }
  const { writeFile } = await import("node:fs/promises");
  await writeFile(avatarAbsolutePath(filename), bytes);
  await prisma.user.update({
    where: { id: user.id },
    data: { avatarPath: filename },
  });
  revalidatePath("/home/profile");
  redirect("/home/profile?saved=avatar");
}
