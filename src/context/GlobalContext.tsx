'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import api from '@/services/api/api'
import {
  //mockUsuarios,
  mockObras,
  mockClientes,
  mockEntregas,
  mockVisitas,
} from '@/data/mockData'
import type { Empleado, Obra, Cliente, Entrega, Visita } from '@/types'

interface GlobalContextType {
  empleados: Empleado[]
  obras: Obra[]
  clientes: Cliente[]
  entregas: Entrega[]
  visitas: Visita[]
  addEmpleado: (empleado: Empleado) => void
  updateEmpleado: (cuil: number, data: Partial<Omit<Empleado, 'cuil'>>) => void
  deleteEmpleado: (cuil: number) => void
  currentSection: string
  setCurrentSection: (section: string) => void
  finalizarEntrega: (id: number, observaciones: string) => void
  finalizarVisita: (id: number, observaciones: string) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras] = useState<Obra[]>(mockObras)
  const [clientes] = useState<Cliente[]>(mockClientes)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [entregas] = useState<Entrega[]>(mockEntregas)
  const [visitas] = useState<Visita[]>(mockVisitas)

  const addEmpleado = (empleado: Empleado) => {
    setEmpleados((prev) => [...prev, empleado])
  }

  const updateEmpleado = (id: number, data: Partial<Omit<Empleado, 'cuil'>>) => {
    setEmpleados((prev) =>
      prev.map((u) => (u.cuil === id ? { ...u, ...data } : u))
    )
  }

  const deleteEmpleado = (id: number) => {
    setEmpleados((prev) => prev.filter((u) => u.cuil !== id))
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
        empleados,
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
