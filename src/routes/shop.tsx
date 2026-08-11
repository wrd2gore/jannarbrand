import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

const title = "Shop Tees & Hoodies — JANNAR";
const description =
  "Browse JANNAR heavyweight tees and oversized hoodies in black and cream, ready for your custom front and back print.";

type Search = { type?: "tee" | "hoodie" };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: s["type"] === "tee" || s["type"] === "hoodie" ? s["type"] : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { type } = Route.useSearch();
  const items = type ? PRODUCTS.filter((p) => p.garment === type) : PRODUCTS;
  const tabs: { label: string; value: Search["type"] }[] = [
    { label: "All", value: undefined },
    { label: "Shirts", value: "tee" },
    { label: "Hoodies", value: "hoodie" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Shop</h1>
      <div className="mt-5 flex gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            to="/shop"
            search={t.value ? { type: t.value } : {}}
            className={`flex min-h-11 items-center border px-4 text-xs tracking-[0.2em] uppercase ${
              type === t.value ? "border-ink bg-ink text-cream" : "border-border"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}