import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users } from 'lucide-react';

interface PlayersListProps {
  players: any[];
  totalSlots: number;
  onInvite: () => void;
}

const PlayersList: React.FC<PlayersListProps> = ({ players, totalSlots, onInvite }) => {
  const homeTeamPlayers = players.filter(p => p.team === 'home');
  const awayTeamPlayers = players.filter(p => p.team === 'away');

  const renderTeam = (teamPlayers: any[], teamName: string) => (
    <div>
      <h4 className="font-semibold mb-3">{teamName} Team</h4>
      <div className="space-y-3">
        {teamPlayers.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50"
          >
            {player.player?.player_card_url ? (
              <img
                src={player.player.player_card_url}
                alt={player.player?.full_name || 'Player'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div>
              <span>{player.player?.full_name || 'Anonymous Player'}</span>
              {player.status === 'ready' && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full">
                  Ready
                </span>
              )}
            </div>
          </div>
        ))}
        {Array.from({ length: (totalSlots / 2) - teamPlayers.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-gray-500">Open Slot</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Players</h3>
        <button
          onClick={onInvite}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {renderTeam(homeTeamPlayers, 'Home')}
        <div className="border-t border-gray-800" />
        {renderTeam(awayTeamPlayers, 'Away')}
      </div>
    </motion.div>
  );
};

export default PlayersList;