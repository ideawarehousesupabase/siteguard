import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const status = cva("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap border", {
  variants: {
    tone: {
      success: "bg-success-soft text-success border-success/20",
      warning: "bg-warning-soft text-warning border-warning/25",
      danger: "bg-danger-soft text-danger border-danger/20",
      info: "bg-info-soft text-info border-info/20",
      neutral: "bg-muted text-muted-foreground border-border",
    },
  },
});

const toneMap: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Valid: "success", Allowed: "success", PASS: "success", Closed: "neutral", "On Site": "success", Completed: "success", Low: "neutral",
  "Allowed / Override": "success",
  "Expiring Soon": "warning", Escalated: "warning", Warning: "warning", Pending: "warning", Medium: "warning", Override: "warning",
  "Escalated / Pending": "warning",
  Expired: "danger", Denied: "danger", FAIL: "danger", Open: "danger", High: "danger",
  Active: "info", "Off Site": "neutral", "Checked Out": "neutral",
};

export function StatusBadge({ value }: { value: string }) {
  const tone = toneMap[value] ?? "neutral";
  return (
    <span className={status({ tone })}>
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className, action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("rounded-lg border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function DataTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/60 text-left">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export const td = "px-4 py-3 whitespace-nowrap";
export const rowLink = "cursor-pointer hover:bg-accent/60 transition-colors";

export function FilterTabs<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
            o === value ? "border-sidebar bg-sidebar text-sidebar-foreground" : "bg-card hover:bg-muted",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

export const selectCls =
  "flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
