import { supabase } from '../lib/supabase';

export const uploadProfilePicture = async (file: File, userId: string, oldUrl: string | null) => {
  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  // Delete old image if exists
  if (oldUrl) {
    const oldPath = oldUrl.split('profile_pictures/')[1];
    if (oldPath) {
      await supabase.storage
        .from('profile_pictures')
        .remove([oldPath])
        .catch(error => console.warn('Failed to delete old image:', error));
    }
  }

  // Upload new image
  const { error: uploadError, data } = await supabase.storage
    .from('profile_pictures')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile_pictures')
    .getPublicUrl(fileName);

  if (!publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return publicUrl;
};