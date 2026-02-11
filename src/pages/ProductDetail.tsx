import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useProduct } from '@/hooks/useProducts';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const [currentImage, setCurrentImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square rounded-xl bg-card" />
          <div className="space-y-4">
            <div className="h-4 bg-card rounded w-1/4" />
            <div className="h-8 bg-card rounded w-3/4" />
            <div className="h-6 bg-card rounded w-1/3" />
            <div className="h-20 bg-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Link to="/catalogo" className="text-foreground underline mt-4 inline-block text-sm">Voltar ao catálogo</Link>
      </div>
    );
  }

  const images = product.images?.sort((a, b) => a.display_order - b.display_order) || [];
  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} - R$ ${Number(product.price).toFixed(2).replace('.', ',')}`);

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={16} />
        Voltar ao catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="aspect-square rounded-xl overflow-hidden bg-card relative">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImage]?.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/50 backdrop-blur-sm text-foreground">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setCurrentImage(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/50 backdrop-blur-sm text-foreground">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <span className="text-muted-foreground">Sem imagem</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === currentImage ? 'border-foreground' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {product.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{product.category.name}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-foreground mb-6">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>

          {product.description && (
            <div className="text-sm text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </div>
          )}

          <a
            href={`https://wa.me/5588992376857?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#25D366] text-background font-medium rounded-full hover:bg-[#20bd5a] transition-colors text-sm"
          >
            <MessageCircle size={18} />
            Comprar via WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  );
}
