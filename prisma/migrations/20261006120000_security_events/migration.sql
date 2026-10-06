-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "actorUserId" TEXT,
    "teamId" TEXT,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SecurityEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SecurityEvent_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "SecurityEvent_teamId_createdAt_idx" ON "SecurityEvent"("teamId", "createdAt");
CREATE INDEX "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");
