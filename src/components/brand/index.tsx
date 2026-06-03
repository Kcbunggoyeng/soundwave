export function Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="#ff4d6d" opacity="0.12" />
      <path
        d="M8 26c5-10 8-2 12-10s5 2 9-6"
        stroke="#ff4d6d"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 32c4-4 7-2 10-8s4 4 8-2"
        stroke="#ff4d6d"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <circle cx="30" cy="10" r="2.5" fill="#ff4d6d" opacity="0.9" />
    </svg>
  );
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo className="w-7 h-7" />
      <span className="text-chalk font-bold text-lg tracking-tight">
        SoundWave
      </span>
    </div>
  );
}