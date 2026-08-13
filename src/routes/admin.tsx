import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminContent, AdminCountries, AdminPromos } from "@/components/admin/AdminSettings";
import { useIsAdmin, useSession } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — JANNAR" },
      { name: "description", content: "Manage JANNAR products, prices, inventory, orders and content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — JANNAR" },
      { property: "og:description", content: "Store management dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const TABS = ["Products", "Orders", "Content", "Countries", "Promos"] as const;

function Admin() {
  const { user, ready } = useSession();
  const { data: isAdmin, isLoading } = useIsAdmin(user?.id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Products");

  if (!ready || (user && isLoading))
    return <p className="mx-auto max-w-6xl px-4 py-16 text-sm">Loading…</p>;

  if (!user || !isAdmin)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is restricted. Sign in with an admin account to continue.
        </p>
        <Link
          to="/account"
          className="mt-6 inline-flex min-h-12 items-center bg-ink px-6 text-xs tracking-[0.2em] text-cream uppercase"
        >
          Sign in
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Dashboard</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setTab(x)}
            className={`min-h-10 border px-4 text-xs tracking-[0.2em] uppercase ${
              tab === x ? "bg-ink text-cream" : "border-border"
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Products" ? <AdminProducts /> : null}
        {tab === "Orders" ? <AdminOrders /> : null}
        {tab === "Content" ? <AdminContent /> : null}
        {tab === "Countries" ? <AdminCountries /> : null}
        {tab === "Promos" ? <AdminPromos /> : null}
      </div>
    </div>
  );
}