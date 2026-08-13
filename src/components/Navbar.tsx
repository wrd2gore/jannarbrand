import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import wordmark from "@/assets/jannar-wordmark.png";
import { Flag } from "./Flag";
import { useCountries } from "@/lib/data";
import { setRegion, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useIsAdmin, useSession } from "@/lib/auth";

export function Navbar() {
  const { t, pick, lang, setLang } = useI18n();
  const { cart, region } = useStore();
  const { data: countries } = useCountries();
  const { user } = useSession();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const [openCountry, setOpenCountry] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const current = countries?.find((c) => c.code === region) ?? countries?.[0];
  const count = cart.reduce((n, i) => n + i.qty, 0);

  const links = (
    <>
      <Link to="/shop" className="py-2 text-xs tracking-[0.2em] uppercase" onClick={() => setOpenMenu(false)}>
        {t("shop")}
      </Link>
      <Link to="/customize" className="py-2 text-xs tracking-[0.2em] uppercase" onClick={() => setOpenMenu(false)}>
        {t("customize")}
      </Link>
      <Link to="/account" className="py-2 text-xs tracking-[0.2em] uppercase" onClick={() => setOpenMenu(false)}>
        {t("account")}
      </Link>
      {isAdmin ? (
        <Link to="/admin" className="py-2 text-xs tracking-[0.2em] uppercase" onClick={() => setOpenMenu(false)}>
          {t("admin")}
        </Link>
      ) : null}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="-ms-2 p-2 md:hidden"
          aria-label={t("menu")}
          onClick={() => setOpenMenu((v) => !v)}
        >
          {openMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="shrink-0">
          <img src={wordmark} alt="JANNAR" width={470} height={235} className="h-6 w-auto" />
        </Link>

        <nav className="ms-6 hidden items-center gap-6 md:flex">{links}</nav>

        <div className="ms-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="min-h-9 rounded border border-border px-2 text-xs tracking-[0.15em] uppercase"
            aria-label={t("language")}
          >
            {lang === "en" ? "ع" : "EN"}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenCountry((v) => !v)}
              className="flex min-h-9 items-center gap-1 rounded border border-border px-2"
              aria-label={t("country")}
            >
              <Flag code={current?.code ?? "PS"} />
              <ChevronDown className="h-3 w-3" />
            </button>
            {openCountry ? (
              <ul className="absolute end-0 z-50 mt-1 w-44 border border-border bg-background shadow-lg">
                {(countries ?? []).map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setRegion(c.code);
                        setOpenCountry(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm hover:bg-secondary"
                    >
                      <Flag code={c.code} />
                      {pick(c, "name")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <Link to="/cart" className="relative p-2" aria-label={t("cart")}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -end-0.5 -top-0.5 min-w-4 rounded-full bg-ink px-1 text-center text-[10px] leading-4 text-cream">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {openMenu ? (
        <nav className="flex flex-col border-t border-border px-4 py-2 md:hidden">{links}</nav>
      ) : null}
    </header>
  );
}