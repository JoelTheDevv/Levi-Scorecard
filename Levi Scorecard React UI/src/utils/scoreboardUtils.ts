import type { Employee, Team, RankedTeam } from '@/types';

export function computeTotal(employees: Employee[]): number {
  return employees.reduce((sum, employee) => sum + employee.transfers, 0);
}

export function computeProgress(total: number, target: number): number {
  return Math.min((total / target) * 100, 100);
}

export function computeRemaining(total: number, target: number): number {
  return Math.max(target - total, 0);
}

export function rankEmployees(employees: Employee[]): Employee[] {
  return [...employees].sort(
    (a, b) => b.transfers - a.transfers || a.name.localeCompare(b.name)
  );
}

export function rankTeams(teams: Team[], employees: Employee[]): RankedTeam[] {
  return teams
    .map((team) => ({
      ...team,
      score: employees
        .filter((employee) => employee.teamId === team.id)
        .reduce((sum, employee) => sum + employee.transfers, 0),
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

export function getTeamScore(teamId: string, employees: Employee[]): number {
  return employees
    .filter((employee) => employee.teamId === teamId)
    .reduce((sum, employee) => sum + employee.transfers, 0);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}

export function getFirstName(name: string): string {
  return name.split(' ')[0];
}

export function slugify(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
}

export function getRandomMotivationalMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}
