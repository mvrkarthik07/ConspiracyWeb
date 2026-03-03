import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-side metadata, e.g. "12 theories" */
  meta?: ReactNode;
  /** Filters row below title */
  filters?: ReactNode;
}

export function PageHeader({ title, subtitle, meta, filters }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="typography-h1">{title}</h1>
          {subtitle && <p className="typography-small mt-1">{subtitle}</p>}
        </div>
        {meta && <div className="typography-small shrink-0">{meta}</div>}
      </div>
      {filters && <div className="mt-4">{filters}</div>}
    </header>
  );
}
