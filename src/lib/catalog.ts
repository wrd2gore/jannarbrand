import teeBlackFront from "@/assets/tee-black-front.jpg";
import teeBlackBack from "@/assets/tee-black-back.jpg";
import teeCreamFront from "@/assets/tee-cream-front.jpg";
import teeCreamBack from "@/assets/tee-cream-back.jpg";
import hoodieBlackFront from "@/assets/hoodie-black-front.jpg";
import hoodieBlackBack from "@/assets/hoodie-black-back.jpg";
import hoodieCreamFront from "@/assets/hoodie-cream-front.jpg";
import hoodieCreamBack from "@/assets/hoodie-cream-back.jpg";

export type Garment = "tee" | "hoodie";
export type ColorKey = "black" | "cream";
export type Side = "front" | "back";

export const COLORS: { key: ColorKey; name: string; swatch: string }[] = [
  { key: "black", name: "Black", swatch: "#141414" },
  { key: "cream", name: "Cream", swatch: "#efe6cf" },
];

export const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"] as const;

export const MOCKUPS: Record<Garment, Record<ColorKey, Record<Side, string>>> = {
  tee: {
    black: { front: teeBlackFront, back: teeBlackBack },
    cream: { front: teeCreamFront, back: teeCreamBack },
  },
  hoodie: {
    black: { front: hoodieBlackFront, back: hoodieBlackBack },
    cream: { front: hoodieCreamFront, back: hoodieCreamBack },
  },
};

/** Print area as % of the mockup image box. Configurable per garment. */
export const PRINT_AREA: Record<Garment, { x: number; y: number; w: number; h: number }> = {
  tee: { x: 33, y: 30, w: 34, h: 40 },
  hoodie: { x: 34, y: 34, w: 32, h: 30 },
};

/** Measurements in cm — A = length, B = width. Configurable. */
export type SizeRow = { size: string; a: number; b: number };
export const SIZE_CHART: Record<Garment, SizeRow[]> = {
  hoodie: [
    { size: "S", a: 58, b: 54 },
    { size: "M", a: 60, b: 57 },
    { size: "L", a: 62, b: 60 },
    { size: "XL", a: 65, b: 63 },
    { size: "XXL", a: 68, b: 66 },
    { size: "XXXL", a: 70, b: 69 },
  ],
  tee: [
    { size: "S", a: 68, b: 52 },
    { size: "M", a: 70, b: 55 },
    { size: "L", a: 72, b: 58 },
    { size: "XL", a: 74, b: 61 },
    { size: "XXL", a: 76, b: 64 },
    { size: "XXXL", a: 78, b: 67 },
  ],
};

export type Product = {
  slug: string;
  name: string;
  garment: Garment;
  price: number;
  colors: ColorKey[];
  tagline: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "jannar-tee",
    name: "JANNAR TEE",
    garment: "tee",
    price: 28,
    colors: ["black", "cream"],
    tagline: "Heavyweight 240gsm",
    description:
      "Boxy heavyweight cotton tee cut for a relaxed streetwear fit. Printed in Palestine with durable DTG ink on front, back, or both.",
  },
  {
    slug: "jannar-hoodie",
    name: "JANNAR HOODIE",
    garment: "hoodie",
    price: 54,
    colors: ["black", "cream"],
    tagline: "Brushed fleece 400gsm",
    description:
      "Oversized brushed-fleece hoodie with kangaroo pocket and heavy ribbed cuffs. Built to carry a full back print.",
  },
  {
    slug: "oversized-tee",
    name: "OVERSIZED DROP TEE",
    garment: "tee",
    price: 32,
    colors: ["black", "cream"],
    tagline: "Drop shoulder",
    description:
      "Extra-wide drop shoulder tee with a longer body. Maximum print area for large graphics and text.",
  },
  {
    slug: "heavy-hoodie",
    name: "HEAVY BLOCK HOODIE",
    garment: "hoodie",
    price: 62,
    colors: ["black", "cream"],
    tagline: "Boxed fit 450gsm",
    description:
      "The heaviest piece we make. Dense fleece, squared silhouette, and a print area that runs shoulder to shoulder.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const REGIONS = [
  { code: "PS", name: "Palestine", currency: "$", shipping: 0 },
  { code: "JO", name: "Jordan", currency: "$", shipping: 5 },
  { code: "EG", name: "Egypt", currency: "$", shipping: 6 },
  { code: "AE", name: "United Arab Emirates", currency: "$", shipping: 9 },
] as const;

export type RegionCode = (typeof REGIONS)[number]["code"];