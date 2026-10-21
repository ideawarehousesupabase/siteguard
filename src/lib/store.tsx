import { createContext, useContext, useState, type ReactNode } from "react";
import {
  initialBriefings, initialGateActivity, initialIncidents, initialVisitors,
  type Briefing, type GateEntry, type Incident, type Visitor,
} from "@/data/mock";

type Store = {
  gate: GateEntry[];
  addGate: (e: Omit<GateEntry, "id" | "time">) => void;
  visitors: Visitor[];
  addVisitor: (v: Omit<Visitor, "id" | "checkIn" | "checkOut" | "status">) => void;
  incidents: Incident[];
  addIncident: (i: Omit<Incident, "id" | "status" | "evidence"> & { evidence?: string[] }) => string;
  briefings: Briefing[];
  acknowledge: (id: string) => void;
  accessDecisions: Record<string, string>;
};

const Ctx = createContext<Store | null>(null);
const nowTime = () => new Date().toTimeString().slice(0, 5);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [gate, setGate] = useState(initialGateActivity);
  const [visitors, setVisitors] = useState(initialVisitors);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [briefings, setBriefings] = useState(initialBriefings);
  const [accessDecisions, setDecisions] = useState<Record<string, string>>({ WORKER001: "Escalated" });

  const value: Store = {
    gate,
    addGate: (e) => {
      setGate((g) => [{ ...e, id: `GA${Date.now()}`, time: nowTime() }, ...g]);
      if (e.personId) setDecisions((d) => ({ ...d, [e.personId!]: e.result }));
    },
    visitors,
    addVisitor: (v) =>
      setVisitors((vs) => [{ ...v, id: `VIS${Date.now()}`, checkIn: nowTime(), checkOut: "-", status: "On Site" }, ...vs]),
    incidents,
    addIncident: (i) => {
      const id = `INC${String(incidents.length + 1).padStart(3, "0")}`;
      setIncidents((is) => [{ ...i, id, status: "Open", evidence: i.evidence ?? [] }, ...is]);
      return id;
    },
    briefings,
    acknowledge: (id) =>
      setBriefings((bs) =>
        bs.map((b) => {
          if (b.id !== id || b.completed >= b.assigned) return b;
          const completed = b.completed + 1;
          return { ...b, completed, status: completed >= b.assigned ? "Completed" : b.status };
        }),
      ),
    accessDecisions,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}
