"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsuarios, mockObras, mockClientes } from '@/data/mockData';
import type { Usuario, Obra, Cliente } from '@/types';

interface GlobalContextType {
  usuarios: Usuario[];
  obras: Obra[];
  clientes: Cliente[];
  addEmpleado: (empleado: Usuario) => void;
  updateEmpleado: (id: string, data: Partial<Omit<Usuario, 'id'>>) => void;
  deleteEmpleado: (id: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [obras] = useState<Obra[]>(mockObras);
  const [clientes] = useState<Cliente[]>(mockClientes);

  const addEmpleado = (empleado: Usuario) => {
    setUsuarios(prev => [...prev, empleado]);
  };

  const updateEmpleado = (id: string, data: Partial<Omit<Usuario, 'id'>>) => {
    setUsuarios(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  };

  const deleteEmpleado = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <GlobalContext.Provider
      value={{ usuarios, obras, clientes, addEmpleado, updateEmpleado, deleteEmpleado }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext debe ser usado dentro de un GlobalProvider');
  }
  return context;
};