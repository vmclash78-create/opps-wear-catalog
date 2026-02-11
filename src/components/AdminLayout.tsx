import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Grid3X3, Image, LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/categorias', label: 'Categorias', icon: Grid3X3 },
  { to: '/admin/banners', label: 'Banners', icon: Image },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="font-display text-lg font-bold">
            OPPS<span className="text-gradient-gold">WEAR</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
            <ArrowLeft size={18} />
            Ver site
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-accent/50 transition-colors w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="font-display text-sm font-bold">
          OPPS<span className="text-gradient-gold">WEAR</span>
        </Link>
        <div className="flex gap-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`p-2 rounded-lg ${location.pathname === item.to ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
            >
              <item.icon size={18} />
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 md:pt-0 pt-14 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
