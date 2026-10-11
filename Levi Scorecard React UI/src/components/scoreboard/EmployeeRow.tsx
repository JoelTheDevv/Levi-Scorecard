import {
  ArrowDown,
  ArrowUp,
  Crown,
  Minus,
} from 'lucide-react';

import type { Employee } from '@/types';
import { getInitials } from '@/utils/scoreboardUtils';

type EmployeeRowProps = {
  employee: Employee;
  serialNumber: number;
  isLeader: boolean;
  movement: 'up' | 'down' | 'same';
  flash: boolean;
};

export function EmployeeRow({
  employee,
  serialNumber,
  isLeader,
  movement,
  flash,
}: EmployeeRowProps) {
  return (
    <div
      className={`employee-row ${
        isLeader ? 'is-leader' : ''
      } ${flash ? 'score-flash' : ''}`}
    >
      <span className="employee-serial">
        {String(serialNumber).padStart(2, '0')}
      </span>

      <div className="employee-name-badge">
        {getInitials(employee.name).slice(0, 2).toUpperCase()}
      </div>

      <div className="employee-details">
        <strong className="employee-name">
          <span>{employee.name}</span>

          {isLeader && (
            <Crown
              className="leader-crown"
              size={15}
              fill="currentColor"
              aria-label="Current leader"
            />
          )}
        </strong>
      </div>

      <span
        className={`employee-movement movement-${movement}`}
        aria-label={`Ranking movement: ${movement}`}
        title={`Ranking movement: ${movement}`}
      >
        {movement === 'up' ? (
          <ArrowUp size={16} />
        ) : movement === 'down' ? (
          <ArrowDown size={16} />
        ) : (
          <Minus size={15} />
        )}
      </span>

      <strong className="employee-transfers">
        {employee.transfers}
      </strong>
    </div>
  );
}