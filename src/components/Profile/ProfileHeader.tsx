import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfileHeaderProps {
  profile: any;
  onImageUpload: (url: string) => void;
}

const ProfileHeader = ({ profile, onImageUpload }: ProfileHeaderProps) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center space-x-6">
        <div className="relative group">
          {profile.profile_picture_url ? (
            <img 
              src={profile.profile_picture_url} 
              alt={profile.full_name || profile.username}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white">
              {(profile.full_name?.[0] || profile.email?.[0] || '?').toUpperCase()}
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera className="w-6 h-6 text-white" />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {profile.full_name || profile.username || profile.email?.split('@')[0]}
          </h2>
          <p className="text-gray-400">@{profile.username || 'username not set'}</p>
          {profile.bio && (
            <p className="text-gray-300 mt-2 max-w-md">{profile.bio}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;