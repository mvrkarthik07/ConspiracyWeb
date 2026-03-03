import { forwardRef, type HTMLAttributes } from "react";

export type CardVariant = "compact" | "media" | "featured" | "default";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section";
  padding?: "none" | "sm" | "md" | "lg";
  variant?: CardVariant;
  interactive?: boolean;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const variantMap: Record<CardVariant, string> = {
  default: "rounded-ds-lg border border-border bg-surface-light shadow-ds",
  compact: "rounded-ds border border-border bg-surface-light shadow-ds p-4",
  media: "rounded-ds-lg border border-border bg-surface-light shadow-ds overflow-hidden",
  featured: "rounded-ds-lg border border-border bg-surface-light shadow-ds hover:shadow-ds-lg",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = "",
      as: Component = "div",
      padding = "md",
      variant = "default",
      interactive,
      ...props
    },
    ref
  ) => {
    const isMedia = variant === "media";
    const paddingClass = variant === "compact" ? "" : paddingMap[padding];
    return (
      <Component
        ref={ref}
        className={[
          variantMap[variant],
          !isMedia && paddingClass,
          (interactive || variant === "featured") &&
            "transition-all duration-normal hover:border-accent/40 hover:bg-surface-lighter cursor-pointer",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  as: Component = "h3",
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" }) {
  return (
    <Component
      className={`text-h3 font-semibold text-text ${className}`}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-small text-text-muted mt-1 ${className}`} {...props} />;
}
