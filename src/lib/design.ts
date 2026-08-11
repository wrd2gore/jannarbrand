import type { ColorKey, Garment, Side } from "./catalog";

export type DesignElement = {
  id: string;
  kind: "image" | "text";
  /** center position, % of print area */
  x: number;
  y: number;
  /** width, % of print area */
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
];

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  garment: Garment;
  color: ColorKey;
  size: string;
  qty: number;
  price: number;
  design: Design;
};