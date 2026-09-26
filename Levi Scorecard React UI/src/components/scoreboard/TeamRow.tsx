import { Crown } from 'lucide-react';
import type { RankedTeam } from '@/types';

type TeamRowProps = {
  team: RankedTeam;
  index: number;
  total: number;
  isLeader: boolean;
};

export function TeamRow({ team, index, total, isLeader }: TeamRowProps) {
  return (
    <div className={`team-row ${isLeader ? 'team-leader' : ''}`}>
      <div className="team-rank">{index + 1}</div>
      <div className="team-avatar" style={{ background: team.color }}>
        {team.short}
      </div>
      <div className="team-info">
        <strong>
          {team.name} {isLeader && <Crown size={13} />}
        </strong>
        <div className="team-bar">
          <span
            style={{
              width: `${total ? Math.max((team.score / total) * 100, 8) : 8}%`,
              background: team.color,
            }}
          />
        </div>
      </div>
      <div className="team-score">
        <strong>{team.score}</strong>
        <span>{total ? `${Math.round((team.score / total) * 100)}%` : '0%'}</span>
      </div>
    </div>
  );
}
