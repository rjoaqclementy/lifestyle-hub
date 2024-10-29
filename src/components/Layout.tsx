import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div>
      {user ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main>{children}</main>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
        </>
      )}
    </div>
  );
};

export default Layout;