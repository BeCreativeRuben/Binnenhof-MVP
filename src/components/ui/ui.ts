import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs));
}

/** Subtle hover/active feedback (shadow + filter); avoids transform so it pairs with active:scale. */
export const interactiveHoverClasses =
  "transition-[box-shadow,background-color,border-color,filter] duration-200 ease-out motion-reduce:transition-none hover:brightness-[1.03] hover:shadow-[0_8px_22px_rgba(31,52,88,0.13)] active:brightness-[0.98] active:duration-100";

