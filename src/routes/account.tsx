import { createFileRoute, Link } from "@tanstack/react-router";
import { REGIONS } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Flag } from "@/components/Flag";

const title = "Account — JANNAR";
const description = "Your JANNAR account: shipping region, orders and saved designs.";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Account,
});

function Account() {
  const { region } = useStore();
  const reg = REGIONS.find((r) => r.code === region)!;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl">Account</h1>

      <section className="mt-6 border border-border p-4">
        <h2 className="text-sm">Shipping region</h2>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Flag code={reg.code} />
          <span>
            {reg.name} ({reg.code})
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Change it any time from the flag in the header.
        </p>
      </section>

      <section className="mt-6 border border-border p-4">
        <h2 className="text-sm">Orders</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No orders on this device yet. Placed orders will appear here.
        </p>
        <Link
          to="/shop"
          className="mt-4 inline-flex min-h-12 items-center bg-ink px-6 text-xs tracking-[0.2em] text-cream uppercase"
        >
          Browse the drop
        </Link>
      </section>
    </div>
  );
}