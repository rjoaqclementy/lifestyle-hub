import React from 'react';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Calendar, Users, Activity, Heart, Brain, Coffee, UserCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const hubs = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Lifestyle Hub',
    icon: Activity,
    color: 'from-purple-500 to-indigo-500',
    description: 'Organize and track your daily activities, habits, and goals',
    path: '/lifestyle'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Soccer Hub',
    icon: Coffee,
    color: 'from-green-500 to-emerald-500',
    description: 'Connect with soccer teams, organize matches, and track tournaments',
    path: '/soccer'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Basketball Hub',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    description: 'Find basketball courts, teams, and organize pickup games',
    path: '/basketball'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Tennis Hub',
    icon: Heart,
    color: 'from-yellow-500 to-orange-500',
    description: 'Book tennis courts, find partners, and join tournaments',
    path: '/tennis'
  }
];

const Home = () => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleHubClick = (hub) => {
    navigate(hub.path, { state: { hubId: hub.id } });
  };

  if (user) {
    return (
      <div>
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="w-20" />
            <h1 className="text-xl font-semibold flex-1 text-center">Home</h1>
            <div className="flex items-center space-x-4 w-20 justify-end">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Compass className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
              </button>
              <Link 
                to="/profile"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <UserCircle2 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card"
              >
                <Calendar className="w-8 h-8 text-[#573cff] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Today's Schedule</h3>
                <p className="text-gray-400">View your planned activities and events</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card"
              >
                <Activity className="w-8 h-8 text-[#573cff] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Activity Tracking</h3>
                <p className="text-gray-400">Monitor your daily progress and habits</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card"
              >
                <Users className="w-8 h-8 text-[#573cff] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Communities</h3>
                <p className="text-gray-400">Connect with people sharing your interests</p>
              </motion.div>
            </div>
          </section>

          {/* Hubs Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Explore Hubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hubs.map((hub) => {
                const Icon = hub.icon;
                return (
                  <motion.div
                    key={hub.id}
                    whileHover={{ scale: 1.02 }}
                    className={`card relative overflow-hidden group cursor-pointer`}
                    onClick={() => handleHubClick(hub)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${hub.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative">
                      <Icon className="w-8 h-8 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{hub.name}</h3>
                      <p className="text-gray-400 mb-4">{hub.description}</p>
                      <button className="btn-primary">
                        Enter Hub
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
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
              Organize Your
              <span className="text-[#573cff]"> Lifestyle</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Join the ultimate platform for organizing and managing your lifestyle.
              Track activities, connect with communities, and achieve your goals.
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
              <Activity className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Activity Tracking</h3>
              <p className="text-gray-400">Monitor and organize your daily activities with ease.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Users className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-400">Connect with like-minded people and share experiences.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <Calendar className="w-12 h-12 text-[#573cff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Planning</h3>
              <p className="text-gray-400">Plan and organize your activities efficiently.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;