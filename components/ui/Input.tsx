import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => (
    <input
      ref={ref}
      className={[
        "w-full rounded-ds border bg-surface-light px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)]",
        "transition-colors duration-fast",
        "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error ? "border-verdict-false focus:ring-verdict-false/50" : "border-border",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
);

Input.displayName = "Input";
