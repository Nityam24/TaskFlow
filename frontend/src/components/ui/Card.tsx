import type { CardProps } from "../../types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  );
}
