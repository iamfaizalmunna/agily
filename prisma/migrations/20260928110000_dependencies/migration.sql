-- CreateTable
CREATE TABLE "ItemDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "predecessorId" TEXT NOT NULL,
    "successorId" TEXT NOT NULL,
    CONSTRAINT "ItemDependency_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemDependency_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemDependency_successorId_fkey" FOREIGN KEY ("successorId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemDependency_predecessorId_successorId_key" ON "ItemDependency"("predecessorId", "successorId");

-- CreateIndex
CREATE INDEX "ItemDependency_projectId_idx" ON "ItemDependency"("projectId");
