export type Fixture = {
  matchId: string;
  stage: string;
  group: string;
  team1Name: string;
  team2Name: string;
  mdWinner: string;
  mdTeam1Players: string;
  mdTeam2Players: string;
  mdScore: string;
  msWinner: string;
  msTeam1Player: string;
  msTeam2Player: string;
  msScore: string;
  wsWinner: string;
  wsTeam1Player: string;
  wsTeam2Player: string;
  wsScore: string;
  matchWinners: string;
  status: string;
  matchDate: string;
  venue: string;
  matchTime: string;
};

export type FixturesApiResponse = {
  success: boolean;
  message?: string;
  totalFixtures?: number;
  fixtures?: Fixture[];
};

export type FixturesTab = {
  key: string;
  label: string;
  fixtures: Fixture[];
};

export type DateInfo = {
  key: string;
  sortKey: string;
  label: string;
};
