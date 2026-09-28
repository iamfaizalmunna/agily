-- AlterTable
ALTER TABLE "ItemUpdate" ADD COLUMN "parentId" TEXT;

-- CreateTable
CREATE TABLE "ItemEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "userId" TEXT,
    "kind" TEXT NOT NULL,
    "fromValue" TEXT,
    "toValue" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemEvent_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ItemEvent_itemId_createdAt_idx" ON "ItemEvent"("itemId", "createdAt");

-- CreateIndex
CREATE INDEX "ItemUpdate_parentId_idx" ON "ItemUpdate"("parentId");

-- RedefineTables for ItemUpdate self-relation (SQLite)
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemUpdate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemUpdate_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemUpdate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemUpdate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ItemUpdate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ItemUpdate" ("id", "itemId", "userId", "body", "createdAt", "parentId") SELECT "id", "itemId", "userId", "body", "createdAt", NULL FROM "ItemUpdate";
DROP TABLE "ItemUpdate";
ALTER TABLE "new_ItemUpdate" RENAME TO "ItemUpdate";
PRAGMA foreign_keys=ON;
