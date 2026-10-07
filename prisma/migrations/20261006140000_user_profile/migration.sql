-- Per-user appearance JSON and optional avatar file key
ALTER TABLE "User" ADD COLUMN "appearance" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN "avatarPath" TEXT;
