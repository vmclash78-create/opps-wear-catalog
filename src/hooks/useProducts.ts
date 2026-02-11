import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: { id: string; name: string; slug: string } | null;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export function useProducts(filters?: { categorySlug?: string; search?: string; sort?: string; featured?: boolean }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, category:categories(id, name, slug), images:product_images(*)');

      if (filters?.categorySlug) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.categorySlug).single();
        if (cat) query = query.eq('category_id', cat.id);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters?.sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (filters?.sort === 'price_desc') query = query.order('price', { ascending: false });
      else if (filters?.sort === 'featured') query = query.order('is_featured', { ascending: false }).order('display_order');
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(id, name, slug), images:product_images(*)')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(id, name, slug), images:product_images(*)')
        .order('display_order');
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProductMutations() {
  const qc = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (product: { name: string; slug: string; description?: string; price: number; category_id?: string; is_active?: boolean; is_featured?: boolean; display_order?: number }) => {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  const addImage = useMutation({
    mutationFn: async ({ productId, imageUrl, displayOrder }: { productId: string; imageUrl: string; displayOrder?: number }) => {
      const { data, error } = await supabase.from('product_images').insert({ product_id: productId, image_url: imageUrl, display_order: displayOrder || 0 }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  const removeImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });

  return { createProduct, updateProduct, deleteProduct, addImage, removeImage };
}
