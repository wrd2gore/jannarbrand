import { SIZE_CHART, MOCKUPS, type Garment } from "@/lib/catalog";

export function SizeGuide({ garment }: { garment: Garment }) {
  const rows = SIZE_CHART[garment];
  return (
    <section className="mt-14">
      <h2 className="text-2xl">Size &amp; Dimensions</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        A = total length, B = chest width. Measured flat in centimetres, ±2cm tolerance.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <div className="relative overflow-hidden rounded-lg bg-ink">
          <img
            src={MOCKUPS[garment].black.front}
            alt={`${garment} measurement diagram`}
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-w-full"
          />
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <line
              x1="50"
              y1="20"
              x2="50"
              y2="82"
              stroke="#fff"
              strokeWidth="0.6"
              strokeDasharray="3 2.5"
            />
            <line
              x1="22"
              y1="42"
              x2="78"
              y2="42"
              stroke="#fff"
              strokeWidth="0.6"
              strokeDasharray="3 2.5"
            />
            <text x="52" y="18" fill="#fff" fontSize="7" fontWeight="700">
              A
            </text>
            <text x="80" y="40" fill="#fff" fontSize="7" fontWeight="700">
              B
            </text>
          </svg>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-0 border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-cream">
                <th className="px-3 py-2 text-left text-xs tracking-[0.2em] uppercase">Size</th>
                <th className="px-3 py-2 text-right text-xs tracking-[0.2em] uppercase">A</th>
                <th className="px-3 py-2 text-right text-xs tracking-[0.2em] uppercase">B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.size} className="border-t border-border">
                  <td className="px-3 py-2.5 font-semibold">{r.size}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.a}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}