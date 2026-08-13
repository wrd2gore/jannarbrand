import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import wordmark from "@/assets/jannar-wordmark.png";
import { ProductCard } from "@/components/ProductCard";
import { useContent, useCountries, usePrices, useProducts } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, pick } = useI18n();
  const { region } = useStore();
  const { data: products } = useProducts();
  const { data: prices } = usePrices();
  const { data: countries } = useCountries();
  const { data: content } = useContent();
  const country = countries?.find((c) => c.code === region) ?? countries?.[0];
  const get = (key: string, fallback: string) =>
    pick(content?.find((c) => c.key === key), "value") || fallback;

  return (
    <div>
      <section className="relative bg-ink text-cream">
        <img
          src={hero}
          alt=""
          width={1280}
          height={1600}
          fetchPriority="high"
          className="h-[68vh] max-h-[620px] w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <img src={wordmark} alt="JANNAR" width={470} height={235} className="w-56 sm:w-72" />
          <h1 className="mt-5 text-3xl leading-none sm:text-5xl">
            {get("hero_title", "Custom prints. Your style.")}
          </h1>
          <p className="mt-3 max-w-md text-sm opacity-80">
            {get("hero_subtitle", "Heavyweight blanks. Your image, your text — front and back.")}
          </p>
          <div className="mt-7 flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              to="/shop"
              className="flex min-h-12 items-center justify-center bg-cream px-6 text-xs tracking-[0.2em] text-ink uppercase"
            >
              {t("shop")}
            </Link>
            <Link
              to="/customize"
              className="flex min-h-12 items-center justify-center border border-cream px-6 text-xs tracking-[0.2em] uppercase"
            >
              {t("startCustomizing")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl">{t("latestDrops")}</h2>
          <Link to="/shop" className="text-xs tracking-[0.2em] uppercase underline underline-offset-4">
            {t("allProducts")}
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(products ?? []).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} prices={prices} country={country} />
          ))}
        </div>
      </section>
    </div>
  );
}