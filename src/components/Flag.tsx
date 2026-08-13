type Props = { code: string; className?: string };

/** Lightweight inline SVG flags — no emoji, no image downloads. */
export function Flag({ code, className = "h-4 w-6" }: Props) {
  const common = "block rounded-[2px] object-cover " + className;
  switch (code) {
    case "PS":
      return (
        <svg viewBox="0 0 30 20" className={common} aria-hidden="true">
          <rect width="30" height="20" fill="#fff" />
          <rect width="30" height="6.67" fill="#000" />
          <rect y="13.33" width="30" height="6.67" fill="#007a3d" />
          <path d="M0 0l12 10L0 20z" fill="#ce1126" />
        </svg>
      );
    case "JO":
      return (
        <svg viewBox="0 0 30 20" className={common} aria-hidden="true">
          <rect width="30" height="6.67" fill="#000" />
          <rect y="6.67" width="30" height="6.66" fill="#fff" />
          <rect y="13.33" width="30" height="6.67" fill="#007a3d" />
          <path d="M0 0l12 10L0 20z" fill="#ce1126" />
          <path
            d="M4.6 8.3l.55 1.2 1.3.1-1 .85.32 1.28-1.17-.7-1.17.7.32-1.28-1-.85 1.3-.1z"
            fill="#fff"
          />
        </svg>
      );
    case "EG":
      return (
        <svg viewBox="0 0 30 20" className={common} aria-hidden="true">
          <rect width="30" height="6.67" fill="#ce1126" />
          <rect y="6.67" width="30" height="6.66" fill="#fff" />
          <rect y="13.33" width="30" height="6.67" fill="#000" />
          <circle cx="15" cy="10" r="2.2" fill="#c09300" />
        </svg>
      );
    default:
      return <span className={common} />;
  }
}