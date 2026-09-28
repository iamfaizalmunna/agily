import { prisma } from "@/lib/db/prisma";
import {
  diffItemEvents,
  type ItemEventDraft,
  type ItemSnapshot,
} from "@/lib/activity/events";

export async function writeItemEvents(
  itemId: string,
  userId: string,
  before: ItemSnapshot,
  after: ItemSnapshot,
  nameById: Map<string, string>,
) {
  const drafts = diffItemEvents(before, after, nameById);
  if (!drafts.length) return;
  await prisma.itemEvent.createMany({
    data: drafts.map((row: ItemEventDraft) => ({
      itemId,
      userId,
      kind: row.kind,
      fromValue: row.fromValue,
      toValue: row.toValue,
    })),
  });
}
