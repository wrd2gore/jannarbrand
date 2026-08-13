import type { ReactNode } from "react";

export const inputClass =
  "min-h-11 w-full border border-border bg-background px-3 text-sm";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs tracking-wide text-muted-foreground uppercase">
      {label}
      <div className="mt-1 normal-case">{children}</div>
    </label>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border p-4">
      <h2 className="text-xs tracking-[0.2em] uppercase">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = "solid",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 px-4 text-xs tracking-[0.2em] uppercase disabled:opacity-50 ${
        variant === "solid" ? "bg-ink text-cream" : "border border-ink"
      }`}
    >
      {children}
    </button>
  );
}