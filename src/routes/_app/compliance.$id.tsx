import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FileText, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, PageHeader, Panel, StatusBadge } from "@/components/sg/ui";
import { complianceDocs, sites } from "@/data/mock";

export const Route = createFileRoute("/_app/compliance/$id")({
  loader: ({ params }) => {
    const d = complianceDocs.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Document"} — SiteGuard OS` },
      { name: "description", content: "Compliance document record." },
      { property: "og:title", content: `${loaderData?.name ?? "Document"} — SiteGuard OS` },
      { property: "og:description", content: "Compliance document record." },
    ],
  }),
  notFoundComponent: () => <p className="p-8">Document not found. <Link to="/compliance" className="underline">Back</Link></p>,
  component: DocDetail,
});

function DocDetail() {
  const d = Route.useLoaderData();
  const [preview, setPreview] = useState(false);
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/compliance" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Compliance Vault</Link>
      <PageHeader title={d.name} subtitle={d.id} action={<Button variant="outline" size="lg" onClick={() => setPreview(true)}><FileText className="size-5" />View Document</Button>} />
      {d.status === "Expired" && (
        <div className="flex items-start gap-3 rounded-lg border-2 border-danger bg-danger-soft p-4 text-danger">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" />
          <div><p className="font-bold">This document has expired.</p><p className="text-sm">Site access depending on this record must be escalated until valid evidence is provided.</p></div>
        </div>
      )}
      {d.status === "Expiring Soon" && (
        <div className="rounded-lg border border-warning/40 bg-warning-soft p-4 font-medium text-warning">This document expires soon. Request renewal.</div>
      )}
      <Panel>
        <dl className="grid grid-cols-2 gap-5 p-5 md:grid-cols-3">
          <Field label="Document Name" value={d.name} />
          <Field label="Category" value={d.category} />
          <Field label="Assigned To" value={d.workerId ? <Link to="/people/$id" params={{ id: d.workerId }} className="underline underline-offset-4">{d.assignedTo}</Link> : d.assignedTo} />
          <Field label="Site" value={sites.find((s) => s.id === d.siteId)?.name} />
          <Field label="Issue Date" value={d.issueDate} />
          <Field label="Expiry Date" value={d.expiryDate} />
          <Field label="Status" value={<StatusBadge value={d.status} />} />
        </dl>
      </Panel>
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent>
          <DialogHeader><DialogTitle>{d.name}</DialogTitle></DialogHeader>
          <div className="grid aspect-[3/4] place-items-center rounded-md border-2 border-dashed bg-muted text-center text-muted-foreground">
            <div><FileText className="mx-auto size-10" /><p className="mt-2 text-sm">Document preview placeholder</p><p className="font-mono text-xs">{d.id}.pdf</p></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
