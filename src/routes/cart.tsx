import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { DesignPreview } from "@/components/DesignPreview";
import { REGIONS } from "@/lib/catalog";
import { removeFromCart, setQty, useStore } from "@/lib/store";

const title = "Your Cart — JANNAR";
const description = "Review your custom JANNAR tees and hoodies before checkout.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, region } = useStore();
  const reg = REGIONS.find((r) => r.code === region)!;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = cart.length ? reg.shipping : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl">Cart</h1>

      {cart.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-4 inline-flex min-h-12 items-center bg-ink px-6 text-xs tracking-[0.2em] text-cream uppercase"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {cart.map((item) => (
              <li key={item.id} className="grid grid-cols-[88px_minmax(0,1fr)_auto] gap-3 py-4">
                <div className="grid grid-cols-2 gap-1">
                  <DesignPreview
                    garment={item.garment}
                    color={item.color}
                    side="front"
                    elements={item.design.front}
                  />
                  <DesignPreview
                    garment={item.garment}
                    color={item.color}
                    side="back"
                    elements={item.design.back}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm">{item.name}</h2>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.color} / {item.size}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Front: {item.design.front.length ? "Custom design" : "Blank"} · Back:{" "}
                    {item.design.back.length ? "Custom design" : "Blank"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="h-9 w-9 border border-border"
                    >
                      –
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="h-9 w-9 border border-border"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="text-sm tabular-nums">${item.price * item.qty}</span>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-muted-foreground"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping ({reg.name})</span>
              <span className="tabular-nums">${shipping}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <span>Total</span>
              <span className="tabular-nums">${subtotal + shipping}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 flex min-h-12 items-center justify-center bg-ink text-xs tracking-[0.2em] text-cream uppercase"
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}