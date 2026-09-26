import { Flag, Gauge, Radio, Zap } from 'lucide-react';

type ScoreboardHeaderProps = {
  target: number;
  total: number;
  progress: number;
  remaining: number;
  isTargetHit: boolean;
};

export function ScoreboardHeader({
  target,
  total,
  progress,
  remaining,
  isTargetHit,
}: ScoreboardHeaderProps) {
  return (
    <section className="compact-header">
      <div className="compact-header-left">
        <Radio size={14} /> <span>LIVE CALL TRANSFER SCORECARD</span>
      </div>
      <div className="compact-target-bar">
        <div className="compact-target-item">
          <Flag size={14} />
          <span>TARGET</span>
          <strong>{target.toLocaleString()}</strong>
        </div>
        <div className="compact-target-item">
          <Zap size={14} />
          <span>CURRENT</span>
          <strong>{total.toLocaleString()}</strong>
        </div>
        <div className="compact-target-item">
          <Gauge size={14} />
          <span>PROGRESS</span>
          <strong>{progress.toFixed(1)}%</strong>
        </div>
        <div className="compact-target-item">
          <span>REMAINING</span>
          <strong>{isTargetHit ? 'Done' : remaining}</strong>
        </div>
        <div className="compact-progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
