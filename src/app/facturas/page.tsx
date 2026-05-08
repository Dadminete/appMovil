
'use client';

import { useEffect, useState } from 'react';
import { FileText, Calendar, DollarSign, Filter, ChevronRight } from 'lucide-react';

interface Factura {
  id: string;
  numero_factura: string;
  total: string;
  estado: string;
  fecha_factura: string;
  cliente_nombre: string;
  cliente_apellidos: string;
}

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchFacturas = async (status = 'all') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/facturas?status=${status}`);
      const data = await res.json();
      setFacturas(data);
    } catch (error) {
      console.error('Error fetching facturas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas(filter);
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagada': return 'text-green-400 bg-green-400/10';
      case 'pendiente': return 'text-yellow-400 bg-yellow-400/10';
      case 'vencida': return 'text-red-400 bg-red-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' });
  };

  const formatCurrency = (val: string) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(parseFloat(val));
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de <span className="text-gold">Facturas</span></h1>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mt-1">Control de Cuentas</p>
        </div>
      </header>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'pagada', 'pendiente', 'vencida'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
              filter === f ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'glass-card text-white/40'
            }`}
          >
            {f === 'all' ? 'Todas' : f}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
            <p className="text-white/40 text-xs uppercase tracking-widest">Cargando Facturas...</p>
          </div>
        ) : facturas.length > 0 ? (
          facturas.map((factura) => (
            <div 
              key={factura.id} 
              onClick={() => alert(`Factura: ${factura.numero_factura}\nTotal: ${formatCurrency(factura.total)}\nEstado: ${factura.estado}`)}
              className="glass-card p-5 space-y-4 bg-white/5 relative group overflow-hidden cursor-pointer active:scale-[0.98] hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-2xl text-gold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{factura.numero_factura}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                      {factura.cliente_nombre} {factura.cliente_apellidos}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[9px] uppercase font-bold tracking-widest ${getStatusColor(factura.estado)}`}>
                  {factura.estado}
                </span>
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Fecha Emisión</p>
                  <div className="flex items-center gap-1 text-xs text-white/60">
                    <Calendar size={12} />
                    {formatDate(factura.fecha_factura)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Monto Total</p>
                  <p className="text-lg font-bold text-gold">{formatCurrency(factura.total)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40 italic">No hay facturas con este estado</p>
          </div>
        )}
      </div>
    </div>
  );
}
