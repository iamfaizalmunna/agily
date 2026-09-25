-- AlterTable
ALTER TABLE "Item" ADD COLUMN "parentId" TEXT;
ALTER TABLE "Item" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'task';

-- CreateIndex
CREATE INDEX "Item_parentId_idx" ON "Item"("parentId");
