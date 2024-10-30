-- Add players_list_public column to matches table
ALTER TABLE matches 
ADD COLUMN players_list_public BOOLEAN NOT NULL DEFAULT true;