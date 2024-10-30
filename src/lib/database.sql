-- Update match status check constraint
ALTER TABLE matches 
DROP CONSTRAINT IF EXISTS matches_status_check;

ALTER TABLE matches
ADD CONSTRAINT matches_status_check 
CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled'));

-- Update existing pending matches to open
UPDATE matches 
SET status = 'open' 
WHERE status = 'pending';