import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';
import heroBannerFallback from '@/assets/hero-banner.jpg';

export default function HeroBanner() {
  const { data: banners } = useBanners();
  const [current, setCurrent] = useState(0);

  const slides = banners && banners.length > 0
    ? banners.map(b => ({ image: b.image_url, title: b.title, link: b.link }))
    : [{ image: heroBannerFallback, title: 'Nova Coleção', link: '/catalogo' }];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title || 'Banner'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {slides[current].title && (
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 max-w-xl">
                {slides[current].title}
              </h1>
            )}
            <Link
              to={slides[current].link || '/catalogo'}
              className="inline-block px-8 py-3 text-sm font-medium uppercase tracking-widest bg-foreground text-background rounded-full hover:bg-gold hover:text-background transition-colors duration-300"
            >
              Explorar
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Nav arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-foreground w-6' : 'bg-foreground/30'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
