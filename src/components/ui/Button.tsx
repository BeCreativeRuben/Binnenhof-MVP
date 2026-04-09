"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/components/ui/ui";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2f4a78] px-4 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(47,74,120,0.35)] active:scale-[0.99] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ButtonSecondary({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#d6deea] bg-white px-4 text-[15px] font-semibold text-[#273247] shadow-[0_2px_8px_rgba(31,52,88,0.08)] active:scale-[0.99] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

