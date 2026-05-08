type Shape = "blob" | "wave" | "lattice" | "burst";

interface Props {
  bg: string;
  accent: string;
  shape: Shape;
  size?: number;
}

// Faceless, abstract illustrations — geometric, playful, no human form.
export function FounderIllustration({ bg, accent, shape, size = 64 }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {shape === "blob" && (
          <g>
            <path
              d="M44 14c8 5 12 16 7 26-5 9-19 12-28 6-9-6-10-19-3-27 6-7 16-9 24-5z"
              fill={accent}
              opacity="0.35"
            />
            <circle cx="42" cy="22" r="8" fill={accent} />
            <circle cx="22" cy="42" r="5" fill={accent} opacity="0.7" />
          </g>
        )}
        {shape === "wave" && (
          <g>
            <path
              d="M0 40c8-6 16-6 24 0s16 6 24 0 16-6 24 0v24H0z"
              fill={accent}
              opacity="0.4"
            />
            <path
              d="M0 48c8-4 16-4 24 0s16 4 24 0 16-4 24 0v16H0z"
              fill={accent}
            />
            <circle cx="48" cy="20" r="6" fill={accent} />
          </g>
        )}
        {shape === "lattice" && (
          <g stroke={accent} strokeWidth="2" fill="none" opacity="0.85">
            <path d="M8 20h48M8 32h48M8 44h48" />
            <path d="M20 8v48M32 8v48M44 8v48" />
            <circle cx="32" cy="32" r="6" fill={accent} stroke="none" />
          </g>
        )}
        {shape === "burst" && (
          <g>
            <g stroke={accent} strokeWidth="2" strokeLinecap="round">
              <line x1="32" y1="6" x2="32" y2="14" />
              <line x1="32" y1="50" x2="32" y2="58" />
              <line x1="6" y1="32" x2="14" y2="32" />
              <line x1="50" y1="32" x2="58" y2="32" />
              <line x1="14" y1="14" x2="20" y2="20" />
              <line x1="44" y1="44" x2="50" y2="50" />
              <line x1="50" y1="14" x2="44" y2="20" />
              <line x1="20" y1="44" x2="14" y2="50" />
            </g>
            <circle cx="32" cy="32" r="10" fill={accent} />
            <circle cx="32" cy="32" r="4" fill={bg} />
          </g>
        )}
      </svg>
    </div>
  );
}
