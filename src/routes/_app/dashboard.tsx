import { createFileRoute, Link } from "@tanstack/react-router";
import { HardHat, UserRoundCheck, ShieldAlert, TriangleAlert, ShieldCheck, FileClock } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "@/components/sg/ui";
import { dashboardStats as s, MAIN_SITE } from "@/data/mock";
import { pageHead } from "@/lib/meta";

export const Route = createFileRoute("/_app/dashboard")({
  head: pageHead("Dashboard", "Live gatehouse overview for Riverside Development."),
  component: Dashboard,
});

const cards = [
  { label: "People On Site", value: s.peopleOnSite, icon: HardHat, to: "/people" },
  { label: "Visitors Today", value: s.visitorsToday, icon: UserRoundCheck, to: "/visitors" },
  { label: "Access Exceptions", value: s.accessExceptions, icon: ShieldAlert, to: "/gatehouse", alert: true },
  { label: "Open Incidents", value: s.openIncidents, icon: TriangleAlert, to: "/incidents", alert: true },
  { label: "Compliance Status", value: `${s.complianceStatus}%`, icon: ShieldCheck, to: "/compliance" },
  { label: "Documents Expiring", value: s.documentsExpiring, icon: FileClock, to: "/compliance" },
] as const;

const activity = [
  { time: "08:45", who: "James Carter", what: "Access Escalated", status: "Escalated" },
  { time: "08:32", who: "Sarah Green", what: "Checked In", status: "Allowed" },
  { time: "08:10", who: "Rachel Smith", what: "Visitor Checked In", status: "Allowed" },
  { time: "07:58", who: "Near Miss", what: "Loading Bay", status: "Open" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={MAIN_SITE.name} subtitle="Today's site overview" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, to, ...c }) => (
          <Link key={label} to={to} className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon className={"alert" in c ? "size-5 text-danger" : "size-5 text-muted-foreground"} />
            </div>
            <p className="mt-3 font-display text-3xl font-bold sm:text-4xl">{value}</p>
          </Link>
        ))}
      </div>
      <Panel title="Recent Activity" className="mt-6">
        <ul className="divide-y">
          {activity.map((a) => (
            <li key={a.time} className="flex items-center gap-4 px-4 py-3">
              <span className="font-mono text-sm text-muted-foreground">{a.time}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{a.who}</p>
                <p className="text-sm text-muted-foreground">{a.what}</p>
              </div>
              <StatusBadge value={a.status} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
