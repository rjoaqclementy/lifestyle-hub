import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/matches" className="btn-primary block text-center">Schedule Match</Link>
              <Link to="/teams" className="btn-primary block text-center">Create Team</Link>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-2">Upcoming Matches</h2>
            <p className="text-gray-400">No upcoming matches</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-2">Your Teams</h2>
            <p className="text-gray-400">No teams yet</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-6 lg:px-8 py-24 flex items-center"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Organize Soccer Games
              <span className="text-[#573cff]"> With Friends</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Join the ultimate platform for organizing and managing soccer games with your friends.
              Schedule matches, track scores, and build your community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/auth" className="btn-primary">
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Users className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-400">Create and manage your teams with ease. Invite friends and organize matches.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Calendar className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schedule Games</h3>
              <p className="text-gray-400">Plan your matches ahead with our intuitive scheduling system.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <MapPin className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Venue Booking</h3>
              <p className="text-gray-400">Find and book the perfect venue for your soccer matches.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;