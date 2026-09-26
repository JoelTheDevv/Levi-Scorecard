export type Team = {
  id: string;
  name: string;
  color: string;
  short: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  teamId: string;
  transfers: number;
};

export type ActivityType = 'transfer' | 'lead' | 'milestone';

export type Activity = {
  id: number;
  employee: string;
  team: string;
  time: string;
  type: ActivityType;
};

export type Mode = 'scoreboard' | 'control';

export type RankedTeam = Team & { score: number };

export type ScoreboardState = {
  employees: Employee[];
  teams: Team[];
  activities: Activity[];
  target: number;
  dayEnded: boolean;
};

export type ScoreboardComputed = {
  total: number;
  progress: number;
  remaining: number;
  rankedEmployees: Employee[];
  rankedTeams: RankedTeam[];
  leader: Employee | undefined;
  teamLeader: RankedTeam | undefined;
  isTargetHit: boolean;
};
