import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Camera, Video, FileSignature, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, selectCls } from "@/components/sg/ui";
import { incidentTypes, type Incident } from "@/data/mock";
import { pageHead } from "@/lib/meta";
import { useStore } from "@/lib/store";
import { getSessionUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/incidents/new")({
  head: pageHead("Report Incident", "Report an incident or near miss."),
  component: ReportIncident,
});

function ReportIncident() {
  const { addIncident } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({
    type: "Near Miss",
    zone: "",
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    severity: "Medium" as Incident["severity"],
    description: "",
    peopleInvolved: "",
    reportedBy: "David Wilson",
  });
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [err, setErr] = useState("");

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  function toggleEvidence(type: string) {
    setSelectedEvidence((prev) =>
      prev.includes(type) ? prev.filter((x) => x !== type) : [...prev, type],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.zone.trim() || !f.date || !f.time || !f.description.trim()) {
      return setErr("Please complete all required fields (Site Zone, Date, Time, and Description).");
    }
    const dateFormatted = new Date(f.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    addIncident({
      type: f.type,
      zone: f.zone.trim(),
      date: dateFormatted,
      time: f.time,
      severity: f.severity,
      description: f.description.trim(),
      peopleInvolved: f.peopleInvolved.trim() || "-",
      reportedBy: "David Wilson",
      evidence: selectedEvidence,
    });
    navigate({ to: "/incidents" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        to="/incidents"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Incidents
      </Link>
      <PageHeader title="Report Incident" subtitle="Log a new incident or near miss on site" />
      <Panel>
        <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="t">Incident Type</Label>
            <select id="t" className={selectCls} value={f.type} onChange={set("type")}>
              {incidentTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="z">Site Zone</Label>
            <Input
              id="z"
              className="h-11"
              value={f.zone}
              onChange={set("zone")}
              placeholder="e.g. Loading Bay"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d">Date</Label>
            <Input id="d" type="date" className="h-11" value={f.date} onChange={set("date")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tm">Time</Label>
            <Input id="tm" type="time" className="h-11" value={f.time} onChange={set("time")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s">Severity</Label>
            <select id="s" className={selectCls} value={f.severity} onChange={set("severity")}>
              {["Low", "Medium", "High"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r">Reported By</Label>
            <Input
              id="r"
              className="h-11 bg-muted/60 font-medium text-foreground cursor-not-allowed"
              value="David Wilson"
              readOnly
              disabled
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              rows={4}
              value={f.description}
              onChange={set("description")}
              placeholder="Provide a clear description of the event, immediate actions taken, and conditions..."
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p">People Involved</Label>
            <Input
              id="p"
              className="h-11"
              value={f.peopleInvolved}
              onChange={set("peopleInvolved")}
              placeholder="Names or contractor trades involved (or '-' if none)"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Evidence</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { icon: Camera, label: "Add Photo", key: "Photo" },
                { icon: Video, label: "Add Video", key: "Video" },
                { icon: FileSignature, label: "Add Witness Statement", key: "Witness Statement" },
                { icon: Mic, label: "Add Voice Note", key: "Voice Note" },
              ].map(({ icon: Icon, label, key }) => {
                const isSelected = selectedEvidence.includes(key);
                return (
                  <Button
                    key={key}
                    type="button"
                    variant={isSelected ? "secondary" : "outline"}
                    className={
                      isSelected
                        ? "h-auto flex-col gap-1.5 border-primary/40 bg-primary/10 py-3 text-xs font-semibold text-primary"
                        : "h-auto flex-col gap-1.5 py-3 text-xs text-muted-foreground hover:text-foreground"
                    }
                    onClick={() => toggleEvidence(key)}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Button>
                );
              })}
            </div>
            {selectedEvidence.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                Selected evidence placeholders: <strong className="text-foreground">{selectedEvidence.join(", ")}</strong> (prototype UI placeholder)
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Click evidence controls to attach mock placeholders (no files uploaded).</p>
            )}
          </div>
          {err && <p className="text-sm font-medium text-danger sm:col-span-2">{err}</p>}
          <Button type="submit" size="lg" className="h-12 sm:col-span-2 text-base font-semibold">
            Submit Incident Report
          </Button>
        </form>
      </Panel>
    </div>
  );
}
