import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney, useCountries } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { clearCart, useStore } from "@/lib/store";
import { useSession } from "@/lib/auth";

const title = "Checkout — JANNAR";
const description = "Complete your JANNAR order with cash on delivery across Palestine, Jordan and Egypt.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { t, pick } = useI18n();
  const navigate = useNavigate();
  const { cart, region } = useStore();
  const { data: countries } = useCountries();
  const { user } = useSession();
  const country = countries?.find((c) => c.code === region) ?? countries?.[0];
  const currency = country?.currency ?? "$";

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [busy, setBusy] = useState(false);

  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = cart.length ? Number(country?.shipping_cost ?? 0) : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const applyPromo = async () => {
    const { data, error } = await supabase.rpc("check_promo", {
      _code: promo.trim(),
      _subtotal: subtotal,
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (error || !row) {
      setDiscount(0);
      toast.error("Invalid code");
      return;
    }
    setDiscount(Number(row.discount));
    toast.success(t("discount"));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    setBusy(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country_code: country?.code ?? "PS",
        currency,
        subtotal,
        shipping,
        discount,
        total,
        promo_code: discount > 0 ? promo.trim() : null,
      })
      .select("id, order_number")
      .single();

    if (error || !order) {
      setBusy(false);
      toast.error(error?.message ?? "Error");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      cart.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.name,
        garment: i.garment,
        color: i.color,
        size: i.size,
        qty: i.qty,
        unit_price: i.price,
        design: JSON.parse(JSON.stringify(i.design)),
      })),
    );
    setBusy(false);
    if (itemsError) {
      toast.error(itemsError.message);
      return;
    }
    clearCart();
    toast.success(`${t("orderPlaced")} #${order.order_number}`);
    navigate({ to: "/account" });
  };

  if (!cart.length)
    return <p className="mx-auto max-w-6xl px-4 py-20 text-center text-sm">{t("emptyCart")}</p>;

  const field = "mt-1 min-h-12 w-full border border-border bg-background px-3 text-sm";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl">{t("checkout")}</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <h2 className="text-xs tracking-[0.2em] uppercase">{t("customer")}</h2>
        <label className="block text-xs">
          {t("fullName")}
          <input required value={form.name} onChange={set("name")} className={field} />
        </label>
        <label className="block text-xs">
          {t("email")}
          <input required type="email" value={form.email} onChange={set("email")} className={field} />
        </label>
        <label className="block text-xs">
          {t("phone")}
          <input required value={form.phone} onChange={set("phone")} className={field} />
        </label>
        <label className="block text-xs">
          {t("address")}
          <input required value={form.address} onChange={set("address")} className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            {t("city")}
            <input required value={form.city} onChange={set("city")} className={field} />
          </label>
          <label className="block text-xs">
            {t("country")}
            <input readOnly value={pick(country, "name")} className={field} />
          </label>
        </div>

        <div className="flex items-end gap-2">
          <label className="block flex-1 text-xs">
            {t("promoCode")}
            <input value={promo} onChange={(e) => setPromo(e.target.value)} className={field} />
          </label>
          <button type="button" onClick={applyPromo} className="min-h-12 border border-ink px-4 text-xs uppercase">
            {t("apply")}
          </button>
        </div>

        <dl className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>{t("subtotal")}</dt>
            <dd className="tabular-nums">{formatMoney(subtotal, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{t("shipping")}</dt>
            <dd className="tabular-nums">{formatMoney(shipping, currency)}</dd>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between">
              <dt>{t("discount")}</dt>
              <dd className="tabular-nums">-{formatMoney(discount, currency)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-2 text-base">
            <dt>{t("total")}</dt>
            <dd className="tabular-nums">{formatMoney(total, currency)}</dd>
          </div>
        </dl>

        <p className="text-xs text-muted-foreground">
          {t("payment")} — {t("paymentNote")}
        </p>
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full bg-ink text-xs tracking-[0.2em] text-cream uppercase disabled:opacity-50"
        >
          {busy ? t("loading") : t("placeOrder")}
        </button>
      </form>
    </div>
  );
}