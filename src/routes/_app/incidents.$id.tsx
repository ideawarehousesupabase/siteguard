import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, FileSignature, FileText } from "lucide-react";
import { Field, PageHeader, Panel, StatusBadge } from "@/components/sg/ui";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/incidents/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — SiteGuard OS` },
      { name: "description", content: "Incident record and evidence." },
      { property: "og:title", content: `${params.id} — SiteGuard OS` },
      { property: "og:description", content: "Incident record and evidence." },
    ],
  }),
  component: IncidentDetail,
});

function IncidentDetail() {
  const { id } = Route.useParams();
  const i = useStore().incidents.find((x) => x.id === id);
  if (!i) return <p className="p-8">Incident not found. <Link to="/incidents" className="underline">Back</Link></p>;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/incidents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Incidents</Link>
      <PageHeader title={`${i.id} · ${i.type}`} subtitle={i.zone} action={<StatusBadge value={i.status} />} />
      <Panel>
        <dl className="grid grid-cols-2 gap-5 p-5 md:grid-cols-4">
          <Field label="Incident ID" value={<span className="font-mono">{i.id}</span>} />
          <Field label="Type" value={i.type} />
          <Field label="Location" value={i.zone} />
          <Field label="Date" value={`${i.date} · ${i.time}`} />
          <Field label="Reported By" value={i.reportedBy} />
          <Field label="Severity" value={<StatusBadge value={i.severity} />} />
          <Field label="Status" value={<StatusBadge value={i.status} />} />
          <Field label="People Involved" value={i.peopleInvolved} />
        </dl>
      </Panel>
      <Panel title="Description"><p className="p-5 leading-relaxed">{i.description}</p></Panel>
      <Panel title="Evidence">
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          {i.evidence.map((e) => {
            const Icon = e === "Photo" ? Camera : e === "Witness Statement" ? FileSignature : FileText;
            return (
              <div key={e} className="grid aspect-[4/3] place-items-center rounded-md border-2 border-dashed bg-muted text-center text-muted-foreground">
                <div><Icon className="mx-auto size-7" /><p className="mt-1.5 text-sm font-medium">{e}</p></div>
              </div>
            );
          })}
          {i.evidence.length === 0 && <p className="text-muted-foreground">No evidence attached.</p>}
        </div>
      </Panel>
    </div>
  );
}
