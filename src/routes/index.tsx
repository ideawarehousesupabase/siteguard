import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/sg/AuthShell";
import { getSessionUser, isValidEmail, signIn } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In — SiteGuard OS" },
      { name: "description", content: "Sign in to the SiteGuard OS gatehouse." },
      { property: "og:title", content: "Sign In — SiteGuard OS" },
      { property: "og:description", content: "Sign in to the SiteGuard OS gatehouse." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSessionUser()) navigate({ to: "/dashboard" });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Enter your email and password.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error && err.message === "Invalid email or password." ? err.message : "Could not sign in. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Access the SiteGuard gatehouse.">
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="h-11" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{error}</p>}
        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        New to SiteGuard?{" "}
        <Link to="/signup" className="font-semibold text-foreground underline underline-offset-4">Create Account</Link>
      </p>
    </AuthShell>
  );
}
