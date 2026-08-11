import { Link } from "@tanstack/react-router";
import badge from "@/assets/jannar-badge.png";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src={badge} alt="JANNAR" width={512} height={512} loading="lazy" className="h-10 w-10" />
          <p className="text-xs tracking-[0.2em] uppercase opacity-70">
            Streetwear made in Palestine
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-[0.2em] uppercase">
          <Link to="/shop" className="opacity-70 hover:opacity-100">
            Shop
          </Link>
          <Link to="/customize" className="opacity-70 hover:opacity-100">
            Customize
          </Link>
          <Link to="/cart" className="opacity-70 hover:opacity-100">
            Cart
          </Link>
          <Link to="/account" className="opacity-70 hover:opacity-100">
            Account
          </Link>
        </nav>
      </div>
      <p className="border-t border-border/30 px-4 py-4 text-center text-[11px] opacity-50">
        © {new Date().getFullYear()} JANNAR. All rights reserved.
      </p>
    </footer>
  );
}