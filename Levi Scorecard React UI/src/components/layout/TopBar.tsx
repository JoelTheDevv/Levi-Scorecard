import { LayoutDashboard, Volume2, VolumeX } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

type TopBarProps = {
  isScoreboard: boolean;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onSwitchMode: () => void;
  dayStarted: boolean;
  currentBusinessDate: string | null;
};


export function TopBar({
  isScoreboard,
  isSoundOn,
  onToggleSound,
  onSwitchMode,
  dayStarted,
  currentBusinessDate,
}: TopBarProps) {

  const formattedBusinessDate = currentBusinessDate
  ? new Date(`${currentBusinessDate}T00:00:00`).toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    )
  : '';

  return (
    <header className="topbar">
      <Logo compact />

      <div className="topbar-center">
        {dayStarted ? (
          <span className="live-pill">
            <span className="live-dot" /> LIVE
          </span>
        ) : (
          <span className="offline-pill">
            <span className="offline-dot" /> OFFLINE
          </span>
        )}

        <span className="topbar-date">
          {formattedBusinessDate}
        </span>
      </div>

      <div className="topbar-actions">
        {isScoreboard && (
          <button
            className="icon-button"
            onClick={onToggleSound}
            aria-label={isSoundOn ? 'Mute sound' : 'Enable sound'}
          >
            {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{isSoundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        )}

        <button className="mode-button" onClick={onSwitchMode}>
          <LayoutDashboard size={16} />
          {isScoreboard ? 'Controller login' : 'Public scoreboard'}
        </button>
      </div>
    </header>
  );
}