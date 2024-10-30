import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import ProfileBioForm from './forms/ProfileBioForm';
import PlayerDetailsForm from './forms/PlayerDetailsForm';

interface EditSoccerProfileProps {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
}

const EditSoccerProfile: React.FC<EditSoccerProfileProps> = ({ profile, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      await onUpdate(updatedData);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 md:grid-cols-2"
      >
        <div>
          <ProfileBioForm
            profile={profile}
            onUpdate={handleUpdateProfile}
            loading={loading}
          />
        </div>

        <div>
          <PlayerDetailsForm
            profile={profile}
            onUpdate={handleUpdateProfile}
            loading={loading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default EditSoccerProfile;