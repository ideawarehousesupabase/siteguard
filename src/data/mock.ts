// All SiteGuard operational data is frontend mock data.
export type DocStatus = "Valid" | "Expiring Soon" | "Expired";
export type AccessResult = "Allowed" | "Denied" | "Escalated";

export const sites = [
  { id: "SITE001", name: "Riverside Development" },
  { id: "SITE002", name: "Kingsway Commercial Project" },
  { id: "SITE003", name: "Westfield Residential Site" },
];
export const MAIN_SITE = sites[0]!;

export type Worker = {
  id: string;
  name: string;
  employer: string;
  role: string;
  siteId: string;
  siteStatus: "On Site" | "Off Site" | "Pending";
  compliance: "Valid" | "Warning";
};

export const workers: Worker[] = [
  { id: "WORKER001", name: "James Carter", employer: "BuildCore Ltd", role: "Crane Operator", siteId: "SITE001", siteStatus: "Pending", compliance: "Warning" },
  { id: "WORKER002", name: "Sarah Green", employer: "Apex Civil Ltd", role: "Site Engineer", siteId: "SITE001", siteStatus: "On Site", compliance: "Valid" },
  { id: "WORKER003", name: "Michael Brown", employer: "BuildCore Ltd", role: "Electrician", siteId: "SITE001", siteStatus: "Off Site", compliance: "Valid" },
  { id: "WORKER004", name: "Priya Patel", employer: "Northline Scaffolding", role: "Scaffolder", siteId: "SITE001", siteStatus: "On Site", compliance: "Valid" },
  { id: "WORKER005", name: "Tom Hughes", employer: "Apex Civil Ltd", role: "Groundworker", siteId: "SITE001", siteStatus: "On Site", compliance: "Valid" },
];

export type ComplianceDoc = {
  id: string;
  name: string;
  assignedTo: string;
  workerId?: string;
  category: string;
  siteId: string;
  issueDate: string;
  expiryDate: string;
  status: DocStatus;
  checkLabel?: string;
};

export const complianceCategories = [
  "Competency Cards", "Training Records", "Insurance", "RAMS", "COSHH",
  "Plant Inspection Certificates", "Operator Licences", "Induction Records",
];

export const complianceDocs: ComplianceDoc[] = [
  { id: "DOC001", name: "Crane Operator Competency", assignedTo: "James Carter", workerId: "WORKER001", category: "Competency Cards", siteId: "SITE001", issueDate: "01 Oct 2025", expiryDate: "28 Sep 2026", status: "Expired", checkLabel: "Crane Operator Competency" },
  { id: "DOC002", name: "Site Induction", assignedTo: "James Carter", workerId: "WORKER001", category: "Induction Records", siteId: "SITE001", issueDate: "10 Jan 2026", expiryDate: "10 Jan 2027", status: "Valid", checkLabel: "Site Induction" },
  { id: "DOC003", name: "Insurance Certificate", assignedTo: "BuildCore Ltd", workerId: "WORKER001", category: "Insurance", siteId: "SITE001", issueDate: "16 Mar 2026", expiryDate: "16 Mar 2027", status: "Valid", checkLabel: "Insurance" },
  { id: "DOC005", name: "Plant Inspection Certificate", assignedTo: "Crane CR-204", category: "Plant Inspection Certificates", siteId: "SITE001", issueDate: "08 Apr 2026", expiryDate: "08 Oct 2026", status: "Expiring Soon" },
  { id: "DOC006", name: "Site Induction", assignedTo: "Sarah Green", workerId: "WORKER002", category: "Induction Records", siteId: "SITE001", issueDate: "12 Feb 2026", expiryDate: "12 Feb 2027", status: "Valid", checkLabel: "Site Induction" },
  { id: "DOC007", name: "CSCS Card", assignedTo: "Sarah Green", workerId: "WORKER002", category: "Competency Cards", siteId: "SITE001", issueDate: "20 Jun 2024", expiryDate: "20 Jun 2029", status: "Valid", checkLabel: "CSCS Card" },
  { id: "DOC008", name: "ECS Electrician Card", assignedTo: "Michael Brown", workerId: "WORKER003", category: "Operator Licences", siteId: "SITE001", issueDate: "02 May 2024", expiryDate: "02 May 2027", status: "Valid", checkLabel: "ECS Card" },
  { id: "DOC009", name: "Site Induction", assignedTo: "Michael Brown", workerId: "WORKER003", category: "Induction Records", siteId: "SITE001", issueDate: "15 Jan 2026", expiryDate: "15 Jan 2027", status: "Valid", checkLabel: "Site Induction" },
  { id: "DOC010", name: "Scaffolding RAMS", assignedTo: "Northline Scaffolding", category: "RAMS", siteId: "SITE001", issueDate: "01 Sep 2026", expiryDate: "30 Oct 2026", status: "Expiring Soon" },
  { id: "DOC011", name: "Concrete Additives COSHH", assignedTo: "Apex Civil Ltd", category: "COSHH", siteId: "SITE001", issueDate: "14 Mar 2026", expiryDate: "14 Mar 2027", status: "Valid" },
  { id: "DOC012", name: "Telehandler Operator Licence", assignedTo: "Tom Hughes", workerId: "WORKER005", category: "Operator Licences", siteId: "SITE001", issueDate: "11 Sep 2023", expiryDate: "11 Sep 2026", status: "Expired", checkLabel: "Telehandler Licence" },
];

