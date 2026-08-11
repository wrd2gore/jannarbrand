import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import wordmark from "@/assets/jannar-wordmark.png";
import { PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

const title = "JANNAR — Custom Print Streetwear Tees & Hoodies";
const description =
  "Upload your own artwork, add custom text, and print it on heavyweight tees and hoodies. Streetwear made in Palestine.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="relative bg-ink text-cream">
        <img
          src={hero}
          alt="Model wearing an oversized black JANNAR tee"
          width={1280}
          height={1600}
          fetchPriority="high"
          decoding="async"
          className="h-[68vh] max-h-[620px] w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <img src={wordmark} alt="JANNAR" width={470} height={235} className="w-56 sm:w-72" />
          <h1 className="mt-5 text-3xl leading-none sm:text-5xl">Custom prints. Your style.</h1>
          <p className="mt-3 max-w-md text-sm opacity-80">
            Heavyweight blanks. Your image, your text — front and back.
          </p>
          <div className="mt-7 flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              to="/shop"
              search={{ type: "tee" }}
              className="flex min-h-12 items-center justify-center bg-cream px-6 text-xs tracking-[0.2em] text-ink uppercase"
            >
              Shop shirts
            </Link>
            <Link
              to="/shop"
              search={{ type: "hoodie" }}
              className="flex min-h-12 items-center justify-center border border-cream px-6 text-xs tracking-[0.2em] uppercase"
            >
              Shop hoodies
            </Link>
            <Link
              to="/customize"
              className="flex min-h-12 items-center justify-center border border-cream/40 px-6 text-xs tracking-[0.2em] uppercase"
            >
              Create design
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl">Latest drops</h2>
          <Link to="/shop" className="text-xs tracking-[0.2em] uppercase underline underline-offset-4">
            All products
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
          {[
            ["01 / Pick a blank", "Tee or hoodie, black or cream, S to XXXL."],
            ["02 / Design it", "Upload artwork or set custom text — front and back independently."],
            ["03 / We print it", "Durable DTG print, shipped across the region."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="text-sm tracking-[0.2em]">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
