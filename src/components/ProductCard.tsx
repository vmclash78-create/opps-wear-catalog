import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const mainImage = product.images?.sort((a, b) => a.display_order - b.display_order)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/produto/${product.slug}`} className="group block">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
          {mainImage ? (
            <img
              src={mainImage.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground text-sm">Sem imagem</span>
            </div>
          )}
        </div>
        <div>
          {product.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-sans text-sm font-medium text-foreground group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-sm font-semibold text-foreground mt-1">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
