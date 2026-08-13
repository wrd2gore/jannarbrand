import { createFileRoute, Link } from "@tanstack/react-router";
import { DesignPreview } from "@/components/DesignPreview";
import { formatMoney, useCountries, useProducts } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { removeFromCart, setQty, useStore } from "@/lib/store";
import { printArea, productImage } from "@/lib/types";

const title = "Cart — JANNAR";
const description = "Review your custom JANNAR pieces before checkout.";

export const Route = createFileRoute("/cart")({
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
  component: Cart,
});

function Cart() {
  const { t } = useI18n();
  const { cart, region } = useStore();
  const { data: countries } = useCountries();
  const { data: products } = useProducts();
  const country = countries?.find((c) => c.code === region) ?? countries?.[0];
  const currency = country?.currency ?? "$";
  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = cart.length ? Number(country?.shipping_cost ?? 0) : 0;

  if (!cart.length)
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">{t("emptyCart")}</p>
        <Link to="/shop" className="mt-5 inline-flex min-h-12 items-center bg-ink px-6 text-xs tracking-[0.2em] text-cream uppercase">
          {t("continueShopping")}
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">{t("yourCart")}</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ul className="space-y-6">
          {cart.map((item) => {
            const product = products?.find((p) => p.id === item.productId || p.slug === item.slug);
            return (
              <li key={item.id} className="flex gap-4 border-b border-border pb-6">
                <div className="grid w-40 shrink-0 grid-cols-2 gap-1">
                  <DesignPreview
                    image={productImage(product, item.color, "front")}
                    area={printArea(product, "front")}
                    elements={item.design.front}
                  />
                  <DesignPreview
                    image={productImage(product, item.color, "back")}
                    area={printArea(product, "back")}
                    elements={item.design.back}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.color} · {item.size}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-xs">
                      {t("qty")}
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => setQty(item.id, Number(e.target.value))}
                        className="ms-2 h-10 w-16 border border-border bg-background px-2 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs underline underline-offset-4"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
                <p className="text-sm tabular-nums">{formatMoney(item.price * item.qty, currency)}</p>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit border border-border p-5">
          <h2 className="text-xs tracking-[0.2em] uppercase">{t("orderSummary")}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>{t("subtotal")}</dt>
              <dd className="tabular-nums">{formatMoney(subtotal, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("shipping")}</dt>
              <dd className="tabular-nums">{formatMoney(shipping, currency)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <dt>{t("total")}</dt>
              <dd className="tabular-nums">{formatMoney(subtotal + shipping, currency)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-5 flex min-h-12 items-center justify-center bg-ink text-xs tracking-[0.2em] text-cream uppercase"
          >
            {t("checkout")}
          </Link>
        </aside>
      </div>
    </div>
  );
}