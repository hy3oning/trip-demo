export default function LogoMark({ compact = false }) {
  const size = compact ? 40 : 36;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: compact ? '10px' : '12px' }}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
        <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#tripzone-gradient)" />
        <path d="M12 28L19.2 14.5L26.2 22.5L32.1 15L36 28H12Z" fill="white" fillOpacity="0.95" />
        <circle cx="30" cy="11.5" r="2.5" fill="white" />
        <defs>
          <linearGradient id="tripzone-gradient" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F05A5C" />
            <stop offset="1" stopColor="#E8484A" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', alignItems: compact ? 'center' : 'flex-start', lineHeight: 1 }}>
        {compact ? (
          <span style={{ fontSize: '19px', letterSpacing: '0.06em', color: '#E8484A', fontWeight: 900, lineHeight: 1, transform: 'translateY(1px)' }}>
            TRIPZONE
          </span>
        ) : (
          <span style={{ fontSize: '15px', letterSpacing: '0.08em', color: '#E8484A', fontWeight: 800 }}>TRIPZONE</span>
        )}
        {!compact && (
          <span style={{ fontSize: '11px', color: '#666666', marginTop: '4px' }}>SMART KOREA STAY BOOKING</span>
        )}
      </div>
    </div>
  );
}
