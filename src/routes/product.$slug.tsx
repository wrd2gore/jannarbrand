import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  COLORS,
  MOCKUPS,
  SIZES,
  getProduct,
  type ColorKey,
  type Side,
  type Product,
} from "@/lib/catalog";
import { SizeGuide } from "@/components/SizeGuide";
import { addToCart } from "@/lib/store";
import { emptyDesign } from "@/lib/design";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Unavailable — JANNAR" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.product.name} — JANNAR`;
    const d = loaderData.product.description;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [color, setColor] = useState<ColorKey>(product.colors[0] ?? "black");
  const [size, setSize] = useState<string>("L");
  const [side, setSide] = useState<Side>("front");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="bg-secondary">
            <img
              src={MOCKUPS[product.garment][color][side]}
              alt={`${product.name} ${side}`}
              width={1024}
              height={1024}
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {(["front", "back"] as Side[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`h-20 w-20 shrink-0 border ${side === s ? "border-ink" : "border-border"}`}
              >
                <img
                  src={MOCKUPS[product.garment][color][s]}
                  alt={`${s} view`}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
          <p className="mt-4 text-2xl tabular-nums">${product.price}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6">
            <p className="text-xs tracking-[0.2em] uppercase">Color</p>
            <div className="mt-2 flex gap-2">
              {product.colors.map((c) => {
                const meta = COLORS.find((x) => x.key === c)!;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={meta.name}
                    onClick={() => setColor(c)}
                    className={`h-11 w-11 rounded-full border-2 ${color === c ? "border-ink" : "border-border"}`}
                    style={{ backgroundColor: meta.swatch }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs tracking-[0.2em] uppercase">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`min-h-11 min-w-12 border px-3 text-sm ${
                    size === s ? "border-ink bg-ink text-cream" : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <Link
              to="/customize"
              search={{ product: product.slug, color, size }}
              className="flex min-h-12 items-center justify-center bg-ink text-xs tracking-[0.2em] text-cream uppercase"
            >
              Customize this {product.garment === "tee" ? "shirt" : "hoodie"}
            </Link>
            <button
              type="button"
              onClick={() => {
                addToCart({
                  id: Math.random().toString(36).slice(2, 9),
                  slug: product.slug,
                  name: product.name,
                  garment: product.garment,
                  color,
                  size,
                  qty: 1,
                  price: product.price,
                  design: emptyDesign(),
                });
                toast.success("Added to cart");
              }}
              className="flex min-h-12 items-center justify-center border border-ink text-xs tracking-[0.2em] uppercase"
            >
              Add to cart — blank
            </button>
          </div>
        </div>
      </div>

      <SizeGuide garment={product.garment} />
    </div>
  );
}