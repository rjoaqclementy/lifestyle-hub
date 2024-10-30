import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trophy, Target, Car, Beer, Droplets } from 'lucide-react';

interface MatchDetailsProps {
  match: any;
  venue: any;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, venue }) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Match Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold capitalize">{match.type} Match</h2>
            <p className="text-gray-400 mt-1">
              {match.players_per_team}v{match.players_per_team} • {match.gender_preference} • {match.skill_level || 'All Levels'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${getStatusColor(match.status)} font-medium`}>
            {match.status === 'open' && 'Open'}
            {match.status === 'in_pro