import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/auth";
import { formatMoney } from "@/lib/data";

const title = "Account & Orders — JANNAR";
const description = "Sign in to track your JANNAR orders and manage your details.";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

function Account() {
  const { t } = useI18n();
  const { user, ready } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const orders = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, currency, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const auth = async (mode: "in" | "up") => {
    setBusy(true);
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });
    const { error } = await fn;
    setBusy(false);
    if (error) toast.error(error.message);
  };

  const google = async () => {
    const { lovable } = await import("@/integrations/lovable/index");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Sign-in failed");
  };

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16 text-sm">{t("loading")}</p>;

  if (!user)
    return (
      <div className="mx-auto max-w-sm px-4 py-14">
        <h1 className="text-3xl">{t("signIn")}</h1>
        <div className="mt-6 space-y-3">
          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 w-full border border-border bg-background px-3 text-sm"
          />
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-12 w-full border border-border bg-background px-3 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => auth("in")}
            className="min-h-12 w-full bg-ink text-xs tracking-[0.2em] text-cream uppercase"
          >
            {t("signIn")}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => auth("up")}
            className="min-h-12 w-full border border-ink text-xs tracking-[0.2em] uppercase"
          >
            {t("signUp")}
          </button>
          <button
            type="button"
            onClick={google}
            className="min-h-12 w-full border border-border text-xs tracking-[0.2em] uppercase"
          >
            Google
          </button>
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl">{t("account")}</h1>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="min-h-11 border border-border px-4 text-xs tracking-[0.2em] uppercase"
        >
          {t("signOut")}
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>

      <h2 className="mt-8 text-xs tracking-[0.2em] uppercase">{t("orders")}</h2>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {(orders.data ?? []).map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span>#{o.order_number}</span>
            <span className="text-muted-foreground">{o.status}</span>
            <span className="tabular-nums">{formatMoney(Number(o.total), o.currency)}</span>
          </li>
        ))}
        {orders.data && !orders.data.length ? (
          <li className="py-4 text-sm text-muted-foreground">—</li>
        ) : null}
      </ul>
    </div>
  );
}