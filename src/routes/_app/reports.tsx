import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataTable, PageHeader, Panel, StatusBadge, selectCls, td } from "@/components/sg/ui";
import { complianceDocs, monthlyReport as m, reportTypes, sites } from "@/data/mock";
import { pageHead } from "@/lib/meta";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/reports")({
  head: pageHead("Reports", "Client reports for attendance, incidents and compliance."),
  component: Reports,
});

function Reports() {
  const { gate, visitors, incidents, briefings } = useStore();
  const [site, setSite] = useState("SITE001");
  const [range, setRange] = useState("September 2026");
  const [type, setType] = useState<string>(reportTypes[0]!);
  const [generated, setGenerated] = useState<null | { site: string; range: string; type: string }>(null);
  const [note, setNote] = useState("");

  const reportData = generated ? getReportData(generated.type) : null;

  function getReportData(reportType: string) {
    switch (reportType) {
      case "Attendance Report":
        return {
          metrics: [
            ["Total Entries", (1284).toLocaleString("en-GB")],
            ["People On Site", "48"],
            ["Check-Ins", "1,192"],
            ["Check-Outs", "1,144"],
          ],
          title: "Attendance & Gate Activity",
          content: (
            <DataTable head={["Person", "Type", "Time", "Status", "Reason"]}>
              {gate.map((g) => (
                <tr key={g.id}>
                  <td className={`${td} font-semibold`}>{g.person}</td>
                  <td className={td}>{g.type}</td>
                  <td className={`${td} font-mono`}>{g.time}</td>
                  <td className={td}>
                    <StatusBadge value={g.result} />
                  </td>
                  <td className={td}>{g.reason}</td>
                </tr>
              ))}
            </DataTable>
          ),
        };

      case "Visitor Report":
        return {
          metrics: [
            ["Total Visitors", "73"],
            ["Currently On Site", String(visitors.filter((v) => v.status === "On Site").length || 2)],
            ["Checked Out", "71"],
          ],
          title: "Visitor Register",
          content: (
            <DataTable head={["Name", "Company", "Host", "Purpose", "Check-In", "Check-Out", "Status"]}>
              {visitors.map((v) => (
                <tr key={v.id}>
                  <td className={`${td} font-semibold`}>{v.name}</td>
                  <td className={td}>{v.company}</td>
                  <td className={td}>{v.host}</td>
                  <td className={td}>{v.purpose}</td>
                  <td className={`${td} font-mono`}>{v.checkIn}</td>
                  <td className={`${td} font-mono`}>{v.checkOut}</td>
                  <td className={td}>
                    <StatusBadge value={v.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
          ),
        };

      case "Incident Summary":
        return {
          metrics: [
            ["Total Incidents", "4"],
            ["Near Misses", "6"],
            ["Open", String(incidents.filter((i) => i.status === "Open").length || 2)],
            ["Closed", String(incidents.filter((i) => i.status === "Closed").length || 2)],
          ],
          title: "Incident & Near Miss Records",
          content: (
            <DataTable head={["Incident ID", "Type", "Site Zone", "Date", "Severity", "Status"]}>
              {incidents.map((i) => (
                <tr key={i.id}>
                  <td className={`${td} font-mono font-semibold`}>{i.id}</td>
                  <td className={td}>{i.type}</td>
                  <td className={td}>{i.zone}</td>
                  <td className={td}>{i.date}</td>
                  <td className={td}>
                    <StatusBadge value={i.severity} />
                  </td>
                  <td className={td}>
                    <StatusBadge value={i.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
          ),
        };

      case "Compliance Status": {
        const validCount = complianceDocs.filter((d) => d.status === "Valid").length;
        const expiringCount = complianceDocs.filter((d) => d.status === "Expiring Soon").length;
        const expiredCount = complianceDocs.filter((d) => d.status === "Expired").length;
        return {
          metrics: [
            ["Compliance %", "91%"],
            ["Valid Documents", String(validCount)],
            ["Expiring Soon", String(expiringCount)],
            ["Expired", String(expiredCount)],
          ],
          title: "Compliance Documents Status",
          content: (
            <DataTable head={["Document", "Assigned To", "Category", "Expiry Date", "Status"]}>
              {complianceDocs.map((d) => (
                <tr key={d.id}>
                  <td className={`${td} font-semibold`}>{d.name}</td>
                  <td className={td}>{d.assignedTo}</td>
                  <td className={td}>{d.category}</td>
                  <td className={td}>{d.expiryDate}</td>
                  <td className={td}>
                    <StatusBadge value={d.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
          ),
        };
      }

      case "Document Expiry Report": {
        const affectedDocs = complianceDocs.filter(
          (d) => d.status === "Expired" || d.status === "Expiring Soon",
        );
        return {
          metrics: [
            ["Expired Documents", String(complianceDocs.filter((d) => d.status === "Expired").length)],
            ["Expiring Soon", String(complianceDocs.filter((d) => d.status === "Expiring Soon").length)],
          ],
          title: "List of Affected Documents",
          content: (
            <DataTable head={["Document", "Assigned To", "Category", "Expiry Date", "Status"]}>
              {affectedDocs.map((d) => (
                <tr key={d.id}>
                  <td className={`${td} font-semibold`}>{d.name}</td>
                  <td className={td}>{d.assignedTo}</td>
                  <td className={td}>{d.category}</td>
                  <td className={td}>{d.expiryDate}</td>
                  <td className={td}>
                    <StatusBadge value={d.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
          ),
        };
      }

      case "Induction Completion Report":
        return {
          metrics: [
            ["Assigned", "106"],
            ["Completed", "101"],
            ["Pending", "5"],
            ["Completion %", "95%"],
          ],
          title: "Induction & Toolbox Talks Summary",
          content: (
            <DataTable head={["Title", "Type", "Version", "Assigned", "Completed", "Status"]}>
              {briefings.map((b) => (
                <tr key={b.id}>
                  <td className={`${td} font-semibold`}>{b.title}</td>
                  <td className={td}>{b.type}</td>
                  <td className={`${td} font-mono text-xs`}>{b.version}</td>
                  <td className={td}>{b.assigned}</td>
                  <td className={td}>{b.completed}</td>
                  <td className={td}>
                    <StatusBadge value={b.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
          ),
        };

      default:
        return {
          metrics: [],
          title: "Report Summary",
          content: null,
        };
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader title="Reports" subtitle="Generate client-ready site reports" />
      <Panel>
        <div className="grid gap-4 p-5 sm:grid-cols-4 sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="rs">Site</Label>
            <select id="rs" className={selectCls} value={site} onChange={(e) => setSite(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rr">Date Range</Label>
            <select id="rr" className={selectCls} value={range} onChange={(e) => setRange(e.target.value)}>
              {["September 2026", "August 2026", "July 2026"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rt">Report Type</Label>
            <select id="rt" className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
              {reportTypes.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <Button
            size="lg"
            className="h-11"
            onClick={() => setGenerated({ site: sites.find((s) => s.id === site)!.name, range, type })}
          >
            <FileBarChart className="size-5" />
            Generate Report
          </Button>
        </div>
      </Panel>

      {generated && reportData && (
        <Panel>
          <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{generated.type}</p>
              <h2 className="mt-1 text-2xl font-bold">{generated.site}</h2>
              <p className="text-muted-foreground">{generated.range}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setNote("PDF export is a preview only.")}>
                <Download className="size-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => setNote("CSV export is a preview only.")}>
                <Download className="size-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {note && <p className="border-b px-5 py-2 text-sm text-muted-foreground">{note}</p>}

          <div
            className={cn(
              "grid gap-4 p-5",
              reportData.metrics.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : reportData.metrics.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-4",
            )}
          >
            {reportData.metrics.map(([l, v]) => (
              <div key={l} className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l}</p>
                <p className="mt-1.5 font-display text-2xl font-bold">{v}</p>
              </div>
            ))}
          </div>

          <div className="border-t">
            <h3 className="px-5 pt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {reportData.title}
            </h3>
            {reportData.content}
          </div>
        </Panel>
      )}
    </div>
  );
}