export const docsForWorker = (id: string) => complianceDocs.filter((d) => d.workerId === id);

export const trainingRecords: Record<string, { name: string; date: string }[]> = {
  WORKER001: [
    { name: "Lifting Operations Awareness", date: "14 Feb 2026" },
    { name: "Working at Height", date: "22 Sep 2026" },
  ],
  WORKER002: [{ name: "Vehicle Movement Safety", date: "18 Sep 2026" }],
  WORKER003: [{ name: "Electrical Isolation", date: "03 Mar 2026" }],
};

export type GateEntry = {
  id: string;
  person: string;
  personId?: string;
  type: "Worker" | "Visitor" | "Contractor";
  time: string;
  result: AccessResult;
  reason: string;
};

export const initialGateActivity: GateEntry[] = [
  { id: "GA001", person: "James Carter", personId: "WORKER001", type: "Worker", time: "08:45", result: "Escalated", reason: "Expired Crane Competency" },
  { id: "GA002", person: "Sarah Green", personId: "WORKER002", type: "Worker", time: "08:32", result: "Allowed", reason: "All Compliance Valid" },
  { id: "GA003", person: "Rachel Smith", type: "Visitor", time: "08:10", result: "Allowed", reason: "Host Confirmed" },
  { id: "GA004", person: "Tom Hughes", personId: "WORKER005", type: "Worker", time: "07:52", result: "Denied", reason: "Expired Telehandler Licence" },
  { id: "GA005", person: "Priya Patel", personId: "WORKER004", type: "Worker", time: "07:40", result: "Allowed", reason: "All Compliance Valid" },
];

export type Visitor = {
  id: string;
  name: string;
  company: string;
  host: string;
  purpose: string;
  siteId: string;
  checkIn: string;
  checkOut: string;
  status: "On Site" | "Checked Out";
};

export const initialVisitors: Visitor[] = [
  { id: "VIS001", name: "Rachel Smith", company: "ABC Consultants", host: "Site Manager", purpose: "Site Inspection", siteId: "SITE001", checkIn: "10:14", checkOut: "-", status: "On Site" },
  { id: "VIS002", name: "Daniel Okafor", company: "Metro Building Control", host: "Site Manager", purpose: "Building Control Visit", siteId: "SITE001", checkIn: "09:02", checkOut: "09:48", status: "Checked Out" },
  { id: "VIS003", name: "Laura Chen", company: "Kingfield Insurance", host: "Health & Safety", purpose: "Insurance Audit", siteId: "SITE001", checkIn: "08:30", checkOut: "-", status: "On Site" },
];

