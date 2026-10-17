import { Plus, Undo2 } from 'lucide-react';
import type { Employee, Team } from '@/types';
import { getInitials } from '@/utils/scoreboardUtils';
import { Trash2 } from "lucide-react";
import { useState } from "react";


type EmployeeControlRowProps = {
  employee: Employee;
  teams: Team[];
  flash: boolean;
  dayStarted: boolean;
  dayEnded: boolean;
  onRecordTransfer: (employeeId: string) => void;
  onReassignEmployee: (employeeId: string, teamId: string) => void;
  onUndoTransfer: (employeeId: string) => void;
  onDeleteEmployee: (employeeId: string) => void;
};

export function EmployeeControlRow({
  employee,
  teams,
  flash,
  dayStarted,
  dayEnded,
  onRecordTransfer,
  onReassignEmployee,
  onUndoTransfer,
  onDeleteEmployee
}: EmployeeControlRowProps) {

const [employeeToDelete, setEmployeeToDelete] =
  useState<Employee | null>(null);  

  const handleDeleteEmployee = async () => {
  if (!employeeToDelete) return;

  await onDeleteEmployee(employeeToDelete.id);
  setEmployeeToDelete(null);
};

  return (
    <div className={`control-employee ${flash ? 'flash-row' : ''}`}>
      <div className="mini-avatar">{getInitials(employee.name)}</div>

      <div className="control-person">
        <strong>{employee.name}</strong>
        <span>{employee.role}</span>
      </div>

      <select
        className="employee-team-select"
        value={employee.teamId}
        onChange={(event) =>
          onReassignEmployee(employee.id, event.target.value)
        }
        disabled={!dayStarted || dayEnded}
        aria-label={`Change team for ${employee.name}`}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <strong className="control-count">{employee.transfers}</strong>

      <button
        className="add-transfer"
        onClick={() => onRecordTransfer(employee.id)}
        disabled={!dayStarted || dayEnded}
        aria-label={`Add transfer for ${employee.name}`}
      >
        <Plus size={18} />
      </button>

      <button
        className="undo-transfer"
        onClick={() => onUndoTransfer(employee.id)}
        disabled={!dayStarted || dayEnded || employee.transfers === 0}
        aria-label={`Undo transfer for ${employee.name}`}
      >
        <Undo2 size={18} />
      </button>

      <button
        className="delete-employee"
        onClick={() => setEmployeeToDelete(employee)}
        aria-label={`Delete employee ${employee.name}`}
      >
        <Trash2 size={18} />
      </button>

      {employeeToDelete && (
  <div className="modal-overlay">
    <div
      className="delete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <h3 id="delete-modal-title">Confirm Deletion</h3>

      <p>
        Are you sure you want to delete {employee.name}
      </p>

      <div className="modal-actions">
        <button onClick={() => setEmployeeToDelete(null)}>
          No
        </button>

        <button
          className="confirm-delete"
          onClick={handleDeleteEmployee}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}