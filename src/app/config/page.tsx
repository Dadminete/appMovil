
'use client';

import { Settings, Database, Info, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function ConfigPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };


  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes del <span className="text-gold">Sistema</span></h1>
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mt-1">Configuración y Perfil</p>
      </header>

      {/* Profile Section */}
      <div className="glass-card p-6 flex items-center gap-4 bg-white/5">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
          <Settings size={32} className="text-gold" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-gold">{user?.nombre} {user?.apellido}</h2>
          <p className="text-white/40 text-xs tracking-widest uppercase font-semibold">@{user?.username}</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-widest text-white/40 px-2">General</h3>
        <div className="space-y-2">
          <div className="glass-card p-4 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-gold" />
              <span className="text-sm">Estado de Conexión</span>
            </div>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold uppercase tracking-widest">Conectado</span>
          </div>

          <div 
            className="glass-card p-4 flex justify-between items-center bg-white/5 cursor-pointer"
            onClick={toggleTheme}
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={20} className="text-gold" /> : <Sun size={20} className="text-gold" />}
              <span className="text-sm">Modo {isDarkMode ? 'Oscuro' : 'Claro'}</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-gold/40' : 'bg-gray-600'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-gold rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-widest text-white/40 px-2">Acerca de</h3>
        <div className="space-y-2">
          <div className="glass-card p-4 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-gold" />
              <span className="text-sm">Versión de la App</span>
            </div>
            <span className="text-xs text-white/40">v1.0.0-gold</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full glass-card p-4 flex items-center justify-center gap-3 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all active:scale-95"
      >
        <LogOut size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">Cerrar Sesión</span>
      </button>

      {/* Branding Footer */}
      <footer className="text-center py-10 opacity-20">
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold">Empresa Tecnológica del Este</p>
      </footer>
    </div>
  );
}
