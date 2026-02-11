import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, folder: string = 'products'): Promise<string> => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      
      const { error } = await supabase.storage.from('images').upload(fileName, file);
      if (error) throw error;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
