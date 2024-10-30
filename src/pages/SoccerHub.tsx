import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trophy, Users, Calendar, Play, ArrowRight, TrendingUp, MapPin, Star, UserCircle2 } from 'lucide-react';

const SoccerHub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get soccer hub ID
      const { data: hubData, error: hubError } = await supabase
        .from('hubs')
        .select('id')
        .eq('name', 'soccer')
        .single();

      if (hubError) throw hubError;

      // Check if hub profile exists
      let { data: hubProfile, error: profileError } = await supabase
        .from('hub_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('hub_id', hubData.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('hub_profiles')
          .insert({
            user_id: user.id,
            hub_id: hubData.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        hubProfile = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      setProfile(hubProfile);
    } catch (error) {
      console.error('Error initializing profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Image with reduced opacity */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1540379708242-14a809bef941?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3)',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="w-20" />
            <h1 className="text-xl font-semibold flex-1 text-center">Soccer Hub</h1>
            <div className="w-20 flex justify-end">
              <Link 
                to="/soccer/profile"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <UserCircle2 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/soccer/play')}
              className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-500 p-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5" />
                <span className="text-lg font-bold">PLAY NOW</span>
              </div>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-500 p-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5" />
                <span className="text-lg font-bold">TOURNAMENTS</span>
              </div>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span className="text-lg font-bold">TEAMS</span>
              </div>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Featured Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="col-span-2 card relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2">Featured Tournament</h3>
                <p className="text-gray-400 mb-4">City League Championship starting next week! Register your team now.</p>
                <button className="btn-primary">Learn More</button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2">Your Stats</h3>
                <div className="space-y-2">
                  <p className="text-gray-400">Matches Played: 0</p>
                  <p className="text-gray-400">Goals Scored: 0</p>
                  <p className="text-gray-400">Win Rate: 0%</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Calendar className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm">Schedule</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <MapPin className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm">Venues</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Star className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm">Rankings</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <TrendingUp className="w-6 h-6 mb-2 mx-auto" />
                <span className="text-sm">Stats</span>
              </motion.button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SoccerHub;