import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, QrCode, CheckCircle2, XCircle, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Panel, StatusBadge } from "@/components/sg/ui";
import { GateActivityTable } from "@/components/sg/GateActivityTable";
import { evaluateAccess, sites, workers, type AccessResult } from "@/data/mock";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/gatehouse")({
  head: pageHead(),
  component: Gatehouse,
});

function pageHead() {
  return () => ({
    meta: [
      { title: "Gatehouse — SiteGuard OS" },
      { name: "description", content: "Check workers, contractors and visitors at the site gate." },
      { property: "og:title", content: "Gatehouse — SiteGuard OS" },
      { property: "og:description", content: "Check workers, contractors and visitors at the site gate." },
    ],
  });
}

function Gatehouse() {
  const { gate, addGate, visitors, accessDecisions } = useStore();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [scanNote, setScanNote] = useState(false);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return [
      ...workers
        .filter((w) => w.name.toLowerCase().includes(t) || w.employer.toLowerCase().includes(t))
        .map((w) => ({ id: w.id, name: w.name, sub: `${w.role} · ${w.employer}`, kind: "Worker" })),
      ...visitors
        .filter((v) => v.name.toLowerCase().includes(t))
        .map((v) => ({ id: v.id, name: v.name, sub: `Visitor · ${v.company}`, kind: "Visitor" })),
    ];
  }, [q, visitors]);

  const worker = workers.find((w) => w.id === selectedId);
  const visitor = visitors.find((v) => v.id === selectedId);
  const evalr = worker ? evaluateAccess(worker.id) : null;
  const needsEscalation = !!evalr && evalr.failed.length > 0;

  const currentStatus =
    decision ||
    (worker
      ? accessDecisions[worker.id] ?? (worker.siteStatus === "Pending" ? "Escalated" : worker.siteStatus)
      : null);

  function record(action: "Escalate" | "Denied" | "Override") {
    if (!worker) return;
    const isJames = worker.id === "WORKER001";
    let reason = "All Compliance Valid";
    let gateResult: AccessResult = "Allowed";
    let displayStatus = "";

    if (action === "Escalate") {
      gateResult = "Escalated";
      reason = isJames ? "Expired Crane Competency" : `Expired ${evalr?.failed.map((f) => f.label).join(", ")}`;
      displayStatus = "Escalated";
    } else if (action === "Denied") {
      gateResult = "Denied";
      reason = isJames ? "Expired Crane Competency" : `Expired ${evalr?.failed.map((f) => f.label).join(", ")}`;
      displayStatus = "Denied";
    } else if (action === "Override") {
      gateResult = "Allowed";
      reason = isJames ? "Override: Expired Crane Competency" : "Override Access Granted";
      displayStatus = "Allowed / Override";
    }

    addGate({
      person: worker.name,
      personId: worker.id,
      type: "Worker",
      result: gateResult,
      reason,
    });
    setDecision(displayStatus);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) {
      setSelectedId(results[0].id);
      setQ(results[0].name);
      setDecision(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Gatehouse" subtitle="Check every person at the gate before entry." />

      <Panel>
        <div className="p-4 sm:p-5">
          <form onSubmit={handleSearchSubmit}>
            <label className="text-sm font-semibold">Search Worker / Contractor / Visitor</label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setScanNote(false);
                  }}
                  placeholder="Type a name, e.g. James Carter"
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Button type="button" variant="outline" size="lg" className="h-12" onClick={() => setScanNote(true)}>
                <QrCode className="size-5" /> Scan QR
              </Button>
            </div>
          </form>

          {scanNote && (
            <p className="mt-2 text-sm text-muted-foreground">QR scanning is a preview only. Search by name for this demo.</p>
          )}

          {results.length > 0 && (
            <ul className="mt-3 divide-y rounded-md border bg-card shadow-sm">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(r.id);
                      setDecision(null);
                      setQ(r.name);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent/60"
                  >
                    <span>
                      <span className="font-semibold text-foreground">{r.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{r.sub}</span>
                    </span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{r.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!selectedId && !q && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Quick select:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedId("WORKER001");
                  setQ("James Carter");
                  setDecision(null);
                }}
                className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                James Carter (Crane Operator)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedId("WORKER002");
                  setQ("Sarah Green");
                  setDecision(null);
                }}
                className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                Sarah Green (Site Engineer)
              </button>
            </div>
          )}
        </div>
      </Panel>

      {worker && evalr && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <Panel title="Person Access Check">
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{worker.name}</h2>
                  <p className="font-medium text-foreground/90">{worker.role}</p>
                  <p className="text-sm text-muted-foreground">{worker.employer}</p>
                  <p className="text-sm text-muted-foreground">{sites.find((s) => s.id === worker.siteId)?.name ?? "Riverside Development"}</p>
                </div>
                {currentStatus && <StatusBadge value={currentStatus} />}
              </div>

              <Link
                to="/people/$id"
                params={{ id: worker.id }}
                className="inline-block text-xs font-semibold text-primary underline underline-offset-4 hover:opacity-80"
              >
                Open worker details
              </Link>

              <div className="pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compliance Checks</h3>
                <ul className="mt-2 divide-y rounded-md border bg-card">
                  {evalr.checks.map((c) => (
                    <li key={c.label} className="flex items-center justify-between px-4 py-3">
                      <span className="flex items-center gap-2.5 text-sm font-medium">
                        {c.pass ? <CheckCircle2 className="size-5 text-success" /> : <XCircle className="size-5 text-danger" />}
                        {c.label}
                      </span>
                      <StatusBadge value={c.pass ? "PASS" : "FAIL"} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

          <div className="space-y-4">
            <div
              className={cn(
                "rounded-lg border-2 p-5",
                needsEscalation ? "border-warning bg-warning-soft" : "border-success bg-success-soft",
              )}
            >
              <div className="flex items-start gap-3">
                {needsEscalation ? (
                  <ShieldAlert className="mt-0.5 size-8 shrink-0 text-warning" />
                ) : (
                  <ShieldCheck className="mt-0.5 size-8 shrink-0 text-success" />
                )}
                <div>
                  <p
                    className={cn(
                      "font-display text-xl font-extrabold tracking-tight sm:text-2xl",
                      needsEscalation ? "text-warning" : "text-success",
                    )}
                  >
                    {needsEscalation ? "ACCESS REQUIRES ESCALATION" : "ACCESS ALLOWED"}
                  </p>
                  <p className="mt-1.5 text-sm font-medium">
                    Reason:{" "}
                    {needsEscalation
                      ? worker.id === "WORKER001"
                        ? "Crane Operator Competency Expired"
                        : evalr.failed.map((f) => `${f.doc?.name || f.label} Expired`).join(", ")
                      : "All compliance checks passed"}
                  </p>
                </div>
              </div>
            </div>

            {needsEscalation && (
              <Panel title="Recommended Action">
                <ol className="space-y-2.5 p-5">
                  {[
                    "Hold access",
                    "Contact Site Manager",
                    "Request valid competency evidence",
                    "Record the final decision",
                  ].map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sidebar font-mono text-xs font-bold text-sidebar-foreground">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </Panel>
            )}

            <div className="space-y-3 rounded-lg border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Access Actions</p>

              {needsEscalation ? (
                <div className="grid gap-2.5 sm:grid-cols-3">
                  <Button
                    size="lg"
                    className="h-12 bg-amber-500 font-semibold text-white shadow-sm hover:bg-amber-600"
                    onClick={() => record("Escalate")}
                  >
                    <ShieldAlert className="size-4" />
                    Escalate
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="h-12 font-semibold shadow-sm"
                    onClick={() => record("Denied")}
                  >
                    <ShieldX className="size-4" />
                    Deny Entry
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 border-input font-semibold shadow-sm hover:bg-accent"
                    onClick={() => record("Override")}
                  >
                    Override Access
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="h-12 w-full text-base font-semibold"
                  onClick={() => {
                    addGate({
                      person: worker.name,
                      personId: worker.id,
                      type: "Worker",
                      result: "Allowed",
                      reason: "All Compliance Valid",
                    });
                    setDecision("Allowed");
                  }}
                >
                  <ShieldCheck className="size-5" /> Allow Entry
                </Button>
              )}

              {decision && (
                <div className="flex items-center justify-between rounded-md bg-muted/60 px-3.5 py-2.5 text-xs text-muted-foreground">
                  <span>
                    Decision recorded: <strong className="text-foreground">{decision}</strong> — Gate Activity updated.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setDecision(null);
                      setQ("");
                    }}
                    className="font-semibold text-foreground underline underline-offset-2 hover:opacity-80"
                  >
                    Next person
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {visitor && (
        <Panel title="Visitor Check">
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="text-xl font-bold">{visitor.name}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {visitor.company} · Host: {visitor.host} · Purpose: {visitor.purpose}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Check-in: {visitor.checkIn} · Check-out: {visitor.checkOut}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge value={visitor.status} />
              {visitor.status === "On Site" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addGate({
                      person: visitor.name,
                      type: "Visitor",
                      result: "Allowed",
                      reason: "Visitor Pass Confirmed",
                    });
                    setDecision("Allowed");
                  }}
                >
                  Confirm Entry
                </Button>
              )}
            </div>
          </div>
        </Panel>
      )}

      <Panel title="Gate Activity">
        <GateActivityTable entries={gate} />
      </Panel>
    </div>
  );
}
