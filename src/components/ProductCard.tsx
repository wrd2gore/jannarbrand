import { Link } from "@tanstack/react-router";
import { MOCKUPS, SIZES, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="overflow-hidden bg-secondary">
          <img
            src={MOCKUPS[product.garment].black.front}
            alt={product.name}
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full object-cover transition-opacity group-hover:opacity-90"
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm">{product.name}</h3>
          <span className="shrink-0 text-sm tabular-nums">${product.price}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{product.tagline}</p>
        <p className="mt-1 text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
          {SIZES.join(" ")}
        </p>
      </Link>
      <Link
        to="/customize"
        search={{ product: product.slug }}
        className="mt-3 flex min-h-11 items-center justify-center border border-ink text-xs tracking-[0.2em] uppercase active:bg-ink active:text-cream"
      >
        Customize
      </Link>
    </article>
  );
}