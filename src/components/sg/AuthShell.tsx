import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <span className="font-display text-lg font-bold">SiteGuard OS</span>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-sidebar-primary">Gatehouse · Year 1</p>
          <h2 className="mt-3 max-w-md text-4xl font-bold leading-tight">
            Every person through the gate. Every certificate checked.
          </h2>
          <p className="mt-4 max-w-md text-sidebar-muted">
            Gate access, worker compliance, incidents, inductions and reporting in one system.
          </p>
        </div>
        <div className="hazard-stripe h-2 w-full rounded-sm opacity-80" />
      </aside>
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-1.5 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
