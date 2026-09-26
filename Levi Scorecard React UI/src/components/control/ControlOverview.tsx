import { Settings2 } from 'lucide-react';
import type { Employee } from '@/types';

type ControlOverviewProps = {
  total: number;
  target: number;
  progress: number;
  remaining: number;
  leader: Employee | undefined;
  onSetTarget: () => void;
};

export function ControlOverview({
  total,
  target,
  progress,
  remaining,
  leader,
  onSetTarget,
}: ControlOverviewProps) {
  return (
    <div className="control-overview panel-card">
      <div className="overview-stat">
        <span>COMPANY TOTAL</span>
        <strong>{total}</strong>
        <small>of {target} target</small>
      </div>
      <div className="overview-progress">
        <div className="progress-head">
          <span>{progress.toFixed(1)}% complete</span>
          <strong>{remaining > 0 ? `${remaining} remaining` : 'Target exceeded'}</strong>
        </div>
        <div className="large-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <button className="target-button" onClick={onSetTarget}>
          <Settings2 size={15} /> Set daily target
        </button>
      </div>
      <div className="overview-leader">
        <span>CURRENT LEADER</span>
        <strong>{leader?.name ?? 'No leader yet'}</strong>
        <small>{leader?.transfers ?? 0} transfers</small>
      </div>
    </div>
  );
}
