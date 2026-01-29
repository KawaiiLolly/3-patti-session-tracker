-- Fix 1: Add UPDATE policy for games table so users can update their own games
CREATE POLICY "Users can update own games" 
ON public.games 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix 2: Add CHECK constraints for positive monetary values
ALTER TABLE public.games
  ADD CONSTRAINT games_participation_fee_positive CHECK (participation_fee >= 0),
  ADD CONSTRAINT games_pot_total_positive CHECK (pot_total >= 0);

ALTER TABLE public.player_bets
  ADD CONSTRAINT player_bets_total_bet_nonnegative CHECK (total_bet >= 0);