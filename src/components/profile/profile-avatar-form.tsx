"use client";

import { UserAvatar } from "@/components/profile/user-avatar";
import {
  removeAvatarAction,
  uploadAvatarAction,
} from "@/lib/profile/actions";
import { Button } from "@/components/ui/button";

export function ProfileAvatarForm({
  userId,
  name,
  hasAvatar,
}: {
  userId: string;
  name: string;
  hasAvatar: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <UserAvatar userId={userId} name={name} hasAvatar={hasAvatar} size="lg" />
      <div className="flex flex-col gap-2">
        <form action={uploadAvatarAction} encType="multipart/form-data">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Profile photo</span>
            <input
              type="file"
              name="avatar"
              accept="image/jpeg,image/png,image/webp"
              className="text-sm"
            />
          </label>
          <Button type="submit" variant="secondary" className="mt-2">
            Upload photo
          </Button>
        </form>
        {hasAvatar ? (
          <form action={removeAvatarAction}>
            <Button type="submit" variant="quiet" className="text-destructive">
              Remove photo
            </Button>
          </form>
        ) : null}
        <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP · max 2 MB</p>
      </div>
    </div>
  );
}
