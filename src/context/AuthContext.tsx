// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsuarios } from '@/data/mockData';
import { Usuario } from '@/types'; 

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, contraseña: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario_sigma');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      // Terminamos de cargar, haya o no usuario
      setCargando(false);
    }
  }, []);

  const login = (email: string, contraseña: string): boolean => {
    const usuarioEncontrado = mockUsuarios.find(u => u.email === email && u.contraseña === contraseña);

    if (usuarioEncontrado) {
      const { contraseña, ...usuarioSinPassword } = usuarioEncontrado;
      setUsuario(usuarioSinPassword as Usuario);
      localStorage.setItem('usuario_sigma', JSON.stringify(usuarioSinPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_sigma');
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};