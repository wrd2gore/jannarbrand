export type Side = "front" | "back";
export type Garment = "tee" | "hoodie";

export type ColorOption = { key: string; name: string; swatch: string };
export type Rect = { x: number; y: number; w: number; h: number };
export type SizeRow = { size: string; a: number; b: number };

export type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  garment: string;
  category: string;
  colors: ColorOption[];
  sizes: string[];
  images: Record<string, Partial<Record<Side, string>>>;
  print_areas: Record<Side, Rect>;
  size_chart: SizeRow[];
  enabled: boolean;
  featured: boolean;
  sort_order: number;
};

export type Country = {
  code: string;
  name_en: string;
  name_ar: string;
  currency: string;
  shipping_cost: number;
  sort_order: number;
  enabled: boolean;
};

export type ProductPrice = {
  product_id: string;
  country_code: string;
  price: number;
  sale_price: number | null;
};

export type InventoryRow = {
  product_id: string;
  size: string;
  color: string;
  stock: number;
  available: boolean;
};

export type ContentRow = {
  key: string;
  value_en: string;
  value_ar: string;
  group_name: string;
  kind: string;
};

export const DEFAULT_AREA: Rect = { x: 30, y: 26, w: 40, h: 46 };

export function productImage(p: Product | undefined, color: string, side: Side): string {
  if (!p) return "";
  const byColor = p.images?.[color] ?? Object.values(p.images ?? {})[0];
  return byColor?.[side] ?? byColor?.front ?? "";
}

export function printArea(p: Product | undefined, side: Side): Rect {
  return p?.print_areas?.[side] ?? DEFAULT_AREA;
}