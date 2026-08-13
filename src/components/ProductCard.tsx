import { Link } from "@tanstack/react-router";
import { formatMoney, priceFor } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { productImage, type Country, type Product, type ProductPrice } from "@/lib/types";

export function ProductCard({
  product,
  prices,
  country,
}: {
  product: Product;
  prices: ProductPrice[] | undefined;
  country: Country | undefined;
}) {
  const { pick, t } = useI18n();
  const color = product.colors?.[0]?.key ?? "black";
  const { price, base, onSale } = priceFor(prices, product.id, country?.code ?? "PS");
  const currency = country?.currency ?? "$";

  return (
    <article className="group">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="overflow-hidden bg-secondary">
          <img
            src={productImage(product, color, "front")}
            alt={pick(product, "name")}
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full object-cover transition-opacity group-hover:opacity-90"
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm">{pick(product, "name")}</h3>
          <span className="shrink-0 text-sm tabular-nums">
            {onSale ? (
              <span className="me-1 text-muted-foreground line-through">
                {formatMoney(base, currency)}
              </span>
            ) : null}
            {formatMoney(price, currency)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{pick(product, "tagline")}</p>
      </Link>
      <Link
        to="/customize"
        search={{ product: product.slug }}
        className="mt-3 flex min-h-11 items-center justify-center border border-ink text-xs tracking-[0.2em] uppercase active:bg-ink active:text-cream"
      >
        {t("customize")}
      </Link>
    </article>
  );
}