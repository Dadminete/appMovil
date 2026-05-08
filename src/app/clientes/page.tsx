'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Phone, Mail, User, ChevronRight } from 'lucide-react';

interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string | null;
  estado: string;
  foto_url: string | null;
}

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClientes = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClientes(search);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Nuestros <span className="text-gold">Clientes</span></h1>
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mt-1">Gestión de Directorio</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <input 
          type="text" 
          placeholder="Buscar nombre, apellido o teléfono..." 
          className="w-full glass-card bg-white/5 border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-gold/50 transition-all text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold transition-colors" size={20} />
      </form>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
            <p className="text-white/40 text-xs uppercase tracking-widest">Cargando Clientes...</p>
          </div>
        ) : clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div 
              key={cliente.id} 
              onClick={() => router.push(`/clientes/${cliente.id}`)}
              className="glass-card p-4 flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center overflow-hidden border border-gold/20">
                    {cliente.foto_url ? (
                      <img src={cliente.foto_url} alt={cliente.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-gold" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                    cliente.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm">{cliente.nombre} {cliente.apellidos}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                      <Phone size={10} /> {cliente.telefono || 'Sin tel.'}
                    </span>
                    {cliente.email && (
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Mail size={10} /> {cliente.email.split('@')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-white/20" />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40 italic">No se encontraron clientes</p>
          </div>
        )}
      </div>
    </div>
  );
}