export const incidentTypes = [
  "Accident", "Security Incident", "Unsafe Behaviour", "Near Miss",
  "Property Damage", "Environmental Event", "Safety Observation",
];

export type Incident = {
  id: string;
  type: string;
  zone: string;
  date: string;
  time: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Closed";
  description: string;
  peopleInvolved: string;
  reportedBy: string;
  evidence: string[];
};

export const initialIncidents: Incident[] = [
  { id: "INC001", type: "Near Miss", zone: "Loading Bay", date: "01 Oct 2026", time: "07:58", severity: "Medium", status: "Open", description: "Worker entered a restricted vehicle movement area while reversing operations were taking place.", peopleInvolved: "Tom Hughes", reportedBy: "David Wilson", evidence: ["Photo", "Witness Statement"] },
  { id: "INC002", type: "Safety Observation", zone: "Gate 2", date: "30 Sep 2026", time: "14:20", severity: "Low", status: "Closed", description: "Pedestrian barrier at Gate 2 found partially displaced. Reinstated by site team.", peopleInvolved: "-", reportedBy: "Sarah Green", evidence: ["Photo"] },
  { id: "INC003", type: "Security Incident", zone: "Perimeter Fence North", date: "28 Sep 2026", time: "22:40", severity: "Medium", status: "Open", description: "Section of hoarding found cut overnight. No materials reported missing.", peopleInvolved: "-", reportedBy: "Night Security", evidence: ["Photo"] },
];

export type Briefing = {
  id: string;
  title: string;
  type: "Induction" | "Toolbox Talk";
  version: string;
  assigned: number;
  completed: number;
  status: "Active" | "Completed";
};

export const initialBriefings: Briefing[] = [
  { id: "IND001", title: "Site Safety Induction", type: "Induction", version: "v4.0", assigned: 52, completed: 49, status: "Active" },
  { id: "IND002", title: "Visitor Safety Induction", type: "Induction", version: "v1.3", assigned: 12, completed: 12, status: "Completed" },
  { id: "TBT001", title: "Working at Height", type: "Toolbox Talk", version: "v2.1", assigned: 18, completed: 16, status: "Active" },
  { id: "TBT002", title: "Vehicle Movement Safety", type: "Toolbox Talk", version: "v1.4", assigned: 24, completed: 24, status: "Completed" },
];

export const reportTypes = [
  "Attendance Report", "Visitor Report", "Incident Summary",
  "Compliance Status", "Document Expiry Report", "Induction Completion Report",
];

export const dashboardStats = {
  peopleOnSite: 48,
  visitorsToday: 6,
  accessExceptions: 3,
  openIncidents: 2,
  complianceStatus: 91,
  documentsExpiring: 5,
};

export const monthlyReport = {
  period: "September 2026",
  totalEntries: 1284,
  visitors: 73,
  incidents: 4,
  nearMisses: 6,
  complianceStatus: 91,
  expiredDocuments: 3,
  inductionCompletion: 96,
};

export type CheckResult = { label: string; pass: boolean; doc?: ComplianceDoc };

/** Evaluate gate checks: Identity, Site Induction, Insurance + role-specific competency. */
export function evaluateAccess(workerId: string): { checks: CheckResult[]; failed: CheckResult[] } {
  const docs = docsForWorker(workerId);
  const order = ["Identity", "Site Induction", "Insurance", "Crane Operator Competency"];
  const checks: CheckResult[] = [{ label: "Identity", pass: true }];

  docs
    .filter((d) => d.checkLabel)
    .forEach((d) => {
      checks.push({ label: d.checkLabel!, pass: d.status !== "Expired", doc: d });
    });

  checks.sort((a, b) => {
    const ia = order.indexOf(a.label);
    const ib = order.indexOf(b.label);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.label.localeCompare(b.label);
  });

  return { checks, failed: checks.filter((c) => !c.pass) };
}
