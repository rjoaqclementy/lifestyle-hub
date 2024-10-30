import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Copy, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import PlayerCard from '../../components/soccer/PlayerCard';

const SOCCER_HUB_ID = '088aea9b-719f-40f5-b0e4-375e62be623a';

const matchTypes = [
  { id: 'casual', name: 'Casual', description: 'Friendly matches with no pressure' },
  { id: 'competitive', name: 'Competitive', description: 'Ranked matches that affect your rating' },
  { id: 'tournament', name: 'Tournament', description: 'Organized competitions with prizes' }
];

const Lobby = () => {
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);
  const [hubProfile, setHubProfile] = React.useState<any>(null);
  const [sportsProfile, setSportsProfile] = React.useState<any>(null);
  const [partyCode] = React.useState('ABC123');
  const [selectedMatchType, setSelectedMatchType] = React.useState('casual');
  const [isPartyLocked, setIsPartyLocked] = React.useState(false);

  React.useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get main profile
        const { data: mainProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(mainProfile);

        // Get hub profile
        const { data: hubData, error: hubError } = await supabase
          .from('hub_profiles')
          .select('*')
          .eq('user_id', user.id)
          .eq('hub_id', SOCCER_HUB_ID)
          .single();

        if (hubError && hubError.code !== 'PGRST116') throw hubError;
        setHubProfile(hubData);

        if (hubData) {
          // Get sports profile
          const { data: sportsData, error: sportsError } = await supabase
            .from('sports_player_profiles')
            .select('*')
            .eq('hub_profile_id', hubData.id)
            .single();

          if (!sportsError) {
            setSportsProfile(sportsData);
          }
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const copyPartyCode = () => {
    navigator.clipboard.writeText(partyCode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const completeProfile = {
    ...profile,
    ...hubProfile,
    ...sportsProfile
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-gray-900 to-gray-900" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link 
                  to="/soccer/play"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  BACK // LOBBY
                </Link>
              </div>

              {/* Match Types */}
              <div className="flex-1 flex justify-center">
                <nav className="flex space-x-1">
                  {matchTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedMatchType(type.id)}
                      className={`px-6 py-2 text-sm font-medium transition-colors ${
                        selectedMatchType === type.id
                          ? 'text-white border-b-2 border-[#573cff]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {type.name.toUpperCase()}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Party Controls */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <button
              onClick={() => setIsPartyLocked(!isPartyLocked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPartyLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isPartyLocked ? 'CLOSED PARTY' : 'OPEN PARTY'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400">PARTY CODE:</span>
              <code className="px-3 py-1 rounded bg-gray-800 font-mono">{partyCode}</code>
              <button
                onClick={copyPartyCode}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Player Cards */}
          <div className="flex justify-center items-center gap-8 mb-12">
            {/* Leader Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-[200px]"
            >
              <PlayerCard
                profile={completeProfile}
                onUpdate={() => {}}
                editable={false}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-1 bg-green-500 rounded-full text-sm font-medium">
                READY
              </div>
            </motion.div>

            {/* Empty Slots */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="w-[200px] h-[356px] rounded-lg border-2 border-dashed border-gray-800 flex items-center justify-center"
              >
                <div className="text-center text-gray-600">
                  <span className="text-4xl">+</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-4">
            <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
              PRACTICE
            </button>
            <button className="px-12 py-3 bg-[#573cff] hover:bg-[#573cff]/80 rounded font-bold text-white transition-colors">
              START
            </button>
            <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
              LEAVE PARTY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;