import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('busca') || '');

  const categorySlug = searchParams.get('categoria') || undefined;
  const search = searchParams.get('busca') || undefined;
  const sort = searchParams.get('ordem') || 'recent';

  const { data: products, isLoading } = useProducts({ categorySlug, search, sort });
  const { data: categories } = useCategories();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('busca', searchInput || null);
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Coleção</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Catálogo</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </form>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateParam('categoria', null)}
            className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
              !categorySlug ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos
          </button>
          {categories?.map(cat => (
            <button
              key={cat.id}
              onClick={() => updateParam('categoria', cat.slug)}
              className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                categorySlug === cat.slug ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={e => updateParam('ordem', e.target.value)}
          className="px-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none"
        >
          <option value="recent">Recentes</option>
          <option value="featured">Destaque</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-lg bg-card mb-3" />
              <div className="h-3 bg-card rounded w-2/3 mb-2" />
              <div className="h-3 bg-card rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        </div>
      )}
    </div>
  );
}
