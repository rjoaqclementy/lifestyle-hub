import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import JoinMatchModal from './JoinMatchModal';

interface MatchActionsProps {
  match: any;
  isPlayerInMatch: boolean;
  playerTeam?: string;
  onUpdate: () => void;
}

const MatchActions: React.FC<MatchActionsProps> = ({ 
  match, 
  isPlayerInMatch,
  playerTeam,
  onUpdate 
}) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLeaveMatch = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's hub profile
      const { data: hubProfile } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', match.hub_id)
        .single();

      if (!hubProfile) throw new Error('No hub profile found');

      // Remove player from match
      const { error: leaveError } = await supabase
        .from('match_players')
        .delete()
        .eq('match_id', match.id)
        .eq('player_id', hubProfile.id);

      if (leaveError) throw leaveError;

      onUpdate();
    } catch (error) {
      console.error('Error leaving match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (team: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's hub profile
      const { data: hubProfile } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('hub_id', match.hub_id)
        .single();

      if (!hubProfile) throw new Error('No hub profile found');

      await supabase
        .from('match_players')
        .insert({
          match_id: match.id,
          player_id: hubProfile.id,
          team,
          status: 'joined'
        });

      onUpdate();
    } catch (error) {
      console.error('Error joining match:', error);
    } finally {
      setLoading(false);
      setShowJoinModal(false);
    }
  };

  const spotsLeft = match.players_per_team * 2 - (match.match_players?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {isPlayerInMatch ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">You're In!</h3>
              <p className="text-sm text-gray-400">
                Playing on {playerTeam?.charAt(0).toUpperCase()}{playerTeam?.slice(1)} Team
              </p>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
              Joined
            </div>
          </div>
          <button
            onClick={handleLeaveMatch}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            <UserMinus className="w-5 h-5" />
            <span>{loading ? 'Leaving...' : 'Leave Match'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">{spotsLeft} Spots Left</h3>
            <p className="text-gray-400">Join this match to secure your spot</p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{loading ? 'Joining...' : 'Join Match'}</span>
          </button>
        </div>
      )}

      {showJoinModal && (
        <JoinMatchModal
          match={match}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinMatch}
          isOpen={showJoinModal}
        />
      )}
    </motion.div>
  );
};

export default MatchActions;