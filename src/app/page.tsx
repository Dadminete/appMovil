
'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Wallet, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Send } from 'lucide-react';
import Modal from '@/components/Modal';

export default function Dashboard() {
  const [stats, setStats] = useState({
    papeleriaHoy: 0,
    cajaPrincipalSaldo: 0,
    cajaPrincipalHoy: 0,
    loading: true
  });

  const [modalType, setModalType] = useState<'venta' | 'factura' | null>(null);

  const fetchStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats({ ...data, loading: false });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val);
  };

  return (
    <div className="p-6 space-y-8 pb-20 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quantum <span className="text-gold">FinTech</span></h1>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mt-1">Empresa Tecnológica</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-2 rounded-full glass-card text-gold hover:rotate-180 transition-all duration-500"
        >
          <RefreshCw size={20} className={stats.loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Main Balance Card */}
      <div className="glass-card p-6 space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 bg-gold/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-gold/20 transition-all"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/50 text-xs uppercase font-bold tracking-widest">Caja Principal</p>
            <h2 className="text-4xl font-bold mt-1 text-gold">
              {stats.loading ? (
                <div className="h-10 w-48 bg-white/5 animate-pulse rounded-lg mt-2"></div>
              ) : (
                formatCurrency(stats.cajaPrincipalSaldo)
              )}
            </h2>
          </div>
          <div className="p-3 bg-gold/10 rounded-2xl text-gold">
            <Wallet size={24} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            <ArrowUpRight size={12} />
            +12%
          </span>
          <span className="text-white/30">vs ayer</span>
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <ShoppingBag size={20} />
            </div>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Papelería</p>
          </div>
          <div>
            <p className="text-white/50 text-[10px]">Ingresos Hoy</p>
            {stats.loading ? (
              <div className="h-7 w-full bg-white/5 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <p className="text-xl font-bold">{formatCurrency(stats.papeleriaHoy)}</p>
            )}
          </div>
        </div>

        <div className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-green-500/10 rounded-xl text-green-400">
              <TrendingUp size={20} />
            </div>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Pagos Recib.</p>
          </div>
          <div>
            <p className="text-white/50 text-[10px]">Ingresos Hoy</p>
            {stats.loading ? (
              <div className="h-7 w-full bg-white/5 animate-pulse rounded-lg mt-1"></div>
            ) : (
              <p className="text-xl font-bold">{formatCurrency(stats.cajaPrincipalHoy)}</p>
            )}
          </div>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-widest text-white/40">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setModalType('venta')}
            className="btn-gold flex gap-2 items-center text-sm py-4"
          >
            <Plus size={18} />
            Nueva Venta
          </button>
          <button 
            onClick={() => setModalType('factura')}
            className="glass-card border-white/10 hover:border-gold/30 flex gap-2 items-center justify-center text-sm py-4"
          >
            <Send size={18} className="text-gold" />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={modalType === 'venta'} 
        onClose={() => setModalType(null)} 
        title="Registrar Nueva Venta"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40">Producto / Servicio</label>
            <input type="text" placeholder="Ej: Copias, Folder..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-gold/50 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40">Cantidad</label>
              <input type="number" defaultValue="1" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-gold/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40">Precio</label>
              <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-gold/50 outline-none" />
            </div>
          </div>
          <button className="btn-gold w-full mt-4" onClick={() => { alert('Venta registrada!'); setModalType(null); }}>Finalizar Venta</button>
        </div>
      </Modal>

      <Modal 
        isOpen={modalType === 'factura'} 
        onClose={() => setModalType(null)} 
        title="Crear Nueva Factura"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40">Seleccionar Cliente</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-gold/50 outline-none appearance-none">
              <option>Buscar cliente...</option>
              <option>Yonny Gil</option>
              <option>Jose Jose</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-white/40">Concepto</label>
            <textarea placeholder="Descripción del servicio..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-gold/50 outline-none h-24" />
          </div>
          <button className="btn-gold w-full mt-4" onClick={() => { alert('Factura creada!'); setModalType(null); }}>Generar Factura</button>
        </div>
      </Modal>

      {/* Recent Activity Placeholder */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold tracking-widest text-white/40">Actividad Reciente</h3>
          <button className="text-[10px] text-gold uppercase font-bold">Ver todo</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="glass-card p-4 flex justify-between items-center bg-white/5 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => alert(`Detalle de actividad #${i}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-gold text-xs font-bold">CLI</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Actividad #{1024 + i}</p>
                  <p className="text-[10px] text-white/40">Hace {i * 15} min • Venta Papelería</p>
                </div>
              </div>
              <p className="text-sm font-bold text-green-400">+ {formatCurrency(i * 150)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function FileText({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  );
}

