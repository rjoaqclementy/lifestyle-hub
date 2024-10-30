import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Trophy, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';
import Logo from './Logo';
import SignOutButton from './SignOutButton';
import { MenuItem as MenuItemType } from './types';

const menuItems: MenuItemType[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Users, label: 'Teams', path: '/teams' },
  { icon: Calendar, label: 'Matches', path: '/matches' },
  { icon: Trophy, label: 'Tournaments', path: '/tournaments' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <motion.div
      className="
        fixed left-0 top-0 h-screen
        bg-gray-900/95 backdrop-blur-lg
        border-r border-gray-800 z-50
        shadow-xl flex flex-col
      "
      initial={{ width: '4.5rem' }}
      animate={{
        width: isExpanded ? '16rem' : '4.5rem',
      }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="flex-1 p-4">
        <Logo isExpanded={isExpanded} />
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
              isExpanded={isExpanded}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <SignOutButton isExpanded={isExpanded} />
      </div>
    </motion.div>
  );
};

export default Sidebar;