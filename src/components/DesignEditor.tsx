import { useRef, useState } from "react";
import { Trash2, Image as ImageIcon, Type, RotateCw } from "lucide-react";
import { MOCKUPS, PRINT_AREA, type ColorKey, type Garment, type Side } from "@/lib/catalog";
import { FONTS, type Design, type DesignElement } from "@/lib/design";
import { ElementView } from "./DesignPreview";

type Props = {
  garment: Garment;
  color: ColorKey;
  side: Side;
  design: Design;
  onChange: (design: Design) => void;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const uid = () => Math.random().toString(36).slice(2, 9);

export function DesignEditor({ garment, color, side, design, onChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const pinch = useRef<{ id: string; dist: number; w: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const elements = design[side];
  const area = PRINT_AREA[garment];
  const active = elements.find((e) => e.id === selected) ?? null;

  const update = (id: string, patch: Partial<DesignElement>) =>
    onChange({
      ...design,
      [side]: elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });

  const add = (el: DesignElement) => {
    onChange({ ...design, [side]: [...elements, el] });
    setSelected(el.id);
  };

  const remove = (id: string) => {
    onChange({ ...design, [side]: elements.filter((e) => e.id !== id) });
    setSelected(null);
  };

  const pct = (clientX: number, clientY: number) => {
    const box = areaRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - box.left) / box.width) * 100,
      y: ((clientY - box.top) / box.height) * 100,
    };
  };

  const onPointerDown = (e: React.PointerEvent, el: DesignElement) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setSelected(el.id);
    const p = pct(e.clientX, e.clientY);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { id: el.id, dist: Math.hypot(a.x - b.x, a.y - b.y), w: el.w };
      drag.current = null;
    } else {
      drag.current = { id: el.id, dx: p.x - el.x, dy: p.y - el.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      update(pinch.current.id, {
        w: clamp((pinch.current.w * d) / pinch.current.dist, 8, 100),
      });
      return;
    }
    if (!drag.current) return;
    const p = pct(e.clientX, e.clientY);
    update(drag.current.id, {
      x: clamp(p.x - drag.current.dx, 4, 96),
      y: clamp(p.y - drag.current.dy, 4, 96),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      add({
        id: uid(),
        kind: "image",
        src: String(reader.result),
        x: 50,
        y: 50,
        w: 60,
        rotation: 0,
      });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden bg-secondary select-none">
        <img
          src={MOCKUPS[garment][color][side]}
          alt={`${garment} ${side}`}
          width={1024}
          height={1024}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div
          ref={areaRef}
          className="absolute touch-none"
          style={{
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.w}%`,
            height: `${area.h}%`,
            containerType: "inline-size",
            outline: "1px dashed rgba(150,150,150,.9)",
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {elements.map((el) => (
            <div
              key={el.id}
              onPointerDown={(e) => onPointerDown(e, el)}
              className="absolute cursor-grab touch-none"
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.w}%`,
                transform: `translate(-50%,-50%) rotate(${el.rotation}deg)`,
                outline: selected === el.id ? "1px solid #4ea3ff" : undefined,
                outlineOffset: 2,
                padding: 2,
              }}
            >
              <div className="relative w-full">
                <ElementView
                  el={{ ...el, x: 50, y: 50, w: 100, rotation: 0 }}
                />
              </div>
            </div>
          ))}
        </div>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Printable area
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 border border-border bg-card text-sm tracking-[0.15em] uppercase active:bg-secondary"
        >
          <ImageIcon size={16} /> Add image
        </button>
        <button
          type="button"
          onClick={() =>
            add({
              id: uid(),
              kind: "text",
              text: "JANNAR",
              x: 50,
              y: 50,
              w: 70,
              rotation: 0,
              font: FONTS[0].value,
              color: "#efe6cf",
              align: "center",
            })
          }
          className="flex min-h-12 flex-1 items-center justify-center gap-2 border border-border bg-card text-sm tracking-[0.15em] uppercase active:bg-secondary"
        >
          <Type size={16} /> Add text
        </button>
      </div>

      {active && (
        <div className="mt-4 space-y-4 border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.2em] uppercase">
              {active.kind === "text" ? "Text" : "Image"} settings
            </span>
            <button
              type="button"
              onClick={() => remove(active.id)}
              aria-label="Delete element"
              className="flex min-h-11 items-center gap-1 px-2 text-sm text-destructive"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>

          {active.kind === "text" && (
            <>
              <textarea
                value={active.text}
                onChange={(e) => update(active.id, { text: e.target.value })}
                rows={2}
                className="w-full resize-none border border-border bg-background p-3 text-sm"
                placeholder="Your text"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={active.font}
                  onChange={(e) => update(active.id, { font: e.target.value })}
                  className="min-h-11 border border-border bg-background px-2 text-sm"
                >
                  {FONTS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <select
                  value={active.align}
                  onChange={(e) =>
                    update(active.id, { align: e.target.value as DesignElement["align"] })
                  }
                  className="min-h-11 border border-border bg-background px-2 text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => update(active.id, { bold: !active.bold })}
                  className={`min-h-11 min-w-11 border border-border px-3 font-bold ${active.bold ? "bg-ink text-cream" : "bg-background"}`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => update(active.id, { italic: !active.italic })}
                  className={`min-h-11 min-w-11 border border-border px-3 italic ${active.italic ? "bg-ink text-cream" : "bg-background"}`}
                >
                  I
                </button>
                <label className="flex min-h-11 items-center gap-2 border border-border px-3 text-sm">
                  Color
                  <input
                    type="color"
                    value={active.color}
                    onChange={(e) => update(active.id, { color: e.target.value })}
                    className="h-6 w-8 border-0 bg-transparent p-0"
                  />
                </label>
              </div>
            </>
          )}

          <label className="block text-xs tracking-[0.2em] uppercase">
            Size
            <input
              type="range"
              min={10}
              max={100}
              value={active.w}
              onChange={(e) => update(active.id, { w: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </label>
          <label className="block text-xs tracking-[0.2em] uppercase">
            <span className="inline-flex items-center gap-1">
              <RotateCw size={12} /> Rotation
            </span>
            <input
              type="range"
              min={-180}
              max={180}
              value={active.rotation}
              onChange={(e) => update(active.id, { rotation: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </label>
        </div>
      )}

      {!active && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Tap an element to edit it. Drag to move, pinch to resize.
        </p>
      )}
    </div>
  );
}