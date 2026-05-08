
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // No mostrar navbar en la página de login
  if (pathname === '/login') {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/clientes', label: 'Clientes', icon: Users },
    { href: '/facturas', label: 'Facturas', icon: FileText },
    { href: '/config', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card mx-4 mb-4 p-4 z-50 flex justify-around items-center">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              active ? 'text-gold scale-110 drop-shadow-[0_0_8px_var(--gold-glow)]' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <item.icon size={active ? 26 : 22} />
            <span className={`text-[10px] uppercase font-bold tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

