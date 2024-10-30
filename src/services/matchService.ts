import { supabase } from '../lib/supabase';
import { HUBS } from '../lib/constants';

export const createMatch = async (matchData: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Get user's hub profile
    const { data: hubProfile, error: profileError } = await supabase
      .from('hub_profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('hub_id', HUBS.SOCCER)
      .single();

    if (profileError) throw profileError;

    // Create the match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        creator_id: hubProfile.id, // Use hub profile ID instead of user ID
        hub_id: HUBS.SOCCER,
        type: matchData.type,
        date: matchData.date,
        time: matchData.time,
        duration: parseInt(matchData.duration),
        players_per_team: parseInt(matchData.playersPerTeam),
        venue_id: matchData.venue,
        description: matchData.description,
        gender_preference: matchData.genderPreference,
        skill_level: matchData.skillLevel
      })
      .select()
      .single();

    if (matchError) throw matchError;

    // Add creator as first player
    const { error: playerError } = await supabase
      .from('match_players')
      .insert({
        match_id: match.id,
        player_id: hubProfile.id, // Use hub profile ID
        team: 'home',
        status: 'ready'
      });

    if (playerError) throw playerError;

    return match;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const getMatchDetails = async (matchId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      creator:hub_profiles!matches_creator_hub_profile_fkey(
        id,
        bio,
        profile_picture_url,
        user:profiles!hub_profiles_user_id_fkey(
          full_name
        )
      ),
      venue:venues(*),
      match_players(
        *,
        player:hub_profiles(
          id,
          bio,
          profile_picture_url,
          user:profiles!hub_profiles_user_id_fkey(
            full_name
          )
        )
      )
    `)
    .eq('id', matchId)
    .single();

  if (error) throw error;
  return data;
};

export const joinMatch = async (matchId: string, team: 'home' | 'away') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Get user's hub profile
    const { data: hubProfile, error: profileError } = await supabase
      .from('hub_profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('hub_id', HUBS.SOCCER)
      .single();

    if (profileError) throw profileError;

    const { error } = await supabase
      .from('match_players')
      .insert({
        match_id: matchId,
        player_id: hubProfile.id, // Use hub profile ID
        team,
        status: 'joined'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error joining match:', error);
    throw error;
  }
};