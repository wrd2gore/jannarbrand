import { MOCKUPS, PRINT_AREA, type ColorKey, type Garment, type Side } from "@/lib/catalog";
import type { DesignElement } from "@/lib/design";

type Props = {
  garment: Garment;
  color: ColorKey;
  side: Side;
  elements: DesignElement[];
  showArea?: boolean;
  eager?: boolean;
  className?: string;
};

/** Renders a garment mockup with the design elements placed inside the print area. */
export function DesignPreview({
  garment,
  color,
  side,
  elements,
  showArea,
  eager,
  className = "",
}: Props) {
  const area = PRINT_AREA[garment];
  return (
    <div className={`relative aspect-square w-full overflow-hidden bg-secondary ${className}`}>
      <img
        src={MOCKUPS[garment][color][side]}
        alt={`${garment} ${color} ${side}`}
        width={1024}
        height={1024}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
      <div
        className="absolute"
        style={{
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.w}%`,
          height: `${area.h}%`,
          containerType: "inline-size",
          outline: showArea ? "1px dashed rgba(160,160,160,.8)" : undefined,
        }}
      >
        {elements.map((el) => (
          <ElementView key={el.id} el={el} />
        ))}
      </div>
    </div>
  );
}

export function ElementView({ el }: { el: DesignElement }) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${el.x}%`,
    top: `${el.y}%`,
    width: `${el.w}%`,
    transform: `translate(-50%,-50%) rotate(${el.rotation}deg)`,
    transformOrigin: "center",
  };
  if (el.kind === "image") {
    return <img src={el.src} alt="" style={style} className="pointer-events-none select-none" />;
  }
  return (
    <div
      style={{
        ...style,
        fontFamily: el.font,
        color: el.color,
        fontWeight: el.bold ? 700 : 400,
        fontStyle: el.italic ? "italic" : "normal",
        textAlign: el.align,
        fontSize: `${el.w / 4}cqw`,
        lineHeight: 1.1,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
      className="pointer-events-none select-none"
    >
      {el.text}
    </div>
  );
}