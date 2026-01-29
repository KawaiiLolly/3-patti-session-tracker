-- Add UPDATE and DELETE policies for player_bets table
-- Users can update/delete bets only for games they own

CREATE POLICY "Users can update bets for own games" 
ON public.player_bets 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.games 
    WHERE games.id = player_bets.game_id 
    AND games.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete bets for own games" 
ON public.player_bets 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.games 
    WHERE games.id = player_bets.game_id 
    AND games.user_id = auth.uid()
  )
);