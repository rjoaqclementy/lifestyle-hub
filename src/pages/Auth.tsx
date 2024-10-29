import React, { useEffect } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen pt-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto pt-20"
      >
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Welcome to Soccer Hub</h2>
            <p className="text-gray-400 mt-2">Sign in or create an account to get started</p>
          </div>
          
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#573cff',
                    brandAccent: '#573cff',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={['google', 'github']}
            redirectTo={window.location.origin}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;