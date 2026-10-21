import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSessionUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SiteGuard OS" },
      {
        name: "description",
        content: "SiteGuard OS — digital gatehouse and site compliance for construction.",
      },
      { property: "og:title", content: "SiteGuard OS" },
      {
        property: "og:description",
        content: "SiteGuard OS — digital gatehouse and site compliance for construction.",
      },
    ],
  }),
  ssr: false,
  component: RootIndexPage,
});

function RootIndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getSessionUser();
    if (user) {
      navigate({ to: "/dashboard", replace: true });
    } else {
      navigate({ to: "/signup", replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">Redirecting to SiteGuard OS…</p>
      </div>
    </div>
  );
}
