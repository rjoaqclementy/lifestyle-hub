import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HUBS } from '../lib/constants';

export const useMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: matchesData, error: matchError } = await supabase
          .from('matches')
          .select(`
            *,
            creator:hub_profiles!matches_creator_hub_profile_fkey(
              id,
              name,
              profile_picture_url
            ),
            venue:venues(
              id,
              name,
              address,
              image_url
            ),
            match_players(
              id,
              player_id,
              team,
              status
            )
          `)
          .eq('status', 'open')
          .eq('hub_id', HUBS.SOCCER)
          .order('created_at', { ascending: false });

        if (matchError) throw matchError;

        const formattedMatches = matchesData?.map(match => ({
          ...match,
          creator: {
            ...match.creator,
            name: match.creator?.name || 'Anonymous Player'
          },
          venue: match.venue,
          players: match.match_players || []
        }));

        setMatches(formattedMatches || []);
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
};

export default useMatches;