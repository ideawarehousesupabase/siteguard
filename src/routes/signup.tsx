import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/sg/AuthShell";
import { selectCls } from "@/components/sg/ui";
import { createAccount, getSessionUser, isValidEmail, ROLES } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — SiteGuard OS" },
      { name: "description", content: "Create a SiteGuard OS account for your site team." },
      { property: "og:title", content: "Create Account — SiteGuard OS" },
      { property: "og:description", content: "Create a SiteGuard OS account for your site team." },
    ],
  }),
  ssr: false,
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    fullName: "",
    email: "",
    companyName: "",
    role: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (getSessionUser()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (Object.values(f).some((v) => !v.trim())) return setError("All fields are required.");
    if (!isValidEmail(f.email)) return setError("Enter a valid email address.");
    if (f.password !== f.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await createAccount(f);
      setSuccess(true);
      setTimeout(() => navigate({ to: "/signin" }), 1500);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message.includes("already exists")
          ? err.message
          : "Could not create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create Account" subtitle="Set up access for your site role.">
      {success ? (
        <div className="rounded-lg border border-success/30 bg-success-soft p-5 text-success">
          <p className="font-semibold">Account created successfully.</p>
          <p className="mt-1 text-sm">Redirecting you to Sign In…</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fn">Full Name</Label>
            <Input id="fn" className="h-11" value={f.fullName} onChange={set("fullName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="em">Email Address</Label>
            <Input id="em" type="email" className="h-11" value={f.email} onChange={set("email")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="co">Company Name</Label>
              <Input id="co" className="h-11" value={f.companyName} onChange={set("companyName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ro">Role</Label>
              <select id="ro" className={selectCls} value={f.role} onChange={set("role")}>
                <option value="">Select role</option>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pw">Password</Label>
              <Input
                id="pw"
                type="password"
                className="h-11"
                value={f.password}
                onChange={set("password")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp">Confirm Password</Label>
              <Input
                id="cp"
                type="password"
                className="h-11"
                value={f.confirm}
                onChange={set("confirm")}
              />
            </div>
          </div>
          {error && (
            <p className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-foreground underline underline-offset-4">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
