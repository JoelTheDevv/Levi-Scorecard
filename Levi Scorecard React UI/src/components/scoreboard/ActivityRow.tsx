import { Crown, Flag, Zap } from 'lucide-react';
import type { Activity } from '@/types';

type ActivityRowProps = {
  activity: Activity;
};

export function ActivityRow({ activity }: ActivityRowProps) {
  const isMilestone = activity.type === 'milestone';
  const isLead = activity.type === 'lead';

  return (
    <div className="activity-row">
      <div className={`activity-icon ${isMilestone ? 'milestone' : isLead ? 'lead' : ''}`}>
        {isMilestone ? <Flag size={13} /> : isLead ? <Crown size={13} /> : <Zap size={13} />}
      </div>
      <div>
        <strong>
          {isMilestone
            ? 'Target milestone'
            : isLead
              ? `${activity.employee} took the lead`
              : `${activity.employee} made a transfer`}
        </strong>
        <span>
          {activity.team} <b>·</b> {activity.time}
        </span>
      </div>
    </div>
  );
}
