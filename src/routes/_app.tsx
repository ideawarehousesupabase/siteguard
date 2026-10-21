import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  UserRoundCheck,
  FolderLock,
  TriangleAlert,
  ClipboardCheck,
  FileBarChart,
  UserCircle,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { getSessionUser, signOut, type SessionUser } from "@/lib/auth";
import { StoreProvider } from "@/lib/store";
import { MAIN_SITE } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

const nav = [
  { items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Gatehouse",
    items: [
      { to: "/gatehouse", label: "Gatehouse", icon: DoorOpen },
      { to: "/people", label: "People", icon: Users },
      { to: "/visitors", label: "Visitors", icon: UserRoundCheck },
    ],
  },
  {
    group: "Safety & Compliance",
    items: [
      { to: "/compliance", label: "Compliance Vault", icon: FolderLock },
      { to: "/incidents", label: "Incidents", icon: TriangleAlert },
      { to: "/inductions", label: "Inductions & Toolbox Talks", icon: ClipboardCheck },
    ],
  },
  { group: "Reporting", items: [{ to: "/reports", label: "Reports", icon: FileBarChart }] },
  { group: "Account", items: [{ to: "/profile", label: "Profile", icon: UserCircle }] },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const u = getSessionUser();
    if (!u) navigate({ to: "/signup", replace: true });
    else setUser(u);
  }, [navigate, path]);

  useEffect(() => setOpen(false), [path]);

  if (!user) return null;

  const logout = () => {
    signOut();
    navigate({ to: "/signin", replace: true });
  };

  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        {open && (
          <div
            className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <ShieldCheck className="size-4.5" />
              </div>
              <span className="font-display font-bold">SiteGuard OS</span>
            </div>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
            {nav.map((sec, i) => (
              <div key={i}>
                {"group" in sec && (
                  <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-muted">
                    {sec.group}
                  </p>
                )}
                {sec.items.map(({ to, label, icon: Icon }) => {
                  const active = path === to || path.startsWith(to + "/");
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                      )}
                    >
                      <Icon className={cn("size-4.5", active && "text-sidebar-primary")} />
                      {label}
                    </Link>
                  );
                })}
                {"group" in sec && sec.group === "Account" && (
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                  >
                    <LogOut className="size-4.5" />
                    Logout
                  </button>
                )}
              </div>
            ))}
          </nav>
          <div className="hazard-stripe h-1.5 opacity-70" />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-6">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{MAIN_SITE.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{MAIN_SITE.id}</p>
            </div>
            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Online • Synced</span>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <div className="grid size-9 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                {user.fullName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
