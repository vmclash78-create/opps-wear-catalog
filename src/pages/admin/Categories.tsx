import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useCategories, useCategoryMutations, type Category } from '@/hooks/useCategories';
import { toast } from 'sonner';

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const { create, update, remove } = useCategoryMutations();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', display_order: 0 });

  const openNew = () => {
    setForm({ name: '', description: '', display_order: 0 });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description || '', display_order: c.display_order });
    setEditing(c);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('Preencha o nome'); return; }
    const slug = slugify(form.name);
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...form, slug });
        toast.success('Categoria atualizada');
      } else {
        await create.mutateAsync({ ...form, slug });
        toast.success('Categoria criada');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria?')) return;
    try {
      await remove.mutateAsync(id);
      toast.success('Categoria excluída');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Categorias</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
          <Plus size={16} /> Nova
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-lg font-bold text-foreground">{editing ? 'Editar' : 'Nova'} Categoria</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Nome</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Descrição</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Ordem</label>
                <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
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
        <div className="space-y-2">
          {categories?.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div>
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {categories?.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma categoria cadastrada.</p>}
        </div>
      )}
    </div>
  );
}
