import { ArrowUpRight, ChevronUp, Crown, Minus } from 'lucide-react';
import type { Employee, Team } from '@/types';
import { getInitials } from '@/utils/scoreboardUtils';

type EmployeeRowProps = {
  employee: Employee;
  index: number;
  team?: Team;
  isLeader: boolean;
  flash: boolean;
};

export function EmployeeRow({ employee, index, team, isLeader, flash }: EmployeeRowProps) {
  return (
    <div className={`employee-row ${isLeader ? 'is-leader' : ''} ${flash ? 'score-flash' : ''}`}>
      <div className="rank-number">{index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
      <div className="employee-avatar">{getInitials(employee.name)}</div>
      <div className="employee-info">
        <strong>
          {employee.name} {isLeader && <Crown size={14} />}
        </strong>
        <span>
          {employee.role} <b style={{ color: team?.color }}>· {team?.name}</b>
        </span>
      </div>
      <div className="movement">
        {index === 0 ? <ChevronUp size={15} /> : index === 1 ? <ArrowUpRight size={14} /> : <Minus size={14} />}
      </div>
      <div className="row-score">
        <strong>{employee.transfers}</strong>
        <span>transfers</span>
      </div>
    </div>
  );
}
