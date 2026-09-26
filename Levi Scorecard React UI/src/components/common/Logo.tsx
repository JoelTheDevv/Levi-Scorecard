import leviLogo from './logo/LeviLogo_BlueShade.png';
export function Logo({
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