'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, User, Lock, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError('Por favor completa todos los campos');
        setIsLoading(false);
        return;
      }

      // Llamar al endpoint de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      // Login exitoso
      login(data.user);
      router.push('/');
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 mb-4 mx-auto">
            <LogIn size={32} className="text-gold" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Bienvenido de <span className="text-gold">Vuelta</span>
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-widest font-semibold">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="glass-card p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-pulse">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-white/60">
              Usuario
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3.5 text-gold/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-white/60">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gold/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-500 text-slate-900 font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-8 p-4 glass-card bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2">Verifica tu usuario en la BD</p>
          <p className="text-xs text-white/60">Usa tus <span className="text-gold">username</span> y <span className="text-gold">password</span> registrados</p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/30 mt-8 uppercase tracking-widest font-semibold">
          Empresa Tecnológica del Este
        </p>
      </div>
    </div>
  );
}
