
'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Wallet, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Send, X, FileText, Calendar, CreditCard, User } from 'lucide-react';
import Modal from '@/components/Modal';

interface Factura {
  id: string;
  numero_factura: string;
  total: string;
  estado: string;
  fecha_factura: string;
  cliente_nombre: string;
  cliente_apellidos: string;
}

interface FacturaDetalle {
  factura: {
    id: string;
    numero_factura: string;
    tipo_factura: string;
    fecha_factura: string;
    fecha_vencimiento: string | null;
    periodo_facturado_inicio: string | null;
    periodo_facturado_fin: string | null;
    subtotal: string;
    descuento: string;
    itbis: string;
    total: string;
    estado: string;
    forma_pago: string | null;
    observaciones: string | null;
    created_at: string;
    cliente_nombre: string;
    cliente_apellidos: string;
    cliente_telefono: string | null;
    cliente_email: string | null;
  };
  detalle: {
    concepto: string;
    cantidad: string;
    precio_unitario: string;
    descuento: string;
    impuesto: string;
    subtotal: string;
    total: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    papeleriaHoy: 0,
    cajaPrincipalSaldo: 0,
    cajaPrincipalHoy: 0,
    loading: true
  });

  const [modalType, setModalType] = useState<'venta' | 'factura' | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturasLoading, setFacturasLoading] = useState(true);
  const [selectedFactura, setSelectedFactura] = useState<FacturaDetalle | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

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

  const fetchFacturas = async () => {
    setFacturasLoading(true);
    try {
      const res = await fetch('/api/facturas');
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching facturas:', error);
    } finally {
      setFacturasLoading(false);
    }
  };

  const handleFacturaClick = async (id: string) => {
    setDetailLoading(true);
    setDetailOpen(true);
    setSelectedFactura(null);
    try {
      const res = await fetch(`/api/facturas/${id}`);
      const data = await res.json();
      setSelectedFactura(data);
    } catch (error) {
      console.error('Error fetching factura detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFacturas();
  }, []);

  const formatCurrency = (val: number | string) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(val));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const estadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'pagada': return 'text-green-400 bg-green-400/10';
      case 'pendiente': return 'text-yellow-400 bg-yellow-400/10';
      case 'vencida': return 'text-red-400 bg-red-400/10';
      case 'anulada': return 'text-white/40 bg-white/5';
      default: return 'text-white/40 bg-white/5';
    }
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

      {/* Recent Activity - Facturas reales */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold tracking-widest text-white/40">Actividad Reciente</h3>
          <button className="text-[10px] text-gold uppercase font-bold" onClick={fetchFacturas}>Ver todo</button>
        </div>
        <div className="space-y-3">
          {facturasLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="glass-card p-4 flex justify-between items-center bg-white/5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-white/10 rounded" />
                    <div className="h-2 w-20 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-white/10 rounded" />
              </div>
            ))
          ) : facturas.length === 0 ? (
            <div className="glass-card p-6 text-center text-white/30 text-sm">
              No hay facturas recientes
            </div>
          ) : (
            facturas.map((factura) => (
              <div
                key={factura.id}
                className="glass-card p-4 flex justify-between items-center bg-white/5 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all"
                onClick={() => handleFacturaClick(factura.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{factura.numero_factura}</p>
                    <p className="text-[10px] text-white/40">{factura.cliente_nombre} {factura.cliente_apellidos} · {formatDate(factura.fecha_factura)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-400">{formatCurrency(factura.total)}</p>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${estadoColor(factura.estado)}`}>
                    {factura.estado}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Detalle Factura */}
      <Modal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedFactura(null); }}
        title="Detalle de Factura"
      >
        {detailLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : selectedFactura ? (
          <div className="space-y-5">
            {/* Encabezado */}
            <div className="glass-card p-4 bg-gold/5 border border-gold/20 space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gold">{selectedFactura.factura.numero_factura}</p>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${estadoColor(selectedFactura.factura.estado)}`}>
                  {selectedFactura.factura.estado}
                </span>
              </div>
              <p className="text-xs text-white/40 uppercase tracking-widest">{selectedFactura.factura.tipo_factura}</p>
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Cliente</p>
              <div className="glass-card p-3 bg-white/5 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><User size={16} className="text-white/60" /></div>
                <div>
                  <p className="text-sm font-bold">{selectedFactura.factura.cliente_nombre} {selectedFactura.factura.cliente_apellidos}</p>
                  {selectedFactura.factura.cliente_email && (
                    <p className="text-[10px] text-white/40">{selectedFactura.factura.cliente_email}</p>
                  )}
                  {selectedFactura.factura.cliente_telefono && (
                    <p className="text-[10px] text-white/40">{selectedFactura.factura.cliente_telefono}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 bg-white/5 space-y-1">
                <div className="flex items-center gap-1 text-white/40"><Calendar size={12} /><p className="text-[10px] uppercase font-bold tracking-widest">Emisión</p></div>
                <p className="text-sm font-bold">{formatDate(selectedFactura.factura.fecha_factura)}</p>
              </div>
              <div className="glass-card p-3 bg-white/5 space-y-1">
                <div className="flex items-center gap-1 text-white/40"><Calendar size={12} /><p className="text-[10px] uppercase font-bold tracking-widest">Vencimiento</p></div>
                <p className="text-sm font-bold">{formatDate(selectedFactura.factura.fecha_vencimiento)}</p>
              </div>
            </div>

            {/* Forma de pago */}
            {selectedFactura.factura.forma_pago && (
              <div className="glass-card p-3 bg-white/5 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><CreditCard size={16} className="text-white/60" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Forma de Pago</p>
                  <p className="text-sm font-bold capitalize">{selectedFactura.factura.forma_pago}</p>
                </div>
              </div>
            )}

            {/* Conceptos */}
            {selectedFactura.detalle.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Conceptos</p>
                <div className="space-y-2">
                  {selectedFactura.detalle.map((item, i) => (
                    <div key={i} className="glass-card p-3 bg-white/5 flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.concepto}</p>
                        <p className="text-[10px] text-white/40">{item.cantidad} × {formatCurrency(item.precio_unitario)}</p>
                      </div>
                      <p className="text-sm font-bold text-white flex-shrink-0">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totales */}
            <div className="glass-card p-4 bg-white/5 space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span><span>{formatCurrency(selectedFactura.factura.subtotal)}</span>
              </div>
              {Number(selectedFactura.factura.descuento) > 0 && (
                <div className="flex justify-between text-sm text-red-400">
                  <span>Descuento</span><span>- {formatCurrency(selectedFactura.factura.descuento)}</span>
                </div>
              )}
              {Number(selectedFactura.factura.itbis) > 0 && (
                <div className="flex justify-between text-sm text-white/60">
                  <span>ITBIS</span><span>{formatCurrency(selectedFactura.factura.itbis)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
                <span className="text-gold">Total</span>
                <span className="text-gold">{formatCurrency(selectedFactura.factura.total)}</span>
              </div>
            </div>

            {/* Observaciones */}
            {selectedFactura.factura.observaciones && (
              <div className="glass-card p-3 bg-white/5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Observaciones</p>
                <p className="text-sm text-white/70">{selectedFactura.factura.observaciones}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-white/40 py-4">No se pudo cargar el detalle</p>
        )}
      </Modal>
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

