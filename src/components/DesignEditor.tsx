import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Trash2, Image as ImageIcon, Type } from "lucide-react";
import { FONTS, type Design, type DesignElement } from "@/lib/design";
import type { Rect, Side } from "@/lib/types";
import { elementStyle } from "./DesignPreview";
import { useI18n } from "@/lib/i18n";

type Props = {
  image: string;
  area: Rect;
  side: Side;
  design: Design;
  onChange: (design: Design) => void;
};

const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Rotated bounding box of an element, in % of the print area. */
function aabb(w: number, h: number, rotation: number) {
  const rad = (rotation * Math.PI) / 180;
  const c = Math.abs(Math.cos(rad));
  const s = Math.abs(Math.sin(rad));
  return { W: w * c + h * s, H: w * s + h * c };
}

/** Returns a position/size guaranteed to sit fully inside the printable area. */
function fit(el: DesignElement, size: { w: number; h: number }) {
  if (!size.w || !size.h) return el;
  let scale = 1;
  const { W, H } = aabb(size.w, size.h, el.rotation);
  if (W > 100 || H > 100) scale = Math.min(100 / W, 100 / H);
  const box = aabb(size.w * scale, size.h * scale, el.rotation);
  return {
    ...el,
    w: el.w * scale,
    x: clamp(el.x, box.W / 2, 100 - box.W / 2),
    y: clamp(el.y, box.H / 2, 100 - box.H / 2),
  };
}

