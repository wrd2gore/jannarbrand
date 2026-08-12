import type { Side } from "./types";

export type DesignElement = {
  id: string;
  kind: "image" | "text";
  /** center position, % of the garment mockup */
  x: number;
  y: number;
  /** size: image width (% of mockup) or text scale */
  w: number;
  rotation: number;
  src?: string;
  text?: string;
  font?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
};

export type Design = Record<Side, DesignElement[]>;

export const emptyDesign = (): Design => ({ front: [], back: [] });

export const FONTS = [
  { label: "Anton", value: '"Anton", sans-serif' },
  { label: "Inter", value: '"Inter", sans-serif' },
  { label: "Bebas", value: '"Bebas Neue", sans-serif' },
  { label: "Mono", value: '"Space Mono", monospace' },
  { label: "Serif", value: '"Playfair Display", serif' },
  { label: "عربي — Cairo", value: '"Cairo", sans-serif' },
  { label: "عربي — Tajawal", value: '"Tajawal", sans-serif' },
  { label: "عربي — Amiri", value: '"Amiri", serif' },
  { label: "عربي — Kufi", value: '"Noto Kufi Arabic", sans-serif' },
  { label: "عربي — Rakkas", value: '"Rakkas", display' },
];

export type CartItem = {
  id: string;
  slug: string;
  productId: string;
  name: string;
  garment: string;
  color: string;
  size: string;
  qty: number;
  price: number;
  design: Design;
};