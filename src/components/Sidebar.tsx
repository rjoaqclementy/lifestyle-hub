import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Trophy, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Teams', path: '/teams' },
    { icon: Calendar, label: 'Matches', path: '/matches' },
    { icon: Trophy, label: 'Tournaments', path: '/tournaments' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800">
      <div className="p-4">
        <Link to="/" className="flex items-center mb-8">
          <img
            className="h-8 w-auto"
            src="https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/logo.png"
            alt="Soccer Hub"
          />
          <span className="ml-2 text-xl font-bold text-white">Soccer Hub</span>
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-800 ${
                  isActive 
                    ? 'bg-[#573cff] text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;