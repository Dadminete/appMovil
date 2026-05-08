'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, 
  FileText, History, Package, CreditCard, 
  Calendar, CheckCircle, Clock, XCircle 
} from 'lucide-react';

export default function ClienteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'facturas' | 'servicios' | 'historial'>('info');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/clientes/${id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      <p className="text-white/40 text-xs uppercase tracking-widest">Cargando expediente...</p>
    </div>
  );

  if (!data) return <div className="p-10 text-center text-white/40">Cliente no encontrado</div>;

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(parseFloat(val));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 glass-card text-gold">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-tight">{data.nombre} {data.apellidos}</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{data.codigo_cliente}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 bg-gold/5">
          <div className="w-24 h-24 rounded-3xl bg-gold/10 flex items-center justify-center border border-gold/30 overflow-hidden shadow-2xl shadow-gold/10">
            {data.foto_url ? (
              <img src={data.foto_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gold" />
            )}
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              data.estado === 'activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {data.estado}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'info', label: 'Info', icon: User },
            { id: 'servicios', label: 'Plan', icon: Package },
            { id: 'facturas', label: 'Facturas', icon: FileText },
            { id: 'historial', label: 'Cambios', icon: History }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-gold text-black' : 'glass-card text-white/40'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="glass-card p-4 space-y-4 bg-white/5">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gold" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Teléfono</p>
                    <p className="text-sm">{data.telefono || 'No registrado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gold" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Email</p>
                    <p className="text-sm">{data.email || 'No registrado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gold" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Dirección</p>
                    <p className="text-sm text-balance">{data.direccion || 'No registrada'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'servicios' && (
            <div className="space-y-4">
              {data.suscripciones.length > 0 ? data.suscripciones.map((s: any) => (
                <div key={s.id} className="glass-card p-5 space-y-3 bg-white/5 border-l-4 border-l-gold">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gold">{s.plan_nombre}</h3>
                      <p className="text-[10px] text-white/40">Desde: {formatDate(s.fecha_inicio)}</p>
                    </div>
                    <p className="font-bold text-lg">{formatCurrency(s.plan_precio)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-green-400">
                    <CheckCircle size={12} /> {s.estado}
                  </div>
                </div>
              )) : (
                <p className="text-center py-10 text-white/40 italic">No tiene planes activos</p>
              )}
            </div>
          )}

          {activeTab === 'facturas' && (
            <div className="space-y-3">
              {data.facturas.length > 0 ? data.facturas.map((f: any) => (
                <div key={f.id} className="glass-card p-4 flex justify-between items-center bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-gold">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{f.numero_factura}</p>
                      <p className="text-[10px] text-white/40">{formatDate(f.fecha_factura)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{formatCurrency(f.total)}</p>
                    <span className={`text-[9px] uppercase font-bold ${
                      f.estado === 'pagada' ? 'text-green-400' : 'text-yellow-400'
                    }`}>{f.estado}</span>
                  </div>
                </div>
              )) : (
                <p className="text-center py-10 text-white/40 italic">Sin facturas registradas</p>
              )}
            </div>
          )}

          {activeTab === 'historial' && (
            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-gold/20">
              {data.historial.length > 0 ? data.historial.map((h: any, i: number) => (
                <div key={i} className="pl-10 relative">
                  <div className="absolute left-3 top-1 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]"></div>
                  <div className="glass-card p-3 bg-white/5 space-y-1">
                    <p className="text-[10px] text-gold uppercase font-bold tracking-tighter">{h.tipo_cambio}</p>
                    <p className="text-xs">
                      <span className="text-white/40 line-through mr-2">{h.valor_anterior}</span>
                      <span className="text-green-400">→ {h.valor_nuevo}</span>
                    </p>
                    <p className="text-[9px] text-white/20 flex items-center gap-1">
                      <Clock size={8} /> {formatDate(h.fecha)}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-center py-10 text-white/40 italic pl-0">Sin cambios registrados</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
