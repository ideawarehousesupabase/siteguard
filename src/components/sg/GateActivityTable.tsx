import { useState } from "react";
import { DataTable, FilterTabs, StatusBadge, td } from "./ui";
import type { GateEntry } from "@/data/mock";

const filters = ["All", "Allowed", "Denied", "Escalated"] as const;

export function GateActivityTable({ entries, showFilters = true }: { entries: GateEntry[]; showFilters?: boolean }) {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const rows = f === "All" ? entries : entries.filter((e) => e.result === f);
  return (
    <>
      {showFilters && <div className="border-b p-3"><FilterTabs options={[...filters]} value={f} onChange={setF} /></div>}
      <DataTable head={["Person", "Type", "Time", "Access Result", "Reason"]}>
        {rows.map((e) => (
          <tr key={e.id}>
            <td className={`${td} font-semibold`}>{e.person}</td>
            <td className={td}>{e.type}</td>
            <td className={`${td} font-mono`}>{e.time}</td>
            <td className={td}><StatusBadge value={e.result} /></td>
            <td className={`${td} text-muted-foreground`}>{e.reason}</td>
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No entries.</td></tr>}
      </DataTable>
    </>
  );
}
