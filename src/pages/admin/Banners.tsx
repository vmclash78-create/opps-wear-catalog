import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Eye, EyeOff } from 'lucide-react';
import { useBanners, useBannerMutations, type Banner } from '@/hooks/useBanners';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

export default function AdminBanners() {
  const { data: banners, isLoading } = useBanners(false);
  const { create, update, remove } = useBannerMutations();
  const { upload, uploading } = useImageUpload();
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', link: '', is_active: true, display_order: 0 });
  const [imageUrl, setImageUrl] = useState('');

  const openNew = () => {
    setForm({ title: '', link: '', is_active: true, display_order: 0 });
    setImageUrl('');
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setForm({ title: b.title || '', link: b.link || '', is_active: b.is_active, display_order: b.display_order });
    setImageUrl(b.image_url);
    setEditing(b);
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    try {
      const url = await upload(file, 'banners');
      setImageUrl(url);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSave = async () => {
    if (!imageUrl) { toast.error('Adicione uma imagem'); return; }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...form, image_url: imageUrl });
        toast.success('Banner atualizado');
      } else {
        await create.mutateAsync({ ...form, image_url: imageUrl });
        toast.success('Banner criado');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este banner?')) return;
    try {
      await remove.mutateAsync(id);
      toast.success('Banner excluído');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await update.mutateAsync({ id: b.id, is_active: !b.is_active });
      toast.success(b.is_active ? 'Banner desativado' : 'Banner ativado');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Banners</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus size={16} /> Novo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-lg font-bold text-foreground">{editing ? 'Editar' : 'Novo'} Banner</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Imagem</label>
                {imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1 rounded bg-background/60 text-foreground"><X size={14} /></button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground transition-colors">
                    <Upload size={18} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{uploading ? 'Enviando...' : 'Selecionar imagem'}</span>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Título (opcional)</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Link (opcional)</label>
                <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                Ativo
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners?.map(b => (
            <div key={b.id} className="rounded-xl overflow-hidden bg-card border border-border">
              <div className="aspect-video">
                <img src={b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">{b.title || 'Sem título'}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {b.is_active ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-muted-foreground" />}
                    <span className="text-xs text-muted-foreground">{b.is_active ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleActive(b)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    {b.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {banners?.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center col-span-full">Nenhum banner cadastrado.</p>}
        </div>
      )}
    </div>
  );
}
