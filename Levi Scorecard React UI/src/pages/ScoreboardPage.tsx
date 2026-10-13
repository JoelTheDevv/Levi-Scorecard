import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BellRing,
  Crown,
  Gauge,
  Megaphone,
  Minus,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useScoreboardContext } from '@/context/ScoreboardContext';
import { TopBar } from '@/components/layout/TopBar';
import { ScoreboardHeader } from '@/components/scoreboard/ScoreboardHeader';
import { MetricCard } from '@/components/scoreboard/MetricCard';
import { EmployeeRow } from '@/components/scoreboard/EmployeeRow';
import { TransferCelebration } from '@/components/scoreboard/TransferCelebration';
import { DayResultsCelebration } from '@/components/scoreboard/DayResultsCelebration';

export function ScoreboardPage() {
  const navigate = useNavigate();
  const scoreboard = useScoreboardContext();
  
  const [employeeMovements, setEmployeeMovements] = useState<
  Record<string, 'up' | 'down' | 'same'>
>({});

const previousRanks = useRef<Record<string, number> | null>(null);

useEffect(() => {
  const currentRanks: Record<string, number> = {};

  scoreboard.rankedEmployees.forEach((employee, index) => {
    currentRanks[employee.id] = index;
  });

  // First load: save ranks without showing movement arrows.
  if (previousRanks.current === null) {
    previousRanks.current = currentRanks;
    return;
  }

  const oldRanks = previousRanks.current;

  setEmployeeMovements((previousMovements) => {
    const nextMovements = { ...previousMovements };

    scoreboard.rankedEmployees.forEach((employee, index) => {
      const previousRank = oldRanks[employee.id];

      // Ignore newly appearing employees.
      if (previousRank === undefined) {
        return;
      }

      // Update the arrow only when the rank changes.
      if (previousRank > index) {
        nextMovements[employee.id] = 'up';
      } else if (previousRank < index) {
        nextMovements[employee.id] = 'down';
      }
      // If the rank is unchanged, keep the previous arrow.
    });

    return nextMovements;
  });

  previousRanks.current = currentRanks;
}, [scoreboard.rankedEmployees]);

  return (
    <div className="app-shell scoreboard-mode">
      <TopBar
        isScoreboard
        isSoundOn={scoreboard.isSoundOn}
        onToggleSound={scoreboard.toggleSound}
        onSwitchMode={() => navigate('/login')}
        dayStarted={scoreboard.dayStarted}
        currentBusinessDate={scoreboard.currentBusinessDate}
      />

      <main className="scoreboard-content">
        <ScoreboardHeader
          target={scoreboard.target}
          total={scoreboard.total}
          progress={scoreboard.progress}
          remaining={scoreboard.remaining}
          isTargetHit={scoreboard.isTargetHit}
        />

        <section className="metric-grid">
          <MetricCard
            label="Total transfers"
            value={scoreboard.total.toLocaleString()}
            icon={Zap}
            tone="blue"
            detail={
              scoreboard.total
                ? '+12.4% vs yesterday'
                : 'Waiting for first transfer'
            }
          />

          <MetricCard
            label="Target progress"
            value={`${scoreboard.progress.toFixed(1)}%`}
            icon={Gauge}
            tone="green"
            detail={
              scoreboard.isTargetHit
                ? 'Target exceeded'
                : `${scoreboard.remaining} remaining`
            }
          />

          <MetricCard
            label="Current leader"
            value={scoreboard.leader?.name.split(' ')[0] ?? '—'}
            icon={Crown}
            tone="gold"
            detail={
              scoreboard.leader
                ? `${scoreboard.leader.transfers} transfers · #1`
                : 'No scores yet'
            }
          />

          <MetricCard
            label="Team in front"
            value={scoreboard.teamLeader?.name ?? '—'}
            icon={Trophy}
            tone="pink"
            detail={
              scoreboard.teamLeader
                ? `${scoreboard.teamLeader.score} team transfers · #1`
                : 'No teams yet'
            }
          />
        </section>

        <section className="board-layout">
  <div className="teams-board">
    {scoreboard.rankedTeams.map((team, teamIndex) => {
      const teamEmployees = scoreboard.employees
  .filter((employee) => employee.teamId === team.id)
  .sort(
    (a, b) =>
      b.transfers - a.transfers ||
      a.name.localeCompare(b.name)
  );

      return (
        <div
          key={team.id}
          className={`team-employee-card ${
            teamIndex === 0 ? 'team-card-leader' : ''
          }`}
        >
          <div className="team-board-header">
            <div className="team-board-title">
              <div
                className="team-board-avatar"
                style={{ background: team.color }}
              >
                {team.short}
              </div>

              <div>
                <div className="team-board-rank">
                  #{teamIndex + 1} TEAM
                </div>

                <h2>
                  {team.name}
                </h2>
              </div>
            </div>

            <div className="team-board-score">
              <strong>{team.score}</strong>
              <span>transfers</span>
            </div>
          </div>

          <div className="team-progress">
            <span
              style={{
                width: `${
                  scoreboard.total
                    ? Math.max(
                        (team.score / scoreboard.total) * 100,
                        4
                      )
                    : 4
                }%`,
                background: team.color,
              }}
            />
          </div>

          <div className="team-employee-header">
            <span>EMPLOYEE</span>
            <span>TRANSFERS</span>
          </div>

          <div className="team-employee-list">
  {teamEmployees.map((employee, index) => (
    <EmployeeRow
      key={employee.id}
      employee={employee}
      serialNumber={index + 1}
      isLeader={scoreboard.leader?.id === employee.id}
      movement={employeeMovements[employee.id] ?? 'same'}
      flash={scoreboard.flashId === employee.id}
    />
  ))}
</div>
        </div>
      );
    })}
  </div>

</section>

        {scoreboard.announcement && (
          <div className="announcement">
            <div className="announcement-icon">
              <Megaphone size={19} />
            </div>

            <div>
              <span>LIVE MOMENT</span>
              <strong>{scoreboard.announcement}</strong>
            </div>

            <button
              onClick={() => scoreboard.setAnnouncement('')}
              aria-label="Dismiss announcement"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {scoreboard.transferQueue.length > 0 && (
          <TransferCelebration
            key={scoreboard.transferQueue[0].id}
            employeeName={scoreboard.transferQueue[0].employeeName}
            onComplete={scoreboard.completeTransferCelebration}
            isSoundOn={scoreboard.isSoundOn}
          />
        )}
        
        {scoreboard.dayEnded && scoreboard.dayResults && (
          <DayResultsCelebration results={scoreboard.dayResults} />
        )}
      </main>
    </div>
  );
}