import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import SoccerHub from './pages/SoccerHub';
import SoccerProfile from './pages/SoccerProfile';
import Play from './pages/soccer/Play';
import Lobby from './pages/soccer/Lobby';
import Match from './pages/soccer/Match';
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
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/soccer/*" 
            element={user ? <SoccerHub /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/soccer/profile" 
            element={user ? <SoccerProfile /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/soccer/play" 
            element={user ? <Play /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/soccer/lobby" 
            element={user ? <Lobby /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/soccer/match/:id" 
            element={user ? <Match /> : <Navigate to="/auth" replace />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;