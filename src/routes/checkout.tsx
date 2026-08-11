import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { REGIONS, type RegionCode } from "@/lib/catalog";
import { clearCart, setRegion, useStore } from "@/lib/store";
import { Flag } from "@/components/Flag";

const title = "Checkout — JANNAR";
const description = "Complete your JANNAR order: shipping details, region and payment.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Checkout,
});

const field =
  "mt-1 min-h-12 w-full border border-border bg-background px-3 text-sm outline-none focus:border-ink";

function Checkout() {
  const { cart, region } = useStore();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const reg = REGIONS.find((r) => r.code === region)!;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + (cart.length ? reg.shipping : 0);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl">Checkout</h1>
        <p className="mt-3 text-sm text-muted-foreground">Nothing to check out yet.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex min-h-12 items-center bg-ink px-6 text-xs tracking-[0.2em] text-cream uppercase"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl">Checkout</h1>
      <form
        className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          setPlacing(true);
          clearCart();
          toast.success("Order placed — we'll email your confirmation.");
          navigate({ to: "/account" });
        }}
      >
        <div className="space-y-6">
          <fieldset>
            <legend className="text-xs tracking-[0.2em] uppercase">Customer</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs">
                Full name
                <input required className={field} autoComplete="name" />
              </label>
              <label className="block text-xs">
                Email
                <input required type="email" className={field} autoComplete="email" />
              </label>
              <label className="block text-xs sm:col-span-2">
                Phone
                <input required type="tel" className={field} autoComplete="tel" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs tracking-[0.2em] uppercase">Shipping</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs sm:col-span-2">
                Address
                <input required className={field} autoComplete="street-address" />
              </label>
              <label className="block text-xs">
                City
                <input required className={field} autoComplete="address-level2" />
              </label>
              <label className="block text-xs">
                Region
                <select
                  className={field}
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionCode)}
                >
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs tracking-[0.2em] uppercase">Payment</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs sm:col-span-2">
                Card number
                <input required inputMode="numeric" placeholder="4242 4242 4242 4242" className={field} />
              </label>
              <label className="block text-xs">
                Expiry
                <input required placeholder="MM/YY" className={field} />
              </label>
              <label className="block text-xs">
                CVC
                <input required inputMode="numeric" placeholder="123" className={field} />
              </label>
            </div>
          </fieldset>
        </div>

        <aside className="border border-border p-4">
          <h2 className="text-sm">Order summary</h2>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Flag code={reg.code} />
            <span>
              {reg.name} ({reg.code})
            </span>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">
                  {i.name} · {i.size} × {i.qty}
                </span>
                <span className="tabular-nums">${i.price * i.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-3 text-base">
            <span>Total</span>
            <span className="tabular-nums">${total}</span>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="mt-4 flex min-h-12 w-full items-center justify-center bg-ink text-xs tracking-[0.2em] text-cream uppercase disabled:opacity-60"
          >
            Place order
          </button>
        </aside>
      </form>
    </div>
  );
}