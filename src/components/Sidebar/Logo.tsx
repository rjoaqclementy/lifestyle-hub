import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CommonProps } from './types';

const Logo = ({ isExpanded }: CommonProps) => {
  return (
    <Link to="/" className="flex items-center mb-8 overflow-hidden">
      <img
        className="h-8 w-auto"
        src="https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/logo.png"
        alt="Lifestyle Hub"
      />
      <motion.span
        className="ml-2 text-xl font-bold text-white whitespace-nowrap origin-left"
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? 'auto' : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        Lifestyle Hub
      </motion.span>
    </Link>
  );
};