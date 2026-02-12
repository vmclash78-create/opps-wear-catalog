import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // LOGIN FIXO TEMPORÁRIO
    if (email === "admin@opps.com" && password === "123456") {
      navigate('/admin');
    } else {
      toast.error('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold">
            OPPS<span className="text-gradient-gold">WEAR</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-foreground text-background rounded-lg text-sm font-medium"
          >
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
