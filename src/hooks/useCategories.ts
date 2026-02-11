import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('display_order');
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useCategoryMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (cat: { name: string; slug: string; description?: string; display_order?: number }) => {
      const { data, error } = await supabase.from('categories').insert(cat).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; slug?: string; description?: string; display_order?: number }) => {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  return { create, update, remove };
}
