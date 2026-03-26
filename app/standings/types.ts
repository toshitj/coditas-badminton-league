export type Standing = {
  rank: number;
  teamName: string;
  group: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  rubbersWon: number;
  rubbersLost: number;
  rubberDiff: number;
  points: number;
  pointsScored: number;
  pointsConceded: number;
  pointDifference: number;
  matchWinPercentage: number;
  rubberWinPercentage: number;
};

export type StandingsApiResponse = {
  success: boolean;
  message?: string;
  totalTeams?: number;
  standings?: Standing[];
};