export function DesignEditor({ image, area, side, design, onChange }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const sizes = useRef(new Map<string, { w: number; h: number }>());
  const drag = useRef<{ id: string; startX: number; startY: number; ox: number; oy: number } | null>(
    null,
  );
  const pinch = useRef<{ id: string; dist: number; w: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const elements = design[side];
  const active = elements.find((e) => e.id === selected) ?? null;

  const measure = useCallback(() => {
    const box = areaRef.current?.getBoundingClientRect();
    if (!box || !box.width) return false;
    let changed = false;
    for (const el of elements) {
      const node = nodes.current.get(el.id);
      if (!node) continue;
      const next = {
        w: (node.offsetWidth / box.width) * 100,
        h: (node.offsetHeight / box.height) * 100,
      };
      const prev = sizes.current.get(el.id);
      if (!prev || Math.abs(prev.w - next.w) > 0.05 || Math.abs(prev.h - next.h) > 0.05) {
        sizes.current.set(el.id, next);
        changed = true;
      }
    }
    return changed;
  }, [elements]);

  /** After any render, re-measure and push elements back inside the printable box. */
  useLayoutEffect(() => {
    measure();
    let dirty = false;
    const next = elements.map((el) => {
      const size = sizes.current.get(el.id);
      if (!size) return el;
      const fixed = fit(el, size);
      if (
        Math.abs(fixed.x - el.x) > 0.05 ||
        Math.abs(fixed.y - el.y) > 0.05 ||
        Math.abs(fixed.w - el.w) > 0.05
      ) {
        dirty = true;
        return fixed;
      }
      return el;
    });
    if (dirty) onChange({ ...design, [side]: next });
  });

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  const update = (id: string, patch: Partial<DesignElement>) =>
    onChange({
      ...design,
      [side]: elements.map((e) => {
        if (e.id !== id) return e;
        const merged = { ...e, ...patch };
        return fit(merged, sizes.current.get(id) ?? { w: 0, h: 0 });
      }),
    });

  const add = (el: DesignElement) => {
    onChange({ ...design, [side]: [...elements, el] });
    setSelected(el.id);
  };

  const remove = (id: string) => {
    nodes.current.delete(id);
    sizes.current.delete(id);
    onChange({ ...design, [side]: elements.filter((e) => e.id !== id) });
    setSelected(null);
  };

  const onPointerDown = (e: React.PointerEvent, el: DesignElement) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setSelected(el.id);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      pinch.current = { id: el.id, dist: Math.hypot(a.x - b.x, a.y - b.y), w: el.w };
      drag.current = null;
      return;
    }
    drag.current = { id: el.id, startX: e.clientX, startY: e.clientY, ox: el.x, oy: el.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const box = areaRef.current?.getBoundingClientRect();
    if (!box) return;

    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const ratio = dist / (pinch.current.dist || 1);
      update(pinch.current.id, { w: clamp(pinch.current.w * ratio, 3, 100) });
      return;
    }

    const d = drag.current;
    if (!d) return;
    const dx = ((e.clientX - d.startX) / box.width) * 100;
    const dy = ((e.clientY - d.startY) / box.height) * 100;
    update(d.id, { x: d.ox + dx, y: d.oy + dy });
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () =>
      add({
        id: uid(),
        kind: "image",
        x: 50,
        y: 50,
        w: 60,
        rotation: 0,
        src: String(reader.result),
      });
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
      <div className="relative aspect-square w-full touch-none overflow-hidden bg-secondary select-none">
        {image ? (
          <img
            src={image}
            alt=""
            width={1024}
            height={1024}
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : null}
        <div
          ref={areaRef}
          className="absolute overflow-hidden"
          style={{
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.w}%`,
            height: `${area.h}%`,
            containerType: "inline-size",
            outline: "1px dashed rgba(210,210,210,.95)",
          }}
          onPointerDown={() => setSelected(null)}
        >
          {elements.map((el) => {
            const style = {
              ...elementStyle(el),
              cursor: "move",
              outline: selected === el.id ? "1.5px solid #4f7cff" : undefined,
            };
            const setNode = (node: HTMLElement | null) => {
              if (node) nodes.current.set(el.id, node);
            };
            const down = (e: React.PointerEvent) => {
              e.stopPropagation();
              onPointerDown(e, el);
            };
            if (el.kind === "image") {
              return (
                <img
                  key={el.id}
                  ref={setNode}
                  src={el.src}
                  alt=""
                  draggable={false}
                  style={style}
                  onPointerDown={down}
                  onPointerMove={onPointerMove}
                  onPointerUp={endPointer}
                  onPointerCancel={endPointer}
                />
              );
            }
            return (
              <div
                key={el.id}
                ref={setNode}
                style={style}
                onPointerDown={down}
                onPointerMove={onPointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
              >
                {el.text}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">{t("editorHint")}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-ink text-xs tracking-[0.15em] uppercase"
          >
            <ImageIcon className="h-4 w-4" /> {t("addImage")}
          </button>
          <button
            type="button"
            onClick={() =>
              add({
                id: uid(),
                kind: "text",
                x: 50,
                y: 50,
                w: 16,
                rotation: 0,
                text: "JANNAR",
                font: FONTS[0]!.value,
                color: "#ffffff",
                align: "center",
              })
            }
            className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-ink text-xs tracking-[0.15em] uppercase"
          >
            <Type className="h-4 w-4" /> {t("addText")}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />

        {active ? (
          <div className="space-y-3 border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.15em] uppercase">
                {active.kind === "text" ? t("textSettings") : t("imageSettings")}
              </span>
              <button
                type="button"
                onClick={() => remove(active.id)}
                aria-label={t("delete")}
                className="p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {active.kind === "text" ? (
              <>
                <textarea
                  value={active.text}
                  onChange={(e) => update(active.id, { text: e.target.value })}
                  rows={2}
                  dir="auto"
                  className="w-full border border-border bg-background p-2 text-sm"
                />
                <label className="block text-xs">
                  {t("font")}
                  <select
                    value={active.font}
                    onChange={(e) => update(active.id, { font: e.target.value })}
                    className="mt-1 min-h-11 w-full border border-border bg-background px-2 text-sm"
                  >
                    {FONTS.map((f) => (
                      <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={active.color}
                    onChange={(e) => update(active.id, { color: e.target.value })}
                    className="h-10 w-14 border border-border bg-background"
                    aria-label={t("color")}
                  />
                  <button
                    type="button"
                    onClick={() => update(active.id, { bold: !active.bold })}
                    className={`min-h-11 flex-1 border text-sm font-bold ${active.bold ? "bg-ink text-cream" : "border-border"}`}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => update(active.id, { italic: !active.italic })}
                    className={`min-h-11 flex-1 border text-sm italic ${active.italic ? "bg-ink text-cream" : "border-border"}`}
                  >
                    I
                  </button>
                </div>
              </>
            ) : null}

            <label className="block text-xs">
              {t("size")}
              <input
                type="range"
                min={3}
                max={100}
                step={0.5}
                value={active.w}
                onChange={(e) => update(active.id, { w: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </label>
            <label className="block text-xs">
              {t("rotation")}
              <input
                type="range"
                min={-180}
                max={180}
                value={active.rotation}
                onChange={(e) => update(active.id, { rotation: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}