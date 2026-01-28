export interface Player {
  id: string;
  name: string;
  createdAt: Date;
}

export interface PlayerBet {
  playerId: string;
  bets: number[];
  totalBet: number;
}

export interface Game {
  id: string;
  date: Date;
  participationFee: number;
  players: PlayerBet[];
  winnerId: string;
  potTotal: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  gamesPlayed: number;
  gamesWon: number;
  totalInvested: number;
  totalWon: number;
  netProfitLoss: number;
  winRate: number;
}

export interface GameResult {
  playerId: string;
  playerName: string;
  invested: number;
  profitLoss: number;
  isWinner: boolean;
}
