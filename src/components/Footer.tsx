import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">
              OPPS<span className="text-gradient-gold">WEAR</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Moda masculina premium com estilo e atitude. Peças selecionadas para homens que valorizam qualidade e design.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Navegação</h4>
            <div className="flex flex-col gap-2">
              <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Catálogo</Link>
              <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</Link>
              <Link to="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</Link>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Contato</h4>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Opps Wear. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
