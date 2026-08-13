import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DesignPreview } from "@/components/DesignPreview";
import { SizeGuide } from "@/components/SizeGuide";
import { formatMoney, isAvailable, priceFor, useCountries, useInventory, usePrices, useProducts } from "@/lib/data";
import { emptyDesign } from "@/lib/design";
import { useI18n } from "@/lib/i18n";
import { addToCart, useStore } from "@/lib/store";
import { printArea, productImage, type Side } from "@/lib/types";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ").toUpperCase()} — JANNAR`;
    const description = "Heavyweight JANNAR blank, ready for your custom front and back print.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { t, pick } = useI18n();
  const { region } = useStore();
  const { data: products, isLoading } = useProducts();
  const { data: prices } = usePrices();
  const { data: countries } = useCountries();
  const { data: inventory } = useInventory();

  const product = products?.find((p) => p.slug === slug);
  const country = countries?.find((c) => c.code === region) ?? countries?.[0];
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [side, setSide] = useState<Side>("front");

  if (isLoading) return <p className="mx-auto max-w-6xl px-4 py-16 text-sm">{t("loading")}</p>;
  if (!product)
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm">404</p>
        <Link to="/shop" className="underline">{t("shop")}</Link>
      </div>
    );

  const activeColor = color ?? product.colors?.[0]?.key ?? "black";
  const activeSize = size ?? product.sizes?.[0] ?? "M";
  const { price, base, onSale } = priceFor(prices, product.id, country?.code ?? "PS");
  const currency = country?.currency ?? "$";
  const inStock = isAvailable(inventory, product.id, activeSize, activeColor);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <DesignPreview
            image={productImage(product, activeColor, side)}
            area={printArea(product, side)}
            elements={[]}
            alt={pick(product, "name")}
            eager
          />
          <div className="mt-3 flex gap-2">
            {(["front", "back"] as Side[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`min-h-10 flex-1 border text-xs tracking-[0.2em] uppercase ${
                  side === s ? "bg-ink text-cream" : "border-border"
                }`}
              >
                {t(s)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl">{pick(product, "name")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{pick(product, "tagline")}</p>
          <p className="mt-4 text-xl tabular-nums">
            {onSale ? (
              <span className="me-2 text-base text-muted-foreground line-through">
                {formatMoney(base, currency)}
              </span>
            ) : null}
            {formatMoney(price, currency)}
          </p>
          <p className="mt-4 text-sm leading-relaxed">{pick(product, "description")}</p>

          <fieldset className="mt-6">
            <legend className="text-xs tracking-[0.2em] uppercase">{t("color")}</legend>
            <div className="mt-2 flex gap-2">
              {(product.colors ?? []).map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  aria-label={c.name}
                  className={`h-10 w-10 rounded-full border-2 ${
                    activeColor === c.key ? "border-ink" : "border-border"
                  }`}
                  style={{ background: c.swatch }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
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

          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={!inStock}
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
                  design: emptyDesign(),
                });
                toast.success(t("addToCart"));
                navigate({ to: "/cart" });
              }}
              className="min-h-12 flex-1 bg-ink text-xs tracking-[0.2em] text-cream uppercase disabled:opacity-40"
            >
              {inStock ? t("addToCart") : t("outOfStock")}
            </button>
            <Link
              to="/customize"
              search={{ product: product.slug }}
              className="flex min-h-12 flex-1 items-center justify-center border border-ink text-xs tracking-[0.2em] uppercase"
            >
              {t("customize")}
            </Link>
          </div>
        </div>
      </div>

      <SizeGuide product={product} />
    </div>
  );
}