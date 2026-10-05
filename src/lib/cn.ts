/* c8 ignore next */
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* c8 ignore next */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
