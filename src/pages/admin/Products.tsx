import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Upload, X } from 'lucide-react';
import { useAdminProducts, useProductMutations, type Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const { data: products, isLoading } = useAdminProducts();
  const { data: categories } = useCategories();
  const { createProduct, updateProduct, deleteProduct, addImage, removeImage } = useProductMutations();
  const { upload, uploading } = useImageUpload();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', is_active: true, is_featured: false, display_order: 0,
  });

  const openNew = () => {
    setForm({ name: '', description: '', price: '', category_id: '', is_active: true, is_featured: false, display_order: 0 });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      category_id: p.category_id || '',
      is_active: p.is_active,
      is_featured: p.is_featured,
      display_order: p.display_order,
    });
    setEditing(p);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Preencha nome e preço'); return; }
    const slug = slugify(form.name);
    const data = { ...form, slug, price: parseFloat(form.price), category_id: form.category_id || undefined };

    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, ...data });
        toast.success('Produto atualizado');
      } else {
        await createProduct.mutateAsync(data as any);
        toast.success('Produto criado');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Produto excluído');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleImageUpload = async (productId: string, files: FileList) => {
    for (const file of Array.from(files)) {
      try {
        const url = await upload(file, 'products');
        await addImage.mutateAsync({ productId, imageUrl: url });
        toast.success('Imagem adicionada');
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      await removeImage.mutateAsync(imageId);
      toast.success('Imagem removida');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Produtos</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus size={16} /> Novo
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-lg font-bold text-foreground">{editing ? 'Editar' : 'Novo'} Produto</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Nome</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Descrição</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Preço (R$)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Categoria</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none">
                    <option value="">Nenhuma</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                  Ativo
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="rounded" />
                  Destaque
                </label>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Ordem</label>
                <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>

              {/* Images for existing product */}
              {editing && (
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Imagens</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editing.images?.map(img => (
                      <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg text-xs text-foreground cursor-pointer hover:bg-accent/80 transition-colors">
                    <Upload size={14} />
                    {uploading ? 'Enviando...' : 'Adicionar imagem'}
                    <input type="file" accept="image/*" multiple onChange={e => e.target.files && handleImageUpload(editing.id, e.target.files)} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Products list */}
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Carregando...</div>
      ) : (
        <div className="space-y-2">
          {products?.map(p => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {p.images?.[0] ? (
                  <img src={p.images[0].image_url} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{p.name}</span>
                  {p.is_featured && <Star size={12} className="text-gold flex-shrink-0" fill="currentColor" />}
                  {!p.is_active && <EyeOff size={12} className="text-muted-foreground flex-shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground">
                  R$ {Number(p.price).toFixed(2).replace('.', ',')} · {p.category?.name || 'Sem categoria'}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {products?.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum produto cadastrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
