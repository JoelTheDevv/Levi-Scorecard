import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { useScoreboardContext } from '@/context/ScoreboardContext';
import { ControlOverview } from '@/components/control/ControlOverview';
import { TeamControlList } from '@/components/control/TeamControlList';
import { ControllerStatus } from '@/components/control/ControllerStatus';
import { AddModal } from '@/components/control/AddModal';
import { ActivityRow } from '@/components/scoreboard/ActivityRow';
import { logout } from '@/api/api';

export function ControlCenterPage() {
  const scoreboard = useScoreboardContext();

  const [showAdd, setShowAdd] = useState<
    'team' | 'employee' | null
  >(null);

  const handleSetTarget = () => {
    const value = window.prompt(
      'Set company target',
      String(scoreboard.target),
    );

    if (value && Number(value) > 0) {
      scoreboard.setDailyTarget(Number(value));
    }
  };

  const handleRecordTransfer = (employeeId: string) => {
    scoreboard.recordTransfer(employeeId);
  };
  

  const handleReassignEmployee = (
    employeeId: string,
    teamId: string,
  ) => {
    scoreboard.reassignEmployee(employeeId, teamId);
  };

  return (
    <div className="control-mode">
      <main className="control-content">
        <div className="control-heading">
          <div>
            <span className="eyebrow">CONTROL CENTER</span>
            <h1>Run today's board.</h1>
            <p>
              Keep the team moving with quick, confident updates.
            </p>
          </div>

          <div className="control-heading-actions">
            <button
              className="secondary-button"
              onClick={() => setShowAdd('team')}
            >
              <Plus size={16} /> New team
            </button>

            <button
              className="primary-button"
              onClick={() => setShowAdd('employee')}
            >
              <Plus size={16} /> Add employee
            </button>

            <button
              className="logout-button"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="control-grid">
          <div className="control-main">
            <ControlOverview
              total={scoreboard.total}
              target={scoreboard.target}
              progress={scoreboard.progress}
              remaining={scoreboard.remaining}
              leader={scoreboard.leader}
              onSetTarget={handleSetTarget}
            />

            <TeamControlList
              teams={scoreboard.teams}
              employees={scoreboard.employees}
              flashId={scoreboard.flashId}
              dayStarted={scoreboard.dayStarted}
              dayEnded={scoreboard.dayEnded}
              onRecordTransfer={handleRecordTransfer}
              onReassignEmployee={handleReassignEmployee}
              onUndoTransfer={scoreboard.undoTransfer}
            />
          </div>

          <aside className="control-sidebar">
            <ControllerStatus
              dayStarted={scoreboard.dayStarted}
              dayEnded={scoreboard.dayEnded}
              target={scoreboard.target}
              teamLeader={scoreboard.teamLeader}
              leader={scoreboard.leader}
              onEndDay={scoreboard.endDay}
              onResumeDay={scoreboard.resumeDay}
              onResetDay={scoreboard.resetDay}
              canStartNewDay={scoreboard.canStartNewDay}
              canResumeDay={scoreboard.canResumeDay}
            />

            <div className="panel-card activity-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">
                    RECENT ACTIVITY
                  </span>
                  <h2>What just happened</h2>
                </div>
              </div>

              {scoreboard.activities
                .slice(0, 5)
                .map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                  />
                ))}
            </div>

            <div className="tip-card">
              <Sparkles size={19} />

              <div>
                <strong>Make it visible</strong>
                <p>
                  Keep the public scoreboard on a second screen so
                  every transfer gets its moment.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {showAdd && (
          <AddModal
            type={showAdd}
            teams={scoreboard.teams}
            onClose={() => setShowAdd(null)}
            onAddTeam={scoreboard.addTeam}
            onAddEmployee={scoreboard.addEmployee}
          />
        )}
      </main>
    </div>
  );
}