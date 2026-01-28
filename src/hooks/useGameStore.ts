import { useState, useCallback, useMemo } from 'react';
import { Player, Game, PlayerStats, GameResult, PlayerBet } from '@/types/game';

const generateId = () => Math.random().toString(36).substring(2, 11);

export function useGameStore() {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Rahul', createdAt: new Date() },
    { id: '2', name: 'Amit', createdAt: new Date() },
    { id: '3', name: 'Priya', createdAt: new Date() },
    { id: '4', name: 'Vikram', createdAt: new Date() },
  ]);
  
  const [games, setGames] = useState<Game[]>([]);
  const [participationFee, setParticipationFee] = useState(1);

  // Player Management
  const addPlayer = useCallback((name: string) => {
    const newPlayer: Player = {
      id: generateId(),
      name: name.trim(),
      createdAt: new Date(),
    };
    setPlayers(prev => [...prev, newPlayer]);
    return newPlayer;
  }, []);

  const updatePlayer = useCallback((id: string, name: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === id ? { ...p, name: name.trim() } : p
    ));
  }, []);

  const deletePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  // Game Management
  const addGame = useCallback((playerBets: PlayerBet[], winnerId: string) => {
    const potTotal = playerBets.reduce((sum, pb) => 
      sum + participationFee + pb.totalBet, 0
    );
    
    const newGame: Game = {
      id: generateId(),
      date: new Date(),
      participationFee,
      players: playerBets,
      winnerId,
      potTotal,
    };
    
    setGames(prev => [...prev, newGame]);
    return newGame;
  }, [participationFee]);

  // Calculate game results
  const getGameResults = useCallback((game: Game): GameResult[] => {
    return game.players.map(pb => {
      const player = players.find(p => p.id === pb.playerId);
      const invested = game.participationFee + pb.totalBet;
      const isWinner = pb.playerId === game.winnerId;
      const profitLoss = isWinner ? game.potTotal - invested : -invested;
      
      return {
        playerId: pb.playerId,
        playerName: player?.name || 'Unknown',
        invested,
        profitLoss,
        isWinner,
      };
    });
  }, [players]);

  // Calculate player statistics
  const playerStats = useMemo((): PlayerStats[] => {
    return players.map(player => {
      const playerGames = games.filter(g => 
        g.players.some(pb => pb.playerId === player.id)
      );
      
      let totalInvested = 0;
      let totalWon = 0;
      let gamesWon = 0;
      
      playerGames.forEach(game => {
        const playerBet = game.players.find(pb => pb.playerId === player.id);
        if (!playerBet) return;
        
        const invested = game.participationFee + playerBet.totalBet;
        totalInvested += invested;
        
        if (game.winnerId === player.id) {
          gamesWon++;
          totalWon += game.potTotal;
        }
      });
      
      return {
        playerId: player.id,
        playerName: player.name,
        gamesPlayed: playerGames.length,
        gamesWon,
        totalInvested,
        totalWon,
        netProfitLoss: totalWon - totalInvested,
        winRate: playerGames.length > 0 ? (gamesWon / playerGames.length) * 100 : 0,
      };
    }).sort((a, b) => b.netProfitLoss - a.netProfitLoss);
  }, [players, games]);

  // Chart data
  const profitTrendData = useMemo(() => {
    const sortedGames = [...games].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const cumulativeData: { [playerId: string]: number } = {};
    
    return sortedGames.map((game, index) => {
      const dataPoint: { game: number; [key: string]: number } = { 
        game: index + 1 
      };
      
      game.players.forEach(pb => {
        const player = players.find(p => p.id === pb.playerId);
        if (!player) return;
        
        const invested = game.participationFee + pb.totalBet;
        const profitLoss = game.winnerId === pb.playerId 
          ? game.potTotal - invested 
          : -invested;
        
        cumulativeData[player.name] = (cumulativeData[player.name] || 0) + profitLoss;
        dataPoint[player.name] = cumulativeData[player.name];
      });
      
      return dataPoint;
    });
  }, [games, players]);

  const winRateData = useMemo(() => {
    return playerStats
      .filter(ps => ps.gamesPlayed > 0)
      .map(ps => ({
        name: ps.playerName,
        value: ps.gamesWon,
        winRate: ps.winRate,
      }));
  }, [playerStats]);

  return {
    players,
    games,
    participationFee,
    playerStats,
    profitTrendData,
    winRateData,
    setParticipationFee,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addGame,
    getGameResults,
  };
}
