import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DesignEditor } from "@/components/DesignEditor";
import { DesignPreview } from "@/components/DesignPreview";
import { SizeGuide } from "@/components/SizeGuide";
import { formatMoney, isAvailable, priceFor, useCountries, useInventory, usePrices, useProducts } from "@/lib/data";
import { emptyDesign, type Design } from "@/lib/design";
import { useI18n } from "@/lib/i18n";
import { addToCart, useStore } from "@/lib/store";
import { printArea, productImage, type Side } from "@/lib/types";

type Search = { product?: string | undefined };

const title = "Design your own tee or hoodie — JANNAR";
const description = "Upload artwork, add Arabic or English text, and place it on the front and back.";

export const Route = createFileRoute("/customize")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    product: typeof s['product'] === "string" ? (s['product'] as string) : undefined,
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
  component: Customize,
});

function Customize() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { t, pick } = useI18n();
  const { region } = useStore();
  const { data: products } = useProducts();
  const { data: prices } = usePrices();
  const { data: countries } = useCountries();
  const { data: inventory } = useInventory();

  const [slug, setSlug] = useState<string | null>(search.product ?? null);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [side, setSide] = useState<Side>("front");
  const [design, setDesign] = useState<Design>(emptyDesign());

  useEffect(() => {
    if (search.product) setSlug(search.product);
  }, [search.product]);

  const product = products?.find((p) => p.slug === (slug ?? "")) ?? products?.[0];
  const country = countries?.find((c) => c.code === region) ?? countries?.[0];

  if (!product) return <p className="mx-auto max-w-6xl px-4 py-16 text-sm">{t("loading")}</p>;

  const activeColor = color ?? product.colors?.[0]?.key ?? "black";
  const activeSize = size ?? product.sizes?.[0] ?? "M";
  const { price } = priceFor(prices, product.id, country?.code ?? "PS");
  const currency = country?.currency ?? "$";
  const other: Side = side === "front" ? "back" : "front";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">{t("customize")}</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {(products ?? []).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSlug(p.slug)}
            className={`min-h-10 border px-3 text-xs tracking-[0.15em] uppercase ${
              p.id === product.id ? "bg-ink text-cream" : "border-border"
            }`}
          >
            {pick(p, "name")}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(product.colors ?? []).map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setColor(c.key)}
              aria-label={c.name}
              className={`h-9 w-9 rounded-full border-2 ${activeColor === c.key ? "border-ink" : "border-border"}`}
              style={{ background: c.swatch }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {(["front", "back"] as Side[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`min-h-10 border px-4 text-xs tracking-[0.2em] uppercase ${
                side === s ? "bg-ink text-cream" : "border-border"
              }`}
            >
              {t(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <DesignEditor
          image={productImage(product, activeColor, side)}
          area={printArea(product, side)}
          side={side}
          design={design}
          onChange={setDesign}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase">
            {t("preview")} — {t(other)}
          </p>
          <div className="mt-2">
            <DesignPreview
              image={productImage(product, activeColor, other)}
              area={printArea(product, other)}
              elements={design[other]}
            />
          </div>
        </div>

        <div>
          <fieldset>
            <legend className="text-xs tracking-[0.2em] uppercase">{t("size")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(product.sizes ?? []).map((s) => {
                const ok = isAvailable(inventory, product.id, s, activeColor);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={!ok}
                    onClick={() => setSize(s)}
                    className={`min-h-11 min-w-14 border text-sm ${
                      activeSize === s ? "bg-ink text-cream" : "border-border"
                    } ${ok ? "" : "opacity-40 line-through"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p className="mt-5 text-xl tabular-nums">{formatMoney(price, currency)}</p>
          <button
            type="button"
            onClick={() => {
              addToCart({
                id: Math.random().toString(36).slice(2, 9),
                slug: product.slug,
                productId: product.id,
                name: pick(product, "name"),
                garment: product.garment,
                color: activeColor,
                size: activeSize,
                qty: 1,
                price,
                design,
              });
              toast.success(t("addToCart"));
              navigate({ to: "/cart" });
            }}
            className="mt-4 min-h-12 w-full bg-ink text-xs tracking-[0.2em] text-cream uppercase sm:w-64"
          >
            {t("addToCart")}
          </button>
        </div>
      </div>

      <SizeGuide product={product} />
    </div>
  );
}