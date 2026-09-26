import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Team } from '@/types';

type AddModalProps = {
  type: 'team' | 'employee';
  teams: Team[];
  onClose: () => void;
  onAddTeam: (name: string) => void;
  onAddEmployee: (name: string, teamId: string) => void;
};

export function AddModal({ type, teams, onClose, onAddTeam, onAddEmployee }: AddModalProps) {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (type === 'team') {
      onAddTeam(name);
    } else {
      onAddEmployee(name, teamId);
    }
    setName('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <span className="eyebrow">
          {type === 'team' ? 'TEAM MANAGEMENT' : 'PEOPLE MANAGEMENT'}
        </span>
        <h2>{type === 'team' ? 'Create a new team' : 'Add an employee'}</h2>
        <p>
          {type === 'team'
            ? 'Give your next group a name and a place on the board.'
            : 'New callers start at zero and can begin competing immediately.'}
        </p>
        <label>
          {type === 'team' ? 'Team name' : 'Employee name'}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'team' ? 'e.g. Summit Crew' : 'e.g. Taylor Morgan'}
            autoFocus
          />
        </label>
        {type === 'employee' && (
          <label>
            Assign to team
            <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="primary-button full-button" onClick={handleSubmit}>
          <Plus size={16} /> {type === 'team' ? 'Create team' : 'Add employee'}
        </button>
      </div>
    </div>
  );
}
