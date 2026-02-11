import { useAdminProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBanners } from '@/hooks/useBanners';
import { Package, Grid3X3, Image } from 'lucide-react';

export default function AdminDashboard() {
  const { data: products } = useAdminProducts();
  const { data: categories } = useCategories();
  const { data: banners } = useBanners(false);

  const stats = [
    { label: 'Produtos', value: products?.length || 0, icon: Package },
    { label: 'Categorias', value: categories?.length || 0, icon: Grid3X3 },
    { label: 'Banners', value: banners?.length || 0, icon: Image },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
