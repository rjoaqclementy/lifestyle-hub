import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageCropper from '../ImageCropper';

interface PlayerCardProps {
  profile: any;
  onUpdate: (url: string) => Promise<void>;
  editable?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ profile, onUpdate, editable = false }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleCrop = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      // Convert blob to file
      const file = new File([croppedBlob], 'player-card.jpg', { type: 'image/jpeg' });

      // Create a unique file name
      const fileName = `${user.id}/${Date.now()}.jpg`;

      // Delete old player card if exists
      if (profile?.player_card_url) {
        const oldPath = profile.player_card_url.split('player_cards/')[1];
        if (oldPath) {
          await supabase.storage
            .from('player_cards')
            .remove([oldPath]);
        }
      }

      // Upload to player_cards bucket
      const { error: uploadError } = await supabase.storage
        .from('player_cards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('player_cards')
        .getPublicUrl(fileName);

      // Update the sports_player_profiles table
      const { error: updateError } = await supabase
        .from('sports_player_profiles')
        .update({ player_card_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      await onUpdate(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="relative w-full h-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full aspect-[9/16] rounded-lg overflow-hidden group"
      >
        {profile?.player_card_url ? (
          <img
            src={profile.player_card_url}
            alt="Player Card"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <p>No player card set</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Player info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">
            {profile?.full_name || 'Anonymous Player'}
          </h3>
          <p className="text-sm text-gray-300">
            {profile?.skill_level || 'Unranked'} • {profile?.years_experience || 'New Player'}
          </p>
        </div>

        {/* Edit overlay */}
        {editable && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-center text-white">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span>{uploading ? 'Uploading...' : 'Change Player Card'}</span>
            </div>
          </label>
        )}
      </motion.div>

      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCrop={handleCrop}
          onCancel={() => setSelectedImage(null)}
          aspectRatio={9/16}
          cropShape="rect"
        />
      )}
    </div>
  );
};

export default PlayerCard;