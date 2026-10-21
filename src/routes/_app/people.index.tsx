import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable, PageHeader, Panel, StatusBadge, rowLink, td } from "@/components/sg/ui";
import { workers } from "@/data/mock";
import { pageHead } from "@/lib/meta";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/people/")({
  head: pageHead("People", "Workforce register and compliance status."),
  component: People,
});

function People() {
  const navigate = useNavigate();
  const { accessDecisions } = useStore();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="People" subtitle="Workforce assigned to Riverside Development" />
      <Panel>
        <DataTable head={["Name", "Employer", "Role", "Site Status", "Compliance"]}>
          {workers.map((w) => {
            const d = accessDecisions[w.id];
            const status = d === "Allowed" ? "On Site" : d === "Denied" ? "Off Site" : w.siteStatus;
            return (
              <tr key={w.id} className={rowLink} onClick={() => navigate({ to: "/people/$id", params: { id: w.id } })}>
                <td className={`${td} font-semibold`}>{w.name}</td>
                <td className={td}>{w.employer}</td>
                <td className={td}>{w.role}</td>
                <td className={td}><StatusBadge value={status} /></td>
                <td className={td}><StatusBadge value={w.compliance} /></td>
              </tr>
            );
          })}
        </DataTable>
      </Panel>
    </div>
  );
}
