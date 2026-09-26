import { Trophy, Medal, Crown, Users } from 'lucide-react';
import type { Employee, RankedTeam } from '@/types';

type DayResults = {
  winner: Employee | null;
  runnerUps: Employee[];
  winningTeam: RankedTeam | null;
  totalTransfers: number;
};

type DayResultsCelebrationProps = {
  results: DayResults;
};

export function DayResultsCelebration({
  results,
}: DayResultsCelebrationProps) {
  const { winner, runnerUps, winningTeam, totalTransfers } = results;

  return (
    <div className="day-results-overlay">
      <div className="results-confetti results-confetti-one" />
      <div className="results-confetti results-confetti-two" />
      <div className="results-confetti results-confetti-three" />
      <div className="results-confetti results-confetti-four" />

      <div className="day-results-card">
        <div className="results-trophy">
          <Trophy size={48} />
        </div>

        <span className="results-eyebrow">
          DAY COMPLETE
        </span>

        <h1>Today's Champions</h1>

        {winner && (
          <div className="results-winner">
            <span className="winner-label">
              <Crown size={16} />
              TOP TRANSFER AGENT
            </span>

            <strong>{winner.name}</strong>

            <span className="winner-stat">
              {winner.transfers} TRANSFERS
            </span>
          </div>
        )}

        {winningTeam && (
          <div className="winning-team">
            <Users size={18} />
            <span>
              Winning Team: <strong>{winningTeam.name}</strong>
            </span>

            <b>{winningTeam.score} transfers</b>
          </div>
        )}

        <div className="runner-ups">
          <div className="runner-ups-heading">
            <Medal size={17} />
            <span>RUNNER UPS</span>
          </div>

          {runnerUps.map((employee, index) => (
            <div className="runner-up-row" key={employee.id}>
              <span className="runner-up-rank">
                {index + 2}
              </span>

              <strong>{employee.name}</strong>

              <span>{employee.transfers} transfers</span>
            </div>
          ))}
        </div>

        <div className="results-total">
          <span>TOTAL TEAM TRANSFERS</span>
          <strong>{totalTransfers}</strong>
        </div>
      </div>
    </div>
  );
}