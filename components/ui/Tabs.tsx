"use client";

import { useState, type ReactNode } from "react";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const value = controlledValue ?? uncontrolled;
  const setValue = onValueChange ?? setUncontrolled;
  return (
    <div className={className} data-value={value}>
      {typeof children === "function"
        ? (children as (ctx: { value: string; setValue: (v: string) => void }) => ReactNode)({
            value,
            setValue,
          })
        : children}
    </div>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={`inline-flex rounded-ds-lg border border-border bg-panel p-1 ${className}`}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  className = "",
}: TabsTriggerProps & { setValue?: (v: string) => void; selected?: boolean }) {
  return (
    <button
      type="button"
      role="tab"
      className={`rounded-ds px-3 py-1.5 text-sm font-medium transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${className}`}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  return (
    <div role="tabpanel" className={className} data-state={value}>
      {children}
    </div>
  );
}
