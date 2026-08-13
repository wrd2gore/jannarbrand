import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useCountries, usePrices, useProducts } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

type Search = { type?: string | undefined };

const title = "Shop — JANNAR Custom Tees & Hoodies";
const description = "Browse JANNAR blanks: heavyweight tees and hoodies ready for your own print.";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s['type'] === "string" ? (s['type'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { type } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useI18n();
  const { region } = useStore();
  const { data: products, isLoading } = useProducts();
  const { data: prices } = usePrices();
  const { data: countries } = useCountries();
  const country = countries?.find((c) => c.code === region) ?? countries?.[0];

  const filtered = (products ?? []).filter((p) => !type || p.garment === type);
  const tabs: { key?: string; label: string }[] = [
    { label: t("all") },
    { key: "tee", label: t("tees") },
    { key: "hoodie", label: t("hoodies") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">{t("shop")}</h1>
      <div className="mt-5 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => navigate({ search: tab.key ? { type: tab.key } : {} })}
            className={`min-h-10 border px-4 text-xs tracking-[0.2em] uppercase ${
              (type ?? undefined) === tab.key ? "bg-ink text-cream" : "border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} prices={prices} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}