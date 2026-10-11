import { Zap } from 'lucide-react';
import type { Team, Employee } from '@/types';
import { getTeamScore } from '@/utils/scoreboardUtils';
import { EmployeeControlRow } from '@/components/control/EmployeeControlRow';

type TeamControlListProps = {
  teams: Team[];
  employees: Employee[];
  flashId: string | null;
  dayStarted: boolean;
  dayEnded: boolean;
  onRecordTransfer: (employeeId: string) => void;
  onReassignEmployee: (employeeId: string, teamId: string) => void;
  onUndoTransfer: (employeeId: string) => void;
};

export function TeamControlList({
  teams,
  employees,
  flashId,
  dayStarted,
  dayEnded,
  onRecordTransfer,
  onReassignEmployee,
  onUndoTransfer,
}: TeamControlListProps) {
  return (
    <div className="controller-list panel-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">QUICK UPDATE</span>
          <h2>Tap to record a transfer</h2>
        </div>
        <span className="shortcut-hint">
          <Zap size={13} /> Fast action
        </span>
      </div>
      {teams.map((team) => (
        <div className="control-team" key={team.id}>
          <div className="control-team-heading">
            <div className="team-avatar" style={{ background: team.color }}>
              {team.short}
            </div>
            <div>
              <strong>{team.name}</strong>
              <span>{getTeamScore(team.id, employees)} total transfers</span>
            </div>
          </div>
          <div className="control-employee-list">
            {employees
  .filter((employee) => employee.teamId === team.id)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((employee) => (
                <EmployeeControlRow
                  key={employee.id}
                  employee={employee}
                  teams={teams}
                  flash={flashId === employee.id}
                  dayStarted={dayStarted}
                  dayEnded={dayEnded}
                  onRecordTransfer={onRecordTransfer}
                  onReassignEmployee={onReassignEmployee}
                  onUndoTransfer={onUndoTransfer}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
