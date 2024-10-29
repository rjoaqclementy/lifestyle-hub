import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" replace /> : <Auth />} 
          />
          <Route path="/teams" element={<div className="p-8">Teams page coming soon...</div>} />
          <Route path="/matches" element={<div className="p-8">Matches page coming soon...</div>} />
          <Route path="/tournaments" element={<div className="p-8">Tournaments page coming soon...</div>} />
          <Route path="/settings" element={<div className="p-8">Settings page coming soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;