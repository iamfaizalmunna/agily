import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Agily",
  description: "Local agile planner. Our database only.",
};

export default async function RootPage() {
  const user = await getCurrentUser();
  redirect(user ? "/home" : "/signin");
}
