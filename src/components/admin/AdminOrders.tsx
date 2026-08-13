import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/data";
import { Button } from "./ui";

const STATUSES = ["pending", "confirmed", "printing", "shipped", "delivered", "cancelled"];

export function AdminOrders() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const items = useQuery({
    queryKey: ["admin-order-items", openId],
    enabled: !!openId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", openId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div className="space-y-3">
      {(orders.data ?? []).map((o) => (
        <div key={o.id} className="border border-border p-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">#{o.order_number}</span>
            <span>{o.customer_name}</span>
            <span className="text-muted-foreground">{o.phone}</span>
            <span className="text-muted-foreground">{o.country_code}</span>
            <span className="tabular-nums">{formatMoney(Number(o.total), o.currency)}</span>
            <select
              value={o.status}
              onChange={(e) => setStatus(o.id, e.target.value)}
              className="ms-auto min-h-10 border border-border bg-background px-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
              Items
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {o.email} · {o.address}, {o.city} · {new Date(o.created_at).toLocaleString()}
          </p>
          {openId === o.id ? (
            <ul className="mt-3 space-y-1 text-sm">
              {(items.data ?? []).map((i) => (
                <li key={i.id} className="flex justify-between gap-2 border-t border-border pt-1">
                  <span>
                    {i.product_name} · {i.color} · {i.size} × {i.qty}
                  </span>
                  <span className="tabular-nums">{formatMoney(Number(i.unit_price), o.currency)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      {orders.data && !orders.data.length ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : null}
    </div>
  );
}