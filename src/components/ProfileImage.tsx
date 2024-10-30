import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateImageFile } from '../utils/fileValidation';
import { uploadProfilePicture } from '../utils/storage';
import ImageCropModal from './ImageCropModal';

interface ProfileImageProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

const ProfileImage = ({ 
  url, 
  onUpload, 
  size = 150
}: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload');
      }

      const file = event.target.files[0];
      validateImageFile(file);
      
      setSelectedFile(file);
      setIsCropModalOpen(true);
    } catch (error: any) {
      setError(error.message || 'Failed to select image');
      console.error('Error selecting image:', error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setError(null);
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Convert blob to file
      const croppedFile = new File([croppedBlob], selectedFile?.name || 'profile.jpg', {
        type: croppedBlob.type,
      });

      const publicUrl = await uploadProfilePicture(croppedFile, user.id, url);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      onUpload(publicUrl);
    } catch (error: any) {
      setError(error.message || 'Failed to upload image');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setIsCropModalOpen(false);
    }
  };

  return (
    <div className="relative">
      <div 
        className="relative group cursor-pointer"
        style={{ width: size, height: size }}
      >
        {url ? (
          <img
            src={url}
            alt="Profile"
            className="rounded-full object-cover w-full h-full border-2 border-gray-700 group-hover:border-[#573cff] transition-colors"
            style={{ width: size, height: size }}
          />
        ) : (
          <div 
            className="rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700 group-hover:border-[#573cff] transition-colors"
            style={{ width: size, height: size }}
          >
            <span className="text-gray-400 text-2xl">?</span>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />
          <button
            className="p-2 bg-[#573cff] rounded-full hover:bg-[#573cff]/80 transition-colors disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera size={20} />
          </button>
        </div>
      </div>
      
      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
        </div>
      )}

      {selectedFile && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setSelectedFile(null);
          }}
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default ProfileImage;