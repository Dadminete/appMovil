'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos de inactividad
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

interface User {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  login: (user: User) => void;
  sessionTimeoutMs: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback((expired = false) => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    setIsAuthenticated(false);
    setUser(null);
    if (expired) {
      router.push('/login?expired=1');
    } else {
      router.push('/login');
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    localStorage.setItem('lastActivity', Date.now().toString());
    timeoutRef.current = setTimeout(() => {
      logout(true);
    }, SESSION_TIMEOUT_MS);
  }, [logout]);

  // Arrancar listeners de actividad cuando el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    // Verificar si la sesión ya expiró al volver al tab
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity && Date.now() - parseInt(lastActivity) > SESSION_TIMEOUT_MS) {
      logout(true);
      return;
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, resetTimer, logout]);

  useEffect(() => {
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');

    if (authenticated && userData) {
      // Verificar si la sesión expiró mientras el tab estaba cerrado
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - parseInt(lastActivity) > SESSION_TIMEOUT_MS) {
        logout(true);
        setIsLoaded(true);
        return;
      }
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setIsLoaded(true);

    if (!authenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router, logout]);

  const login = (userData: User) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('lastActivity', Date.now().toString());
    setIsAuthenticated(true);
    setUser(userData);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout: () => logout(false), login, sessionTimeoutMs: SESSION_TIMEOUT_MS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
