export function CTACommunity({ primaryColor = "#f97316", secondaryColor = "#facc15" }: { primaryColor?: string; secondaryColor?: string }) {
  return (
    <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Background circle */}
      <circle cx="250" cy="150" r="120" fill={primaryColor} opacity="0.06" />

      {/* Central person */}
      <circle cx="250" cy="120" r="22" fill={primaryColor} opacity="0.5" />
      <rect x="230" y="142" width="40" height="50" rx="14" fill={primaryColor} opacity="0.4" />

      {/* Raised hand */}
      <rect x="270" y="110" width="8" height="30" rx="4" fill={primaryColor} opacity="0.5" />
      <circle cx="274" cy="106" r="5" fill={primaryColor} opacity="0.4" />

      {/* Left person */}
      <circle cx="160" cy="130" r="18" fill={secondaryColor} opacity="0.4" />
      <rect x="145" y="148" width="30" height="40" rx="10" fill={secondaryColor} opacity="0.3" />

      {/* Right person */}
      <circle cx="340" cy="130" r="18" fill={primaryColor} opacity="0.4" />
      <rect x="325" y="148" width="30" height="40" rx="10" fill={primaryColor} opacity="0.3" />

      {/* Far left person */}
      <circle cx="100" cy="150" r="15" fill={primaryColor} opacity="0.3" />
      <rect x="88" y="165" width="24" height="35" rx="8" fill={primaryColor} opacity="0.25" />

      {/* Far right person */}
      <circle cx="400" cy="150" r="15" fill={secondaryColor} opacity="0.3" />
      <rect x="388" y="165" width="24" height="35" rx="8" fill={secondaryColor} opacity="0.25" />

      {/* Chat bubbles */}
      <rect x="180" y="80" width="50" height="24" rx="12" fill={secondaryColor} opacity="0.15" />
      <rect x="280" y="90" width="40" height="20" rx="10" fill={primaryColor} opacity="0.15" />
      <rect x="130" y="95" width="35" height="18" rx="9" fill={primaryColor} opacity="0.12" />

      {/* Heart/like icons */}
      <path d="M220 85 C220 80 228 76 232 82 C236 76 244 80 244 85 C244 92 232 100 232 100 C232 100 220 92 220 85Z" fill={secondaryColor} opacity="0.3" />

      {/* Connection lines */}
      <line x1="178" y1="140" x2="230" y2="140" stroke={primaryColor} strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
      <line x1="270" y1="140" x2="322" y2="140" stroke={secondaryColor} strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />

      {/* Floating stars */}
      <circle cx="80" cy="80" r="3" fill={secondaryColor} opacity="0.2" />
      <circle cx="420" cy="100" r="2" fill={primaryColor} opacity="0.2" />
      <circle cx="450" cy="180" r="4" fill={secondaryColor} opacity="0.15" />
      <circle cx="60" cy="200" r="3" fill={primaryColor} opacity="0.15" />
    </svg>
  );
}
