import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Bookmark, Share2, Eye, EyeOff } from 'lucide-react';
import useMatch from '../../hooks/useMatch';
import MatchDetails from '../../components/soccer/match/MatchDetails';
import MatchOrganizer from '../../components/soccer/match/MatchOrganizer';
import PlayersList from '../../components/soccer/match/PlayersList';
import MatchActions from '../../components/soccer/match/MatchActions';
import EditMatchModal from '../../components/soccer/match/EditMatchModal';
import ManagePlayersModal from '../../components/soccer/match/ManagePlayersModal';
import DistributeTeamsModal from '../../components/soccer/match/DistributeTeamsModal';
import { supabase } from '../../lib/supabase';

const Match = () => {
  const navigate = useNavigate();
  const { match, loading, error, isOrganizer, currentUserHubProfile } = useMatch();
  const [isAdminView, setIsAdminView] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManagePlayersModal, setShowManagePlayersModal] = useState(false);
  const [showDistributeTeamsModal, setShowDistributeTeamsModal] = useState(false);

  const handleToggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };

  const handleUpdateMatch = async () => {
    // Refresh match data after updates
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Match</h2>
          <p className="text-gray-400 mb-4">Unable to load match details.</p>
          <button
            onClick={() => navigate('/soccer/play')}
            className="btn-primary"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  const isPlayerInMatch = match.match_players?.some(
    p => p.player_id === currentUserHubProfile?.id
  );

  const playerTeam = match.match_players?.find(
    p => p.player_id === currentUserHubProfile?.id
  )?.team;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pb-8"
    >
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/soccer/play')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center">Match Details</h1>
          <div className="flex items-center space-x-2">
            {isOrganizer && (
              <button
                onClick={handleToggleAdminView}
                className={`p-2 rounded-lg transition-colors ${
                  isAdminView ? 'bg-[#573cff] text-white' : 'hover:bg-gray-800'
                }`}
              >
                {isAdminView ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            )}
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <MatchDetails match={match} venue={match.venue} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Actions (Join/Leave) */}
            <MatchActions
              match={match}
              isPlayerInMatch={isPlayerInMatch}
              playerTeam={playerTeam}
              onUpdate={handleUpdateMatch}
            />

            {/* Match Organizer */}
            <MatchOrganizer creator={match.creator} />

            {/* Admin Controls */}
            {isOrganizer && isAdminView && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 space-y-4"
              >
                <h3 className="font-semibold mb-4">Admin Controls</h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-primary w-full"
                >
                  Edit Match Details
                </button>
                <button
                  onClick={() => setShowManagePlayersModal(true)}
                  className="btn-primary w-full"
                >
                  Manage Players
                </button>
                <button
                  onClick={() => setShowDistributeTeamsModal(true)}
                  className="btn-primary w-full"
                >
                  Distribute Teams
                </button>
              </motion.div>
            )}

            {/* Players List */}
            <PlayersList 
              players={match.match_players || []} 
              totalSlots={match.players_per_team * 2}
              showPrivate={isAdminView || match.players_list_public}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditMatchModal
          match={match}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateMatch}
        />
      )}

      {showManagePlayersModal && (
        <ManagePlayersModal
          match={match}
          isOpen={showManagePlayersModal}
          onClose={() => setShowManagePlayersModal(false)}
          players={match.match_players || []}
          onUpdate={handleUpdateMatch}
        />
      )}

      {showDistributeTeamsModal && (
        <DistributeTeamsModal
          match={match}
          isOpen={showDistributeTeamsModal}
          onClose={() => setShowDistributeTeamsModal(false)}
          players={match.match_players || []}
          onUpdate={handleUpdateMatch}
        />
      )}
    </motion.div>
  );
};

export default Match;