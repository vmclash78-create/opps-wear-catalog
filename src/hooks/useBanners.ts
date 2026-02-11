import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  link: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export function useBanners(activeOnly = true) {
  return useQuery({
    queryKey: ['banners', activeOnly],
    queryFn: async () => {
      let query = supabase.from('banners').select('*').order('display_order');
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (error) throw error;
      return data as Banner[];
    },
  });
}

export function useBannerMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (banner: { title?: string; image_url: string; link?: string; is_active?: boolean; display_order?: number }) => {
      const { data, error } = await supabase.from('banners').insert(banner).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });

  return { create, update, remove };
}
