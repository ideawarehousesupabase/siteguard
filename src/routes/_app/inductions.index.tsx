import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, PageHeader, Panel, StatusBadge, rowLink, td } from "@/components/sg/ui";
import { pageHead } from "@/lib/meta";
import { useStore } from "@/lib/store";
import type { Briefing } from "@/data/mock";

export const Route = createFileRoute("/_app/inductions/")({
  head: pageHead("Inductions & Toolbox Talks", "Site inductions and toolbox talk completion."),
  component: Inductions,
});

function Inductions() {
  const { briefings } = useStore();
  const navigate = useNavigate();
  const table = (rows: Briefing[]) => (
    <Panel>
      <DataTable head={["Title", "Type", "Assigned", "Completed", "Status"]}>
        {rows.map((b) => (
          <tr key={b.id} className={rowLink} onClick={() => navigate({ to: "/inductions/$id", params: { id: b.id } })}>
            <td className={`${td} font-semibold`}>{b.title}</td>
            <td className={td}>{b.type}</td>
            <td className={td}>{b.assigned} Assigned</td>
            <td className={td}>{b.completed} Completed</td>
            <td className={td}><StatusBadge value={b.status} /></td>
          </tr>
        ))}
      </DataTable>
    </Panel>
  );
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Inductions & Toolbox Talks" />
      <Tabs defaultValue="ind">
        <TabsList className="mb-4 h-11">
          <TabsTrigger value="ind" className="px-4">Inductions</TabsTrigger>
          <TabsTrigger value="tbt" className="px-4">Toolbox Talks</TabsTrigger>
        </TabsList>
        <TabsContent value="ind">{table(briefings.filter((b) => b.type === "Induction"))}</TabsContent>
        <TabsContent value="tbt">{table(briefings.filter((b) => b.type === "Toolbox Talk"))}</TabsContent>
      </Tabs>
    </div>
  );
}
