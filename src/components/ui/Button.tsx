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
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 text-[15px] font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-50",
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
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-[15px] font-semibold text-zinc-900 shadow-sm active:scale-[0.99] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

