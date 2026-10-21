import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Field, PageHeader, Panel, StatusBadge } from "@/components/sg/ui";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/inductions/$id")({
  head: () => ({
    meta: [
      { title: "Briefing — SiteGuard OS" },
      { name: "description", content: "Induction or toolbox talk acknowledgement status." },
      { property: "og:title", content: "Briefing — SiteGuard OS" },
      { property: "og:description", content: "Induction or toolbox talk acknowledgement status." },
    ],
  }),
  component: BriefingDetail,
});

function BriefingDetail() {
  const { id } = Route.useParams();
  const { briefings, acknowledge } = useStore();
  const b = briefings.find((x) => x.id === id);
  if (!b) return <p className="p-8">Not found. <Link to="/inductions" className="underline">Back</Link></p>;
  const pending = b.assigned - b.completed;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/inductions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Inductions & Toolbox Talks</Link>
      <PageHeader title={b.title} subtitle={b.type} action={<StatusBadge value={b.status} />} />
      <Panel>
        <dl className="grid grid-cols-2 gap-5 p-5 md:grid-cols-4">
          <Field label="Title" value={b.title} />
          <Field label="Type" value={b.type} />
          <Field label="Version" value={<span className="font-mono">{b.version}</span>} />
          <Field label="Status" value={<StatusBadge value={b.status} />} />
          <Field label="Assigned" value={b.assigned} />
          <Field label="Acknowledged" value={b.completed} />
          <Field label="Pending" value={pending} />
        </dl>
        <div className="border-t p-5">
          <Progress value={(b.completed / b.assigned) * 100} />
          <p className="mt-2 text-sm text-muted-foreground">{Math.round((b.completed / b.assigned) * 100)}% acknowledged</p>
        </div>
      </Panel>
      <Button size="lg" className="h-12" disabled={pending === 0} onClick={() => acknowledge(b.id)}>
        <CheckCheck className="size-5" />{pending === 0 ? "All Acknowledged" : "Mark as Acknowledged"}
      </Button>
    </div>
  );
}
