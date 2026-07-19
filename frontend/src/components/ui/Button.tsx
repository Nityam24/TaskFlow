import type { ButtonProps } from "../../types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
          variant === "default" &&
            "border-transparent bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400",
          variant === "secondary" &&
            "border-slate-700 bg-slate-800/70 text-slate-100 hover:bg-slate-700",
          variant === "ghost" &&
            "border-transparent bg-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white",
          variant === "danger" &&
            "border-rose-500/20 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25",
          size === "sm" && "px-3 py-1.5 text-xs",
          className,
        ),
      )}
      {...props}
    />
  );
}
