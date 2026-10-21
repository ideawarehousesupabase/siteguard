import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, FilterTabs, PageHeader, Panel, StatusBadge, rowLink, selectCls, td } from "@/components/sg/ui";
import { complianceCategories, complianceDocs } from "@/data/mock";
import { pageHead } from "@/lib/meta";

export const Route = createFileRoute("/_app/compliance/")({
  head: pageHead("Compliance Vault", "Competency, insurance, RAMS and inspection records."),
  component: Vault,
});

const filters = ["All", "Valid", "Expiring Soon", "Expired"] as const;

function Vault() {
  const navigate = useNavigate();
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const [cat, setCat] = useState("All");
  const rows = complianceDocs.filter(
    (d) => d.name !== "Photo ID Verification" && (f === "All" || d.status === f) && (cat === "All" || d.category === cat),
  );
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Compliance Vault" subtitle="Every document required for site access" />
      <Panel>
        <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs options={[...filters]} value={f} onChange={setF} />
          <select className={`${selectCls} sm:w-64`} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option>All</option>
            {complianceCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <DataTable head={["Document", "Assigned To", "Category", "Issue Date", "Expiry Date", "Status"]}>
          {rows.map((d) => (
            <tr key={d.id} className={rowLink} onClick={() => navigate({ to: "/compliance/$id", params: { id: d.id } })}>
              <td className={`${td} font-semibold`}>{d.name}</td>
              <td className={td}>{d.assignedTo}</td>
              <td className={td}>{d.category}</td>
              <td className={td}>{d.issueDate}</td>
              <td className={td}>{d.expiryDate}</td>
              <td className={td}><StatusBadge value={d.status} /></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No documents match.</td></tr>}
        </DataTable>
      </Panel>
    </div>
  );
}
