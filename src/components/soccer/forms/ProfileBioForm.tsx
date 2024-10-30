import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageCropper from '../../ImageCropper';
import { supabase } from '../../../lib/supabase';

interface ProfileBioFormProps {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
}

const ProfileBioForm: React.FC<ProfileBioFormProps> = ({ profile, onUpdate, loading }) => {
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ bio });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleCrop = async (croppedBlob: Blob) => {
    try {
      setUploadingImage(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      // Convert blob to file
      const file = new File([croppedBlob], 'profile-picture.jpg', { type: 'image/jpeg' });

      // Create a unique file name
      const fileName = `${user.id}/${Date.now()}.jpg`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(fileName);

      await onUpdate({ profile_picture_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
      setSelectedImage(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#573cff] to-blue-500" />
      
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Bio</h2>

        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-[#573cff] transition-all duration-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-gray-700 group-hover:ring-[#573cff] transition-all duration-300">
                  <span className="text-3xl text-gray-400">?</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="profile-picture"
                disabled={uploadingImage || loading}
              />
              <label
                htmlFor="profile-picture"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
              >
                <span className="text-sm font-medium text-white">
                  {uploadingImage ? 'Uploading...' : 'Change'}
                </span>
              </label>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">
                {profile?.full_name || 'Your Name'}
              </h3>
              <p className="text-sm text-gray-400">
                {profile?.skill_level || 'Skill Level Not Set'} • {profile?.years_experience || 'Experience Not Set'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleBioSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#573cff] focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
              placeholder="Tell us about yourself as a player..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? 'Saving...' : 'Save Bio'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#573cff] to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </form>
      </div>

      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCrop={handleCrop}
          onCancel={() => setSelectedImage(null)}
        />
      )}
    </motion.div>
  );
};

export default ProfileBioForm;