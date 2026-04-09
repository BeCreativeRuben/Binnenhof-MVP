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
        "rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-bold text-[#273247]">{children}</h2>;
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("mt-1 text-sm text-[#5f6c84]", className)}>{children}</p>;
}

