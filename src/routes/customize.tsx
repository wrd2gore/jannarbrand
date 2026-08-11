import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  COLORS,
  PRODUCTS,
  SIZES,
  getProduct,
  type ColorKey,
  type Side,
} from "@/lib/catalog";
import { emptyDesign, type Design } from "@/lib/design";
import { DesignEditor } from "@/components/DesignEditor";
import { DesignPreview } from "@/components/DesignPreview";
import { SizeGuide } from "@/components/SizeGuide";
import { addToCart } from "@/lib/store";

const title = "Customize Your Print — JANNAR";
const description =
  "Upload an image, add custom text and position your design on the front and back of a JANNAR tee or hoodie.";

type Search = { product?: string | undefined; color?: string | undefined; size?: string | undefined };

export const Route = createFileRoute("/customize")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    product: typeof s["product"] === "string" ? s["product"] : undefined,
    color: typeof s["color"] === "string" ? s["color"] : undefined,
    size: typeof s["size"] === "string" ? s["size"] : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Customize,
});

function Customize() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const initial = (search.product && getProduct(search.product)) || PRODUCTS[0]!;

  const [slug, setSlug] = useState(initial.slug);
  const [color, setColor] = useState<ColorKey>((search.color as ColorKey) ?? "black");
  const [size, setSize] = useState(search.size ?? "L");
  const [side, setSide] = useState<Side>("front");
  const [design, setDesign] = useState<Design>(emptyDesign());

  const product = getProduct(slug)!;
  const garmentOptions = [
    { label: "T-Shirt", value: "tee" as const },
    { label: "Hoodie", value: "hoodie" as const },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl">Customize</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Front and back are saved separately — switch freely.
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
        <div>
          <div className="mx-auto flex max-w-md">
            {(["front", "back"] as Side[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`min-h-12 flex-1 border text-xs tracking-[0.25em] uppercase transition-colors ${
                  side === s ? "border-ink bg-ink text-cream" : "border-border"
                }`}
              >
                {s}
                {design[s].length > 0 ? " •" : ""}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <DesignEditor
              garment={product.garment}
              color={color}
              side={side}
              design={design}
              onChange={setDesign}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase">Garment</p>
            <div className="mt-2 flex gap-2">
              {garmentOptions.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => {
                    const next = PRODUCTS.find((p) => p.garment === g.value)!;
                    setSlug(next.slug);
                  }}
                  className={`min-h-11 flex-1 border px-3 text-xs tracking-[0.2em] uppercase ${
                    product.garment === g.value ? "border-ink bg-ink text-cream" : "border-border"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase">Style</p>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-2 min-h-11 w-full border border-border bg-background px-2 text-sm"
            >
              {PRODUCTS.filter((p) => p.garment === product.garment).map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — ${p.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase">Color</p>
            <div className="mt-2 flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-label={c.name}
                  onClick={() => setColor(c.key)}
                  className={`h-11 w-11 rounded-full border-2 ${color === c.key ? "border-ink" : "border-border"}`}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
          </div>

          <div>
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

          <div>
            <p className="text-xs tracking-[0.2em] uppercase">Preview</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["front", "back"] as Side[]).map((s) => (
                <div key={s}>
                  <DesignPreview
                    garment={product.garment}
                    color={color}
                    side={s}
                    elements={design[s]}
                  />
                  <p className="mt-1 text-center text-[10px] tracking-[0.2em] uppercase">{s}</p>
                </div>
              ))}
            </div>
          </div>

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
                design,
              });
              toast.success("Added to cart");
              navigate({ to: "/cart" });
            }}
            className="flex min-h-12 w-full items-center justify-center bg-ink text-xs tracking-[0.2em] text-cream uppercase"
          >
            Add to cart — ${product.price}
          </button>
        </aside>
      </div>

      <SizeGuide garment={product.garment} />
    </div>
  );
}