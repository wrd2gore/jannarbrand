import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { useContent } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const INSTAGRAM = "https://www.instagram.com/jannar.brand/?hl=en";
const TIKTOK = "https://www.tiktok.com/@jannar24";

function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 2h-2.9v13.2a2.5 2.5 0 1 1-2.5-2.5c.2 0 .4 0 .6.1V9.8a5.6 5.6 0 1 0 4.9 5.5V8.9a6.6 6.6 0 0 0 3.9 1.3V7.3a3.8 3.8 0 0 1-3.9-3.7V2Z" />
    </svg>
  );
}

export function Footer() {
  const { t, pick, lang } = useI18n();
  const { data: content } = useContent();
  const get = (key: string) => pick(content?.find((c) => c.key === key), "value");
  const instagram = get("social_instagram") || INSTAGRAM;
  const tiktok = get("social_tiktok") || TIKTOK;

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <h2 className="text-sm tracking-[0.25em] uppercase">JANNAR</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {get("footer_blurb") ||
              (lang === "ar"
                ? "ستريت وير مصنوع في فلسطين. صمّم قطعتك الخاصة."
                : "Streetwear made in Palestine. Print your own design.")}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={tiktok}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/shop">{t("shop")}</Link>
          <Link to="/customize">{t("customize")}</Link>
          <Link to="/cart">{t("cart")}</Link>
          <Link to="/account">{t("account")}</Link>
        </nav>

        <div className="text-sm">
          <h3 className="text-xs tracking-[0.25em] uppercase">{t("contact")}</h3>
          <p className="mt-2 text-muted-foreground">{get("contact_email") || "hello@jannar.store"}</p>
          <p className="mt-1 text-muted-foreground">{get("contact_phone")}</p>
        </div>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} JANNAR
      </p>
    </footer>
  );
}