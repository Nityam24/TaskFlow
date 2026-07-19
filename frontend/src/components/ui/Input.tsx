import { forwardRef } from "react";
import type { InputProps } from "../../types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          clsx(
            "w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20",
            error &&
              "border-rose-400/70 focus:border-rose-400 focus:ring-rose-500/20",
            className,
          ),
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
