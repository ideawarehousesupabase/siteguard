import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, PageHeader, Panel, StatusBadge, selectCls, td } from "@/components/sg/ui";
import { sites } from "@/data/mock";
import { pageHead } from "@/lib/meta";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/visitors")({
  head: pageHead("Visitors", "Visitor register for the site gate."),
  component: Visitors,
});

const empty = { name: "", company: "", host: "", purpose: "", siteId: "SITE001" };

function Visitors() {
  const { visitors, addVisitor, addGate } = useStore();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name || !f.company || !f.host || !f.purpose) return setErr("All fields are required.");
    addVisitor(f);
    addGate({ person: f.name, type: "Visitor", result: "Allowed", reason: "Host Confirmed" });
    setF(empty); setErr(""); setOpen(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Visitor Register" subtitle="Everyone visiting site today"
        action={<Button size="lg" onClick={() => setOpen(true)}><UserPlus className="size-5" />Register Visitor</Button>} />
      <Panel>
        <DataTable head={["Name", "Company", "Host", "Purpose", "Check-In", "Check-Out", "Status"]}>
          {visitors.map((v) => (
            <tr key={v.id}>
              <td className={`${td} font-semibold`}>{v.name}</td>
              <td className={td}>{v.company}</td>
              <td className={td}>{v.host}</td>
              <td className={td}>{v.purpose}</td>
              <td className={`${td} font-mono`}>{v.checkIn}</td>
              <td className={`${td} font-mono`}>{v.checkOut}</td>
              <td className={td}><StatusBadge value={v.status} /></td>
            </tr>
          ))}
        </DataTable>
      </Panel>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Register Visitor</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {([["name", "Full Name"], ["company", "Company"], ["host", "Host"], ["purpose", "Purpose"]] as const).map(([k, l]) => (
              <div key={k} className="space-y-1.5"><Label htmlFor={k}>{l}</Label><Input id={k} className="h-11" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="site">Site</Label>
              <select id="site" className={selectCls} value={f.siteId} onChange={(e) => setF({ ...f, siteId: e.target.value })}>
                {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {err && <p className="text-sm font-medium text-danger">{err}</p>}
            <Button type="submit" size="lg" className="w-full">Check In Visitor</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
