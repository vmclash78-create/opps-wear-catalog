import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Fale conosco</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Contato</h1>
        <p className="text-muted-foreground mb-12">
          Tem dúvidas ou quer saber mais? Entre em contato conosco.
        </p>

        <div className="grid gap-4">
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
              <MessageCircle size={20} className="text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-foreground">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">(00) 00000-0000</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Mail size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-foreground">Email</h3>
              <p className="text-sm text-muted-foreground">contato@oppswear.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <MapPin size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-foreground">Localização</h3>
              <p className="text-sm text-muted-foreground">Brasil</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
