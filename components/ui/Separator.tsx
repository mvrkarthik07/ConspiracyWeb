import { type HTMLAttributes } from "react";

export function Separator({
  className = "",
  orientation = "horizontal",
  ...props
}: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      className={[
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
