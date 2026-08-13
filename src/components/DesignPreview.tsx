import type { CSSProperties } from "react";
import type { DesignElement } from "@/lib/design";
import type { Rect } from "@/lib/types";

type Props = {
  image: string;
  area: Rect;
  elements: DesignElement[];
  alt?: string;
  showArea?: boolean;
  eager?: boolean;
  className?: string;
};

/** Garment mockup with the design placed strictly inside the printable area. */
export function DesignPreview({
  image,
  area,
  elements,
  alt = "",
  showArea,
  eager,
  className = "",
}: Props) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden bg-secondary ${className}`}>
      {image ? (
        <img
          src={image}
          alt={alt}
          width={1024}
          height={1024}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : null}
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.w}%`,
          height: `${area.h}%`,
          containerType: "inline-size",
          outline: showArea ? "1px dashed rgba(190,190,190,.85)" : undefined,
        }}
      >
        {elements.map((el) => (
          <ElementView key={el.id} el={el} />
        ))}
      </div>
    </div>
  );
}

export function elementStyle(el: DesignElement): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    left: `${el.x}%`,
    top: `${el.y}%`,
    transform: `translate(-50%,-50%) rotate(${el.rotation}deg)`,
    transformOrigin: "center",
  };
  if (el.kind === "image") return { ...base, width: `${el.w}%`, height: "auto" };
  return {
    ...base,
    fontFamily: el.font,
    color: el.color,
    fontWeight: el.bold ? 700 : 400,
    fontStyle: el.italic ? "italic" : "normal",
    textAlign: el.align,
    fontSize: `${el.w}cqw`,
    lineHeight: 1.15,
    whiteSpace: "pre",
    maxWidth: "none",
  };
}

export function ElementView({ el }: { el: DesignElement }) {
  const style = elementStyle(el);
  if (el.kind === "image") {
    return <img src={el.src} alt="" style={style} className="pointer-events-none select-none" />;
  }
  return (
    <div style={style} className="pointer-events-none select-none">
      {el.text}
    </div>
  );
}