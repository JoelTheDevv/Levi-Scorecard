import leviLogo from './logo/LeviLogo_WhiteShade.png';
export function WhiteLogo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`brand-lockup ${
        compact ? 'brand-lockup-compact' : ''
      }`}
    >
      <img
        src={leviLogo}
        alt="Levi Communications"
        className="brand-logo"
      />
    </div>
  );
}