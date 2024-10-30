import React from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CommonProps } from './types';

const SignOutButton = ({ isExpanded }: CommonProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <button
      onClick={handleSignOut}
      className="
        w-full flex items-center px-4 py-3 text-sm font-medium
        rounded-lg transition-colors duration-200 relative group
        text-gray-300 hover:text-white hover:bg-gray-800
      "
    >
      <LogOut className="h-5 w-5 min-w-[1.25rem]" />
      
      <motion.span
        className="ml-3 whitespace-nowrap origin-left"
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? 'auto' : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        Sign Out
      </motion.span>

      {!isExpanded && (
        <div className="
          absolute left-full top-1/2 -translate-y-1/2 ml-2
          px-2 py-1 bg-gray-800 text-white text-sm
          rounded-md opacity-0 group-hover:opacity-100
          pointer-events-none shadow-lg border border-gray-700
          whitespace-nowrap z-50 transition-opacity duration-150
        ">
          Sign Out
        </div>
      )}
    </button>
  );
};