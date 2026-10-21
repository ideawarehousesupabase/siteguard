import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Panel, selectCls } from "@/components/sg/ui";
import { getProfile, getSessionUser, ROLES, updateProfile, type SessionUser } from "@/lib/auth";
import { pageHead } from "@/lib/meta";

export const Route = createFileRoute("/_app/profile")({
  head: pageHead("Profile", "Your SiteGuard OS account details."),
  component: Profile,
});

function Profile() {
  const [p, setP] = useState<SessionUser | null>(null);
  const [f, setF] = useState({ fullName: "", companyName: "", role: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = getSessionUser();
    if (!u) return;
    getProfile(u.id)
      .then((x) => { setP(x); setF({ fullName: x.fullName, companyName: x.companyName, role: x.role }); })
      .catch((e) => { console.error(e); setMsg({ ok: false, text: "Could not load your profile." }); });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    if (!f.fullName.trim() || !f.companyName.trim() || !f.role) return setMsg({ ok: false, text: "All fields are required." });
    setSaving(true);
    try {
      await updateProfile(p.id, { fullName: f.fullName.trim(), companyName: f.companyName.trim(), role: f.role });
      setMsg({ ok: true, text: "Profile updated." });
    } catch (err) {
      console.error(err);
      setMsg({ ok: false, text: "Could not save changes." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" subtitle="Your account details" />
      <Panel>
        {!p && !msg ? (
          <p className="p-5 text-muted-foreground">Loading profile…</p>
        ) : (
          <form onSubmit={save} className="space-y-4 p-5">
            <div className="space-y-1.5"><Label htmlFor="pe">Email</Label><Input id="pe" className="h-11" value={p?.email ?? ""} disabled /></div>
            <div className="space-y-1.5"><Label htmlFor="pf">Full Name</Label><Input id="pf" className="h-11" value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="pc">Company Name</Label><Input id="pc" className="h-11" value={f.companyName} onChange={(e) => setF({ ...f, companyName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="pr">Role</Label>
              <select id="pr" className={selectCls} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
            {msg && <p className={msg.ok ? "text-sm font-medium text-success" : "text-sm font-medium text-danger"}>{msg.text}</p>}
            <Button type="submit" size="lg" disabled={saving || !p}>{saving ? "Saving…" : "Save Changes"}</Button>
          </form>
        )}
      </Panel>
    </div>
  );
}
