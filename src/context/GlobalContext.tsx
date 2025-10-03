'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import api from '@/services/api/api'
import { finalizarEntrega } from '@/services/entregas.service'
import {
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
  addEmpleado: (empleado: Omit<Empleado, 'cuil'>) => Promise<void>
  updateEmpleado: (
    cuil: string,
    data: Partial<Omit<Empleado, 'cuil'>>
  ) => Promise<void>
  deleteEmpleado: (cuil: string) => Promise<void>
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

  // Cargar empleados desde la API al iniciar el contexto
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const { data } = await api.get('/empleados')
        setEmpleados(data)
      } catch (error) {
        console.error('Error al cargar empleados:', error)
      }
    }
    fetchEmpleados()
  }, [])

  const addEmpleado = async (empleadoData: Omit<Empleado, 'cuil'>) => {
    try {
      const { data: nuevoEmpleado } = await api.post<Empleado>(
        '/empleados',
        empleadoData
      )
      setEmpleados((prev) => [...prev, nuevoEmpleado])
    } catch (error) {
      console.error('Error al crear empleado:', error)
      throw error // Re-lanzamos el error para que el componente lo maneje
    }
  }

  const updateEmpleado = async (
    cuil: string,
    empleadoData: Partial<Omit<Empleado, 'cuil'>>
  ) => {
    try {
      const { data: empleadoActualizado } = await api.put<Empleado>(
        `/empleados/${cuil}`,
        empleadoData
      )
      setEmpleados((prev) =>
        prev.map((u) => (u.cuil === cuil ? empleadoActualizado : u))
      )
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      throw error
    }
  }

  const deleteEmpleado = async (cuil: string) => {
    try {
      await api.delete(`/empleados/${cuil}`)
      setEmpleados((prev) => prev.filter((u) => u.cuil !== cuil))
    } catch (error) {
      console.error('Error al eliminar empleado:', error)
      throw error
    }
  }

  const finalizarVisita = (id: number, observaciones: string) => {
    // Lógica para finalizar visita (posiblemente una llamada a la API en el futuro)
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
