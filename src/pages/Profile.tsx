import React from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileImage from '../components/ProfileImage';
import ProfileForm from '../components/ProfileForm';
import HubProfiles from '../components/Profile/HubProfiles';

const Profile = () => {
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    full_name: '',
    bio: '',
    city: '',
    country: '',
    gender: '',
    interests: '',
  });

  React.useEffect(() => {
    fetchProfile();
  }, []);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        country: profile.country || '',
        gender: profile.gender || '',
        interests: profile.interests?.join(', ') || '',
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const updates = {
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile({ ...profile, ...updates });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfileImageUpdate = (url: string) => {
    setProfile(prev => ({ ...prev, profile_picture_url: url }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="w-20" />
          <h1 className="text-xl font-semibold flex-1 text-center">Profile</h1>
          <div className="w-20 flex justify-end">
            {editing ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditing(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSubmit}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-green-500"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-6">
            <ProfileImage
              url={profile.profile_picture_url}
              onUpload={handleProfileImageUpdate}
              size={150}
            />
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">
                    {profile.full_name || profile.username || profile.email?.split('@')[0]}
                  </h2>
                  <p className="text-gray-400">@{profile.username || 'username not set'}</p>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              rows={3}
              className="w-full mt-6 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
            />
          ) : profile.bio && (
            <p className="text-gray-300 mt-6">{profile.bio}</p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
          
          <div className="space-y-4">
            {editing ? (
              <ProfileForm data={formData} onChange={handleChange} />
            ) : (
              <>
                {(profile.city || profile.country) && (
                  <p className="text-gray-300">
                    📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </p>
                )}

                {profile.gender && (
                  <p className="text-gray-300">
                    ⚡ {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                  </p>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest: string) => (
                        <span 
                          key={interest}
                          className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-gray-300">
                  🎉 Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Hub Profiles Section */}
        <HubProfiles userId={profile.id} />
      </div>
    </div>
  );
};

export default Profile;