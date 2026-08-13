import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCountries, useInventory, usePrices, useProducts } from "@/lib/data";
import type { Product, Rect, Side } from "@/lib/types";
import { Button, Field, Panel, inputClass } from "./ui";

const emptyProduct = {
  slug: "new-product",
  name_en: "New product",
  name_ar: "منتج جديد",
  garment: "tee",
  colors: [{ key: "black", name: "Black", swatch: "#141414" }],
  sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  images: { black: { front: "/mockups/tee-black-front.jpg", back: "/mockups/tee-black-back.jpg" } },
};

export function AdminProducts() {
  const qc = useQueryClient();
  const { data: products } = useProducts();
  const { data: prices } = usePrices();
  const { data: countries } = useCountries();
  const { data: inventory } = useInventory();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const product = products?.find((p) => p.id === selectedId) ?? products?.[0];

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["product_prices"] });
    qc.invalidateQueries({ queryKey: ["inventory"] });
  };

  const patch = async (values: Record<string, unknown>) => {
    if (!product) return;
    const { error } = await supabase.from("products").update(values as never).eq("id", product.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    refresh();
  };

  const createProduct = async () => {
    const { error } = await supabase.from("products").insert({
      ...emptyProduct,
      slug: `${emptyProduct.slug}-${Math.random().toString(36).slice(2, 6)}`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  };

  const removeProduct = async () => {
    if (!product) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSelectedId(null);
    refresh();
  };

  const setPrice = async (countryCode: string, price: number, sale: string) => {
    if (!product) return;
    const { error } = await supabase.from("product_prices").upsert(
      {
        product_id: product.id,
        country_code: countryCode,
        price,
        sale_price: sale === "" ? null : Number(sale),
      },
      { onConflict: "product_id,country_code" },
    );
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Price saved");
    refresh();
  };

  const setStock = async (size: string, color: string, stock: number) => {
    if (!product) return;
    const { error } = await supabase
      .from("inventory")
      .upsert(
        { product_id: product.id, size, color, stock, available: stock > 0 },
        { onConflict: "product_id,size,color" },
      );
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  };

  const setArea = (side: Side, key: keyof Rect, value: number) => {
    if (!product) return;
    const areas = { ...product.print_areas };
    areas[side] = { ...areas[side], [key]: value };
    void patch({ print_areas: areas });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="space-y-2">
        {(products ?? []).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            className={`block w-full border px-3 py-2 text-start text-sm ${
              p.id === product?.id ? "bg-ink text-cream" : "border-border"
            }`}
          >
            {p.name_en}
          </button>
        ))}
        <Button variant="outline" onClick={createProduct}>
          + Product
        </Button>
      </div>

      {product ? (
        <div className="space-y-4">
          <ProductForm product={product} onSave={patch} />

          <Panel title="Prices by country">
            {(countries ?? []).map((c) => {
              const row = prices?.find(
                (p) => p.product_id === product.id && p.country_code === c.code,
              );
              return (
                <PriceRow
                  key={c.code}
                  label={`${c.name_en} (${c.currency})`}
                  price={Number(row?.price ?? 0)}
                  sale={row?.sale_price == null ? "" : String(row.sale_price)}
                  onSave={(price, sale) => setPrice(c.code, price, sale)}
                />
              );
            })}
          </Panel>

          <Panel title="Inventory">
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-start text-xs uppercase">Color / Size</th>
                    {product.sizes.map((s) => (
                      <th key={s} className="p-2 text-xs uppercase">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.colors.map((c) => (
                    <tr key={c.key}>
                      <td className="p-2">{c.name}</td>
                      {product.sizes.map((s) => {
                        const row = inventory?.find(
                          (i) => i.product_id === product.id && i.size === s && i.color === c.key,
                        );
                        return (
                          <td key={s} className="p-1">
                            <input
                              type="number"
                              defaultValue={row?.stock ?? 0}
                              onBlur={(e) => setStock(s, c.key, Number(e.target.value))}
                              className="h-10 w-16 border border-border bg-background px-2 text-sm"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Printable area (% of mockup)">
            {(["front", "back"] as Side[]).map((side) => (
              <div key={side} className="grid grid-cols-4 gap-2">
                {(["x", "y", "w", "h"] as (keyof Rect)[]).map((k) => (
                  <Field key={k} label={`${side} ${k}`}>
                    <input
                      type="number"
                      step="0.5"
                      defaultValue={product.print_areas?.[side]?.[k] ?? 0}
                      onBlur={(e) => setArea(side, k, Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                ))}
              </div>
            ))}
          </Panel>

          <Button variant="outline" onClick={removeProduct}>
            Delete product
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function PriceRow({
  label,
  price,
  sale,
  onSave,
}: {
  label: string;
  price: number;
  sale: string;
  onSave: (price: number, sale: string) => void;
}) {
  const [p, setP] = useState(String(price));
  const [s, setS] = useState(sale);
  return (
    <div className="flex flex-wrap items-end gap-2">
      <Field label={label}>
        <input value={p} onChange={(e) => setP(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Sale price">
        <input value={s} onChange={(e) => setS(e.target.value)} className={inputClass} />
      </Field>
      <Button variant="outline" onClick={() => onSave(Number(p), s)}>
        Save
      </Button>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
}: {
  product: Product;
  onSave: (values: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState(() => ({
    slug: product.slug,
    name_en: product.name_en,
    name_ar: product.name_ar,
    tagline_en: product.tagline_en,
    tagline_ar: product.tagline_ar,
    description_en: product.description_en,
    description_ar: product.description_ar,
    garment: product.garment,
    enabled: product.enabled,
    featured: product.featured,
    sort_order: product.sort_order,
    sizes: (product.sizes ?? []).join(", "),
    colors: JSON.stringify(product.colors ?? [], null, 2),
    images: JSON.stringify(product.images ?? {}, null, 2),
    size_chart: JSON.stringify(product.size_chart ?? [], null, 2),
  }));
  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    try {
      onSave({
        slug: form.slug,
        name_en: form.name_en,
        name_ar: form.name_ar,
        tagline_en: form.tagline_en,
        tagline_ar: form.tagline_ar,
        description_en: form.description_en,
        description_ar: form.description_ar,
        garment: form.garment,
        enabled: form.enabled,
        featured: form.featured,
        sort_order: Number(form.sort_order),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: JSON.parse(form.colors),
        images: JSON.parse(form.images),
        size_chart: JSON.parse(form.size_chart),
      });
    } catch {
      toast.error("Invalid JSON in colors, images or size chart");
    }
  };

  return (
    <Panel title="Product details">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Slug">
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Garment (tee / hoodie)">
          <input value={form.garment} onChange={(e) => set("garment", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Name (EN)">
          <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Name (AR)">
          <input dir="rtl" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Tagline (EN)">
          <input value={form.tagline_en} onChange={(e) => set("tagline_en", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Tagline (AR)">
          <input dir="rtl" value={form.tagline_ar} onChange={(e) => set("tagline_ar", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Description (EN)">
          <textarea rows={3} value={form.description_en} onChange={(e) => set("description_en", e.target.value)} className={`${inputClass} py-2`} />
        </Field>
        <Field label="Description (AR)">
          <textarea dir="rtl" rows={3} value={form.description_ar} onChange={(e) => set("description_ar", e.target.value)} className={`${inputClass} py-2`} />
        </Field>
        <Field label="Sizes (comma separated)">
          <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Sort order">
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Colors (JSON)">
          <textarea rows={5} value={form.colors} onChange={(e) => set("colors", e.target.value)} className={`${inputClass} py-2 font-mono text-xs`} />
        </Field>
        <Field label="Images (JSON: color → front/back URL)">
          <textarea rows={5} value={form.images} onChange={(e) => set("images", e.target.value)} className={`${inputClass} py-2 font-mono text-xs`} />
        </Field>
        <Field label="Size chart (JSON)">
          <textarea rows={5} value={form.size_chart} onChange={(e) => set("size_chart", e.target.value)} className={`${inputClass} py-2 font-mono text-xs`} />
        </Field>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} />
            Visible
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured
          </label>
        </div>
      </div>
      <Button onClick={save}>Save changes</Button>
    </Panel>
  );
}