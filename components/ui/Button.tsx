import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-muted active:bg-accent/90 border-transparent",
  secondary:
    "bg-surface-light text-[var(--text)] hover:bg-surface-lighter border-border",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:bg-surface-light hover:text-[var(--text)] border-transparent",
  outline:
    "bg-transparent text-[var(--text)] hover:bg-surface-light border-border hover:border-border-strong",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-ds",
  md: "h-10 px-4 text-sm rounded-ds",
  lg: "h-11 px-5 text-base rounded-ds-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center font-medium border transition-colors duration-fast",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
);

Button.displayName = "Button";
