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
            {match.status === 'in_progress' && 'In Progress'}
            {match.status === 'completed' && 'Completed'}
            {match.status === 'cancelled' && 'Cancelled'}
          </div>
        </div>
      </motion.div>

      {/* Match Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h3 className="font-semibold mb-6">Schedule & Location</h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Calendar className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-semibold">
                {new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <Clock className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="font-semibold">
                {formatTime(match.time)} ({match.duration} minutes)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#573cff]/10 rounded-lg">
              <MapPin className="w-5 h-5 text-[#573cff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Venue</p>
              <p className="font-semibold">{venue?.name}</p>
              <p className="text-gray-400 text-sm">{venue?.address}</p>
            </div>
          </div>

          {venue && (
            <div className="flex gap-4 mt-4">
              {venue.has_parking && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Car className="w-4 h-4" />
                  <span>Parking</span>
                </div>
              )}
              {venue.has_bar && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Beer className="w-4 h-4" />
                  <span>Bar</span>
                </div>
              )}
              {venue.has_showers && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Droplets className="w-4 h-4" />
                  <span>Showers</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Match Description */}
      {match.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="font-semibold mb-4">Description</h3>
          <p className="text-gray-300">{match.description}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MatchDetails;