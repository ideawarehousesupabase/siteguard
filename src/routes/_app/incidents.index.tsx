import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, PageHeader, Panel, StatusBadge, rowLink, td } from "@/components/sg/ui";
import { pageHead } from "@/lib/meta";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/incidents/")({
  head: pageHead("Incidents", "Incidents and near misses on site."),
  component: Incidents,
});

function Incidents() {
  const { incidents } = useStore();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Incidents & Near Misses" subtitle="Reported events at Riverside Development"
        action={<Button size="lg" asChild><Link to="/incidents/new"><Plus className="size-5" />Report Incident</Link></Button>} />
      <Panel>
        <DataTable head={["Incident ID", "Type", "Site Zone", "Date", "Severity", "Status"]}>
          {incidents.map((i) => (
            <tr key={i.id} className={rowLink} onClick={() => navigate({ to: "/incidents/$id", params: { id: i.id } })}>
              <td className={`${td} font-mono font-semibold`}>{i.id}</td>
              <td className={td}>{i.type}</td>
              <td className={td}>{i.zone}</td>
              <td className={td}>{i.date}</td>
              <td className={td}><StatusBadge value={i.severity} /></td>
              <td className={td}><StatusBadge value={i.status} /></td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}
