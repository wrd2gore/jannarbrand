import { useI18n } from "@/lib/i18n";
import { productImage, type Product } from "@/lib/types";

export function SizeGuide({ product }: { product: Product }) {
  const { t } = useI18n();
  const rows = product.size_chart ?? [];
  if (!rows.length) return null;
  const color = product.colors?.[0]?.key ?? "black";

  return (
    <section className="mt-14">
      <h2 className="text-2xl">{t("sizeGuide")}</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t("sizeGuideNote")}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-start">
        <div className="relative overflow-hidden rounded-lg bg-ink">
          <img
            src={productImage(product, color, "front")}
            alt=""
            width={1024}
            height={1024}
            loading="lazy"
            className="h-auto w-full"
          />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <line x1="50" y1="20" x2="50" y2="82" stroke="#fff" strokeWidth="0.6" strokeDasharray="3 2.5" />
            <line x1="22" y1="42" x2="78" y2="42" stroke="#fff" strokeWidth="0.6" strokeDasharray="3 2.5" />
            <text x="52" y="18" fill="#fff" fontSize="7" fontWeight="700">A</text>
            <text x="80" y="40" fill="#fff" fontSize="7" fontWeight="700">B</text>
          </svg>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-cream">
                <th className="px-3 py-2 text-start text-xs tracking-[0.2em] uppercase">{t("size")}</th>
                <th className="px-3 py-2 text-end text-xs tracking-[0.2em] uppercase">A</th>
                <th className="px-3 py-2 text-end text-xs tracking-[0.2em] uppercase">B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.size} className="border-t border-border">
                  <td className="px-3 py-2.5 font-semibold">{r.size}</td>
                  <td className="px-3 py-2.5 text-end tabular-nums">{r.a}</td>
                  <td className="px-3 py-2.5 text-end tabular-nums">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}