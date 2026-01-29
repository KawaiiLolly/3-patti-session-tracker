import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

export function useGameStore() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [participationFee, setParticipationFee] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch players from database
  const fetchPlayers = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setPlayers(data.map(p => ({
        id: p.id,
        name: p.name,
        createdAt: new Date(p.created_at)
      })));
    }
  }, [user]);

  // Fetch games from database
  const fetchGames = useCallback(async () => {
    if (!user) return;
    
    const { data: gamesData, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .order('date', { ascending: false });
    
    if (gamesError || !gamesData) return;

    const gamesWithBets: Game[] = await Promise.all(
      gamesData.map(async (game) => {
        const { data: betsData } = await supabase
          .from('player_bets')
          .select('*')
          .eq('game_id', game.id);
        
        return {
          id: game.id,
          date: new Date(game.date),
          participationFee: game.participation_fee,
          winnerId: game.winner_id || '',
          potTotal: game.pot_total,
          players: (betsData || []).map(bet => ({
            playerId: bet.player_id,
            bets: bet.bets || [],
            totalBet: bet.total_bet
          }))
        };
      })
    );

    setGames(gamesWithBets);
  }, [user]);

  // Initial data load
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchPlayers(), fetchGames()]).finally(() => setLoading(false));
    } else {
      setPlayers([]);
      setGames([]);
      setLoading(false);
    }
  }, [user, fetchPlayers, fetchGames]);

  // Player Management
  const addPlayer = useCallback(async (name: string) => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('players')
      .insert({ name: name.trim(), user_id: user.id })
      .select()
      .single();
    
    if (!error && data) {
      const newPlayer: Player = {
        id: data.id,
        name: data.name,
        createdAt: new Date(data.created_at)
      };
      setPlayers(prev => [...prev, newPlayer]);
      return newPlayer;
    }
    return null;
  }, [user]);

  const updatePlayer = useCallback(async (id: string, name: string) => {
    const { error } = await supabase
      .from('players')
      .update({ name: name.trim() })
      .eq('id', id);
    
    if (!error) {
      setPlayers(prev => prev.map(p => 
        p.id === id ? { ...p, name: name.trim() } : p
      ));
    }
  }, []);

  const deletePlayer = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setPlayers(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  // Game Management
  const addGame = useCallback(async (playerBets: PlayerBet[], winnerId: string) => {
    if (!user) return null;
    
    const potTotal = playerBets.reduce((sum, pb) => 
      sum + participationFee + pb.totalBet, 0
    );
    
    // Create the game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert({
        user_id: user.id,
        participation_fee: participationFee,
        pot_total: potTotal,
        winner_id: winnerId
      })
      .select()
      .single();
    
    if (gameError || !gameData) return null;

    // Create player bets
    const betsToInsert = playerBets.map(pb => ({
      game_id: gameData.id,
      player_id: pb.playerId,
      bets: pb.bets,
      total_bet: pb.totalBet
    }));

    const { error: betsError } = await supabase
      .from('player_bets')
      .insert(betsToInsert);

    if (betsError) return null;

    const newGame: Game = {
      id: gameData.id,
      date: new Date(gameData.date),
      participationFee: gameData.participation_fee,
      players: playerBets,
      winnerId: gameData.winner_id || '',
      potTotal: gameData.pot_total,
    };
    
    setGames(prev => [newGame, ...prev]);
    return newGame;
  }, [user, participationFee]);

  const deleteGame = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setGames(prev => prev.filter(g => g.id !== id));
      return true;
    }
    return false;
  }, []);

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
    loading,
    setParticipationFee,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addGame,
    deleteGame,
    getGameResults,
    refreshData: () => Promise.all([fetchPlayers(), fetchGames()]),
  };
}
