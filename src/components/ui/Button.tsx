import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.06)]",
      secondary: "bg-primary-600 text-white hover:bg-primary-700 shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.06)]",
      outline: "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
      ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.06)]",
    };

    const sizes = {
      sm: "h-8 px-3.5 text-[13px] rounded-lg gap-1.5",
      md: "h-9 px-4 text-[13px] rounded-lg gap-1.5",
      lg: "h-10 px-5 text-sm rounded-lg gap-2",
      icon: "h-9 w-9 rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
