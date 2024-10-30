import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Trophy, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Teams', path: '/teams' },
    { icon: Calendar, label: 'Matches', path: '/matches' },
    { icon: Trophy, label: 'Tournaments', path: '/tournaments' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 z-50 shadow-xl"
      initial={false}
      animate={{
        width: isHovered ? '16rem' : '4.5rem',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
    >
      <div className="p-4">
        <Link to="/" className="flex items-center mb-8 overflow-hidden">
          <img
            className="h-8 w-auto"
            src="https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/logo.png"
            alt="Lifestyle Hub"
          />
          <motion.span
            className="ml-2 text-xl font-bold text-white whitespace-nowrap"
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -20,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut'
            }}
          >
            Lifestyle Hub
          </motion.span>
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-800 group relative ${
                  isActive 
                    ? 'bg-[#573cff] text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 min-w-[1.25rem]" />
                <motion.span
                  className="ml-3 whitespace-nowrap"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -20,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeInOut'
                  }}
                >
                  {item.label}
                </motion.span>
                {!isHovered && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-800 text-gray-300 hover:text-white group relative"
          >
            <LogOut className="h-5 w-5 min-w-[1.25rem]" />
            <motion.span
              className="ml-3 whitespace-nowrap"
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -20,
              }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut'
              }}
            >
              Sign Out
            </motion.span>
            {!isHovered && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Sign Out
              </div>
            )}
          </button>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;