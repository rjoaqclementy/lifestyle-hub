import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const useMatch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserHubProfile, setCurrentUserHubProfile] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        // Get current user's hub profile first
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: hubProfile } = await supabase
            .from('hub_profiles')
            .select('*')
            .eq('user_id', user.id)
            .eq('hub_id', '088aea9b-719f-40f5-b0e4-375e62be623a') // Soccer hub ID
            .single();

          setCurrentUserHubProfile(hubProfile);
        }

        // Fetch match details
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select(`
            *,
            venue:venues(*),
            creator:hub_profiles!matches_creator_hub_profile_fkey(
              id,
              profile_picture_url,
              name,
              bio
            ),
            match_players(
              id,
              player_id,
              team,
              status,
              hub_profile:hub_profiles(
                id,
                profile_picture_url,
                name,
                bio
              )
            )
          `)
          .eq('id', id)
          .single();

        if (matchError) throw matchError;

        setMatch(matchData);
        setIsOrganizer(currentUserHubProfile?.id === matchData.creator_id);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  return { match, loading, error, isOrganizer, currentUserHubProfile };
};

export default useMatch;