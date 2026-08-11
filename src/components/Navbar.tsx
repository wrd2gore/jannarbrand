import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import wordmark from "@/assets/jannar-wordmark.png";
import { REGIONS, type RegionCode } from "@/lib/catalog";
import { setRegion, useStore } from "@/lib/store";
import { Flag } from "./Flag";

export function Navbar() {
  const { cart, region } = useStore();
  const [openRegion, setOpenRegion] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const current = REGIONS.find((r) => r.code === region) ?? REGIONS[0];

  useEffect(() => {
    if (!openRegion) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenRegion(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openRegion]);

  const links = [
    { to: "/shop", label: "Shop" },
    { to: "/customize", label: "Customize" },
    { to: "/account", label: "Account" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Menu"
            className="-ml-1 p-2 md:hidden"
            onClick={() => setOpenMenu((v) => !v)}
          >
            {openMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="shrink-0" aria-label="JANNAR home">
            <img src={wordmark} alt="JANNAR" width={470} height={235} className="h-7 w-auto" />
          </Link>
        </div>

        <nav className="hidden justify-center gap-8 text-xs tracking-[0.2em] uppercase md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="opacity-70 transition-opacity hover:opacity-100"
              activeProps={{ className: "opacity-100 underline underline-offset-8" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpenRegion((v) => !v)}
              aria-expanded={openRegion}
              aria-label={`Region: ${current.name}`}
              className="flex min-h-11 items-center gap-1.5 px-2"
            >
              <Flag code={current.code} className="h-4 w-6" />
              <span className="text-xs tracking-wider">{current.code}</span>
              <ChevronDown size={14} className={openRegion ? "rotate-180" : ""} />
            </button>
            <div
              className={`absolute right-0 top-full z-50 w-56 origin-top overflow-hidden border border-border bg-ink transition-transform duration-150 ${
                openRegion ? "scale-y-100" : "pointer-events-none scale-y-0"
              }`}
            >
              {REGIONS.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => {
                    setRegion(r.code as RegionCode);
                    setOpenRegion(false);
                  }}
                  className={`flex min-h-12 w-full items-center gap-3 px-3 text-left text-sm ${
                    r.code === region ? "bg-cream/15" : ""
                  }`}
                >
                  <Flag code={r.code} className="h-4 w-6 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{r.name}</span>
                  <span className="text-xs opacity-60">{r.code}</span>
                </button>
              ))}
            </div>
          </div>

          <Link to="/cart" aria-label="Cart" className="relative p-2">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-cream px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {openMenu && (
        <nav className="border-t border-border/40 px-4 pb-3 text-sm tracking-[0.2em] uppercase md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpenMenu(false)}
              className="block border-b border-border/20 py-3 last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}