import {
  BellRing,
  Crown,
  Gauge,
  Megaphone,
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
import { TeamRow } from '@/components/scoreboard/TeamRow';
import { ActivityRow } from '@/components/scoreboard/ActivityRow';
import { TransferCelebration } from '@/components/scoreboard/TransferCelebration';
import { DayResultsCelebration } from '@/components/scoreboard/DayResultsCelebration';

export function ScoreboardPage() {
  const navigate = useNavigate();
  const scoreboard = useScoreboardContext();
  

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
          <div className="rankings-card panel-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">INDIVIDUAL RANKINGS</span>
                <h2>Top performers</h2>
              </div>

              {scoreboard.dayStarted ? (
                <span className="live-mini">
                  <span className="live-dot" /> Updating live
                </span>
              ) : (
                <span className="offline-mini">
                  <span className="offline-dot" /> Offline
                </span>
              )}
            </div>

            <div className="compact-leader">
              <Crown size={15} />
              <span>LEADER</span>
              <strong>
                {scoreboard.leader?.name ?? 'Waiting for a leader'}
              </strong>
              <b>{scoreboard.leader?.transfers ?? 0} transfers</b>
            </div>

            <div className="employee-list">
              {scoreboard.rankedEmployees.map((employee, index) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  index={index}
                  team={scoreboard.teams.find(
                    (team) => team.id === employee.teamId,
                  )}
                  isLeader={index === 0}
                  flash={scoreboard.flashId === employee.id}
                />
              ))}
            </div>
          </div>

          <div className="side-stack">
            <div className="panel-card team-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">TEAM RANKINGS</span>
                  <h2>Race to the top</h2>
                </div>

                <Trophy size={20} className="heading-icon" />
              </div>

              <div className="team-list">
                {scoreboard.rankedTeams.map((team, index) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    index={index}
                    total={scoreboard.total}
                    isLeader={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="panel-card activity-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">LIVE ACTIVITY</span>
                  <h2>In the moment</h2>
                </div>

                <BellRing size={18} className="heading-icon" />
              </div>

              <div className="activity-list">
                {scoreboard.activities.length ? (
                  scoreboard.activities.map((activity) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                    />
                  ))
                ) : (
                  <p className="empty-copy">
                    Transfers will appear here as they happen.
                  </p>
                )}
              </div>
            </div>
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
          />
        )}
        
        {scoreboard.dayEnded && scoreboard.dayResults && (
          <DayResultsCelebration results={scoreboard.dayResults} />
        )}
      </main>
    </div>
  );
}