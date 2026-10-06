import { prisma } from "@/lib/db/prisma";
import {
  parseUserAppearance,
  type UserAppearance,
} from "@/lib/appearance/appearance";

export type UserProfileRow = {
  id: string;
  name: string;
  email: string;
  avatarPath: string | null;
  appearance: UserAppearance;
};

export async function getUserProfile(userId: string): Promise<UserProfileRow | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarPath: true,
      appearance: true,
    },
  });
  if (!row) return null;
  return {
    ...row,
    appearance: parseUserAppearance(row.appearance),
  };
}

export async function usersShareStudio(viewerId: string, targetUserId: string) {
  if (viewerId === targetUserId) return true;
  const link = await prisma.teamMember.findFirst({
    where: {
      userId: viewerId,
      team: { members: { some: { userId: targetUserId } } },
    },
    select: { id: true },
  });
  return Boolean(link);
}
