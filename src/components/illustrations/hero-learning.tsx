export function HeroLearning({ primaryColor = "#f97316", secondaryColor = "#facc15" }: { primaryColor?: string; secondaryColor?: string }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Background shape */}
      <rect x="50" y="30" width="400" height="300" rx="24" fill={primaryColor} opacity="0.08" />

      {/* Desk */}
      <rect x="120" y="220" width="260" height="12" rx="6" fill={primaryColor} opacity="0.3" />
      <rect x="140" y="232" width="8" height="50" rx="4" fill={primaryColor} opacity="0.2" />
      <rect x="352" y="232" width="8" height="50" rx="4" fill={primaryColor} opacity="0.2" />

      {/* Monitor */}
      <rect x="200" y="100" width="100" height="70" rx="8" fill={primaryColor} opacity="0.15" stroke={primaryColor} strokeWidth="2" />
      <rect x="208" y="108" width="84" height="50" rx="4" fill="white" opacity="0.1" />
      <rect x="240" y="170" width="20" height="20" rx="2" fill={primaryColor} opacity="0.3" />
      <rect x="230" y="188" width="40" height="4" rx="2" fill={primaryColor} opacity="0.2" />

      {/* Screen content lines */}
      <rect x="216" y="116" width="50" height="4" rx="2" fill={secondaryColor} opacity="0.6" />
      <rect x="216" y="126" width="60" height="3" rx="1.5" fill="white" opacity="0.15" />
      <rect x="216" y="134" width="45" height="3" rx="1.5" fill="white" opacity="0.15" />
      <rect x="216" y="142" width="55" height="3" rx="1.5" fill="white" opacity="0.1" />

      {/* Person sitting */}
      {/* Chair */}
      <rect x="155" y="180" width="30" height="60" rx="8" fill={primaryColor} opacity="0.2" />
      <rect x="160" y="240" width="20" height="15" rx="3" fill={primaryColor} opacity="0.25" />

      {/* Body */}
      <circle cx="170" cy="150" r="18" fill={primaryColor} opacity="0.4" />
      <rect x="155" y="168" width="30" height="40" rx="10" fill={primaryColor} opacity="0.3" />

      {/* Arm reaching to desk */}
      <rect x="180" y="180" width="50" height="6" rx="3" fill={primaryColor} opacity="0.35" transform="rotate(-20 180 180)" />

      {/* Laptop on desk (second person remote) */}
      <rect x="320" y="140" width="60" height="40" rx="4" fill={secondaryColor} opacity="0.2" stroke={secondaryColor} strokeWidth="1.5" />
      <rect x="310" y="180" width="80" height="6" rx="3" fill={secondaryColor} opacity="0.15" />

      {/* Video call faces on second laptop */}
      <circle cx="340" cy="155" r="8" fill={secondaryColor} opacity="0.4" />
      <circle cx="360" cy="155" r="8" fill={primaryColor} opacity="0.3" />

      {/* Floating elements - code brackets */}
      <text x="80" y="80" fontSize="24" fill={primaryColor} opacity="0.3" fontFamily="monospace">{"</>"}</text>
      <text x="400" y="60" fontSize="20" fill={secondaryColor} opacity="0.3" fontFamily="monospace">{"{}"}</text>

      {/* Floating shapes */}
      <circle cx="100" cy="120" r="4" fill={secondaryColor} opacity="0.2" />
      <circle cx="420" cy="140" r="3" fill={primaryColor} opacity="0.2" />
      <rect x="380" y="200" width="6" height="6" rx="1" fill={secondaryColor} opacity="0.15" transform="rotate(45 383 203)" />

      {/* Certificate/badge floating */}
      <rect x="400" y="100" width="30" height="24" rx="4" fill={secondaryColor} opacity="0.15" stroke={secondaryColor} strokeWidth="1" />
      <circle cx="415" cy="112" r="6" fill={secondaryColor} opacity="0.3" />

      {/* Books on desk */}
      <rect x="280" y="200" width="15" height="20" rx="2" fill={primaryColor} opacity="0.2" />
      <rect x="285" y="196" width="15" height="20" rx="2" fill={secondaryColor} opacity="0.15" />
    </svg>
  );
}
