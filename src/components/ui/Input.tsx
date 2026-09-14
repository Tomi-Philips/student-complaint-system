import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[13px] font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border bg-white px-3 text-[13px] placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150",
            error
              ? "border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-400"
              : "border-neutral-200 hover:border-neutral-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
