import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function Index() {
  const { data: featured } = useProducts({ featured: true });
  const { data: categories } = useCategories();

  return (
    <>
      <HeroBanner />

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Curadoria</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Em Destaque</h2>
            </div>
            <Link to="/catalogo" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver tudo <ArrowRight size={14} />
            </Link>
          </div>

          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Produtos em destaque em breve.</p>
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver tudo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Explore</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Categorias</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/catalogo?categoria=${cat.slug}`}
                    className="block p-8 rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-all text-center group"
                  >
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground group-hover:text-gold transition-colors">
                      {cat.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Estilo é atitude</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Encontre peças exclusivas que definem quem você é. Qualidade premium para homens de bom gosto.
          </p>
          <Link
            to="/catalogo"
            className="inline-block px-8 py-3 text-sm font-medium uppercase tracking-widest bg-foreground text-background rounded-full hover:bg-gold transition-colors duration-300"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
