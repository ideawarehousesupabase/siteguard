import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DataTable, Field, PageHeader, Panel, StatusBadge, rowLink, td } from "@/components/sg/ui";
import { GateActivityTable } from "@/components/sg/GateActivityTable";
import { docsForWorker, sites, trainingRecords, workers } from "@/data/mock";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/people/$id")({
  loader: ({ params }) => {
    const w = workers.find((x) => x.id === params.id);
    if (!w) throw notFound();
    return w;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Worker"} — SiteGuard OS` },
      { name: "description", content: `Compliance and gate record for ${loaderData?.name ?? "worker"}.` },
      { property: "og:title", content: `${loaderData?.name ?? "Worker"} — SiteGuard OS` },
      { property: "og:description", content: "Worker compliance and gate record." },
    ],
  }),
  notFoundComponent: () => <p className="p-8">Worker not found. <Link to="/people" className="underline">Back to People</Link></p>,
  component: WorkerDetail,
});

function WorkerDetail() {
  const w = Route.useLoaderData();
  const { gate, accessDecisions } = useStore();
  const docs = docsForWorker(w.id);
  const induction = docs.find((d) => d.checkLabel === "Site Induction");
  const isJames = w.id === "WORKER001";

  const access = accessDecisions[w.id]
    ? accessDecisions[w.id] === "Escalated"
      ? "Escalated / Pending"
      : accessDecisions[w.id]
    : isJames
      ? "Escalated / Pending"
      : w.siteStatus === "On Site"
        ? "Allowed"
        : w.siteStatus;

  const complianceItems = isJames
    ? [
        { name: "Crane Operator Competency", status: "Expired" },
        { name: "Site Induction", status: "Valid" },
        { name: "Insurance", status: "Valid" },
        { name: "Identity", status: "Valid" },
      ]
    : [
        { name: "Identity", status: "Valid" },
        { name: "Site Induction", status: induction?.status ?? "Valid" },
        ...docs.map((d) => ({ name: d.name, status: d.status })),
      ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link
        to="/people"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        People
      </Link>
      <PageHeader title={w.name} subtitle={`${w.id} · ${w.role}`} action={<StatusBadge value={w.compliance} />} />
      <Panel>
        <dl className="grid grid-cols-2 gap-5 p-5 md:grid-cols-5">
          <Field label="Full Name" value={w.name} />
          <Field label="Employer" value={w.employer} />
          <Field label="Role" value={w.role} />
          <Field label="Assigned Site" value={sites.find((s) => s.id === w.siteId)?.name ?? "Riverside Development"} />
          <Field label="Access Status" value={<StatusBadge value={access} />} />
        </dl>
      </Panel>

      <Panel title="Compliance">
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {complianceItems.map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-lg border bg-card/60 p-4">
              <span className="text-sm font-semibold">{c.name}</span>
              <StatusBadge value={c.status} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="Induction Status">
          <div className="flex items-center justify-between p-5">
            <span className="font-medium">Site Safety Induction</span>
            <StatusBadge value={induction?.status ?? "Valid"} />
          </div>
        </Panel>
        <Panel title="Training Records">
          <ul className="divide-y">
            {(trainingRecords[w.id] ?? []).map((t) => (
              <li key={t.name} className="flex justify-between px-5 py-3">
                <span>{t.name}</span>
                <span className="text-sm text-muted-foreground">{t.date}</span>
              </li>
            ))}
            {!trainingRecords[w.id] && <li className="px-5 py-3 text-muted-foreground">No training records.</li>}
          </ul>
        </Panel>
      </div>

      <Panel title="Recent Gate Activity">
        <GateActivityTable
          entries={gate.filter((g) => g.personId === w.id || g.person === w.name)}
          showFilters={false}
        />
      </Panel>
    </div>
  );
}
