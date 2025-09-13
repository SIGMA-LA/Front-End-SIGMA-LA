'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  mockUsuarios,
  mockObras,
  mockClientes,
  mockEntregas,
  mockVisitas,
} from '@/data/mockData'
import type { Usuario, Obra, Cliente, Entrega, Visita } from '@/types'

interface GlobalContextType {
  usuarios: Usuario[]
  obras: Obra[]
  clientes: Cliente[]
  entregas: Entrega[]
  visitas: Visita[]
  addEmpleado: (empleado: Usuario) => void
  updateEmpleado: (id: number, data: Partial<Omit<Usuario, 'id'>>) => void
  deleteEmpleado: (id: number) => void
  currentSection: string
  setCurrentSection: (section: string) => void
  finalizarEntrega: (id: number, observaciones: string) => void
  finalizarVisita: (id: number, observaciones: string) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [obras] = useState<Obra[]>(mockObras)
  const [clientes] = useState<Cliente[]>(mockClientes)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [entregas] = useState<Entrega[]>(mockEntregas)
  const [visitas] = useState<Visita[]>(mockVisitas)

  const addEmpleado = (empleado: Usuario) => {
    setUsuarios((prev) => [...prev, empleado])
  }

  const updateEmpleado = (id: number, data: Partial<Omit<Usuario, 'id'>>) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    )
  }

  const deleteEmpleado = (id: number) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  const finalizarEntrega = (id: number, observaciones: string) => {
    const entregaIndex = entregas.findIndex((e) => e.id === id)
  }

  const finalizarVisita = (id: number, observaciones: string) => {
    const visitaIndex = visitas.findIndex((v) => v.id === id)
  }

  return (
    <GlobalContext.Provider
      value={{
        usuarios,
        obras,
        clientes,
        entregas,
        visitas,
        addEmpleado,
        updateEmpleado,
        deleteEmpleado,
        currentSection,
        setCurrentSection,
        finalizarEntrega,
        finalizarVisita,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error(
      'useGlobalContext debe ser usado dentro de un GlobalProvider'
    )
  }
  return context
}
