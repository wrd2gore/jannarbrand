import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useContent, useCountries } from "@/lib/data";
import { Button, Field, Panel, inputClass } from "./ui";

export function AdminContent() {
  const qc = useQueryClient();
  const { data: content } = useContent();
  const groups = [...new Set((content ?? []).map((c) => c.group_name))];

  const save = async (key: string, value_en: string, value_ar: string) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value_en, value_ar }, { onConflict: "key" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Panel key={group} title={group}>
          {(content ?? [])
            .filter((c) => c.group_name === group)
            .map((row) => (
              <ContentRowForm key={row.key} row={row} onSave={save} />
            ))}
        </Panel>
      ))}
    </div>
  );
}

function ContentRowForm({
  row,
  onSave,
}: {
  row: { key: string; value_en: string; value_ar: string };
  onSave: (key: string, en: string, ar: string) => void;
}) {
  const [en, setEn] = useState(row.value_en);
  const [ar, setAr] = useState(row.value_ar);
  return (
    <div className="grid items-end gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
      <Field label={`${row.key} (EN)`}>
        <input value={en} onChange={(e) => setEn(e.target.value)} className={inputClass} />
      </Field>
      <Field label={`${row.key} (AR)`}>
        <input dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} className={inputClass} />
      </Field>
      <Button variant="outline" onClick={() => onSave(row.key, en, ar)}>
        Save
      </Button>
    </div>
  );
}

export function AdminCountries() {
  const qc = useQueryClient();
  const { data: countries } = useCountries();

  const save = async (code: string, values: Record<string, unknown>) => {
    const { error } = await supabase.from("countries").update(values as never).eq("code", code);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["countries"] });
  };

  return (
    <div className="space-y-4">
      {(countries ?? []).map((c) => (
        <CountryForm key={c.code} country={c} onSave={save} />
      ))}
    </div>
  );
}

function CountryForm({
  country,
  onSave,
}: {
  country: { code: string; name_en: string; name_ar: string; currency: string; shipping_cost: number; enabled: boolean };
  onSave: (code: string, values: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    name_en: country.name_en,
    name_ar: country.name_ar,
    currency: country.currency,
    shipping_cost: String(country.shipping_cost),
    enabled: country.enabled,
  });
  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Panel title={country.code}>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Name (EN)">
          <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Name (AR)">
          <input dir="rtl" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Currency">
          <input value={form.currency} onChange={(e) => set("currency", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Shipping cost">
          <input value={form.shipping_cost} onChange={(e) => set("shipping_cost", e.target.value)} className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} />
        Enabled
      </label>
      <Button
        onClick={() =>
          onSave(country.code, {
            name_en: form.name_en,
            name_ar: form.name_ar,
            currency: form.currency,
            shipping_cost: Number(form.shipping_cost),
            enabled: form.enabled,
          })
        }
      >
        Save
      </Button>
    </Panel>
  );
}

export function AdminPromos() {
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("10");

  const promos = useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promo_codes").select("*").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-promos"] });

  const create = async () => {
    const { error } = await supabase
      .from("promo_codes")
      .insert({ code: code.trim().toUpperCase(), discount_type: type, discount_value: Number(value) });
    if (error) {
      toast.error(error.message);
      return;
    }
    setCode("");
    refresh();
  };

  return (
    <div className="space-y-4">
      <Panel title="New promo code">
        <div className="grid items-end gap-3 sm:grid-cols-4">
          <Field label="Code">
            <input value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              <option value="percent">percent</option>
              <option value="fixed">fixed</option>
            </select>
          </Field>
          <Field label="Value">
            <input value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
          </Field>
          <Button onClick={create}>Add</Button>
        </div>
      </Panel>

      <ul className="space-y-2">
        {(promos.data ?? []).map((p) => (
          <li key={p.id} className="flex items-center gap-3 border border-border p-3 text-sm">
            <span className="font-semibold">{p.code}</span>
            <span>
              {p.discount_type === "percent" ? `${p.discount_value}%` : p.discount_value}
            </span>
            <label className="ms-auto flex items-center gap-2">
              <input
                type="checkbox"
                checked={p.active}
                onChange={async (e) => {
                  await supabase.from("promo_codes").update({ active: e.target.checked }).eq("id", p.id);
                  refresh();
                }}
              />
              active
            </label>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.from("promo_codes").delete().eq("id", p.id);
                refresh();
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}