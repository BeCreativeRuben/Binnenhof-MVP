import type { ReactNode } from "react";
import { cn } from "@/components/ui/ui";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-semibold">{children}</h2>;
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("mt-1 text-sm text-zinc-600", className)}>{children}</p>;
}

