import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ContentRow,
  Country,
  InventoryRow,
  Product,
  ProductPrice,
} from "./types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async (): Promise<Country[]> => {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Country[];
    },
  });
}

export function usePrices() {
  return useQuery({
    queryKey: ["product_prices"],
    queryFn: async (): Promise<ProductPrice[]> => {
      const { data, error } = await supabase.from("product_prices").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as ProductPrice[];
    },
  });
}

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async (): Promise<InventoryRow[]> => {
      const { data, error } = await supabase.from("inventory").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as InventoryRow[];
    },
  });
}

export function useContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async (): Promise<ContentRow[]> => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as ContentRow[];
    },
  });
}

/** Price for a product in the selected country (sale price wins). */
export function priceFor(
  prices: ProductPrice[] | undefined,
  productId: string,
  countryCode: string,
): { price: number; base: number; onSale: boolean } {
  const row = prices?.find((p) => p.product_id === productId && p.country_code === countryCode);
  const base = Number(row?.price ?? 0);
  const sale = row?.sale_price == null ? null : Number(row.sale_price);
  const onSale = sale != null && sale > 0 && sale < base;
  return { price: onSale ? sale : base, base, onSale };
}

export function formatMoney(amount: number, currency: string) {
  const value = Math.round(amount * 100) / 100;
  return currency.length > 1 ? `${value} ${currency}` : `${currency}${value}`;
}

export function isAvailable(
  inventory: InventoryRow[] | undefined,
  productId: string,
  size: string,
  color: string,
) {
  const row = inventory?.find(
    (i) => i.product_id === productId && i.size === size && i.color === color,
  );
  if (!row) return true;
  return row.available && row.stock > 0;
}