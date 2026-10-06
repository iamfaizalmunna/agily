import { prisma } from "@/lib/db/prisma";
import {
  type SecurityEventKind,
  serializeSecurityMeta,
} from "@/lib/security/audit-log-meta";

export {
  SECURITY_EVENT_KINDS,
  type SecurityEventKind,
  formatSecurityEventLine,
  isSecurityEventKind,
  sanitizeSecurityMeta,
  serializeSecurityMeta,
} from "@/lib/security/audit-log-meta";

export async function writeSecurityEvent(input: {
  kind: SecurityEventKind;
  actorUserId?: string | null;
  teamId?: string | null;
  meta?: Record<string, unknown>;
}) {
  await prisma.securityEvent.create({
    data: {
      kind: input.kind,
      actorUserId: input.actorUserId ?? null,
      teamId: input.teamId ?? null,
      meta: serializeSecurityMeta(input.meta ?? {}),
    },
  });
}

export async function listRecentSecurityEvents(teamId: string, limit = 50) {
  return prisma.securityEvent.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: { select: { id: true, name: true, email: true } },
    },
  });
}
