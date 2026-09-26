import { Flag, Radio, ShieldCheck } from 'lucide-react';
import type { Employee, RankedTeam } from '@/types';

type ControllerStatusProps = {
  dayStarted: boolean;
  dayEnded: boolean;
  target: number;
  teamLeader: RankedTeam | undefined;
  leader: Employee | undefined;
  onEndDay: () => void;
  onResumeDay: () => void;
  onResetDay: () => void;
  canStartNewDay: boolean;
  canResumeDay: boolean;
};

export function ControllerStatus({
  dayStarted,
  dayEnded,
  target,
  teamLeader,
  leader,
  onEndDay,
  onResumeDay,
  onResetDay,
  canStartNewDay,
  canResumeDay,
}: ControllerStatusProps) {
  const handleDayAction = () => {
    // Day has not started yet
    if (!dayStarted && !dayEnded) {
      onResetDay();
      return;
    }

    // Day is currently active
    if (dayStarted && !dayEnded) {
      onEndDay();
      return;
    }

    // Day ended, but it is still the same business day
    if (canResumeDay) {
      onResumeDay();
      return;
    }

    // Previous business day ended and a new business day is available
    if (canStartNewDay) {
      onResetDay();
      return;
    }
  };

  const getButtonLabel = () => {
    if (!dayStarted && !dayEnded) {
      return (
        <>
          <Radio size={16} /> Start new day
        </>
      );
    }

    if (dayStarted && !dayEnded) {
      return (
        <>
          <Flag size={16} /> End current day
        </>
      );
    }

    if (canResumeDay) {
      return (
        <>
          <Radio size={16} /> Resume current day
        </>
      );
    }

    return (
      <>
        <Radio size={16} /> Start new day
      </>
    );
  };

  return (
    <div className="panel-card controller-status">
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            TODAY'S STATUS
          </span>

          <h2>
            {!dayStarted && !dayEnded
              ? 'Day not started'
              : dayEnded
                ? canResumeDay
                  ? 'Day ended'
                  : 'Day complete'
                : 'Board is live'}
          </h2>
        </div>

        <ShieldCheck
          size={20}
          className="heading-icon"
        />
      </div>

      <div className="status-line">
        <span className="live-dot" />

        {!dayStarted && !dayEnded
          ? 'Ready to start'
          : dayEnded
            ? canResumeDay
              ? 'Results saved — day can be resumed'
              : 'Final results saved'
            : 'Accepting transfers'}
      </div>

      <div className="status-detail">
        <span>Target</span>
        <strong>{target}</strong>
      </div>

      <div className="status-detail">
        <span>Top team</span>
        <strong>{teamLeader?.name ?? '—'}</strong>
      </div>

      <div className="status-detail">
        <span>Top performer</span>
        <strong>{leader?.name ?? '—'}</strong>
      </div>

      <button
        className={
          !dayStarted || dayEnded
            ? 'primary-button full-button'
            : 'end-day-button'
        }
        onClick={handleDayAction}
      >
        {getButtonLabel()}
      </button>
    </div>
  );
}