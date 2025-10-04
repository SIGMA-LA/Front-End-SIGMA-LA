'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import api from '@/services/api/api'
import entregasService from '@/services/entregas.service'
import visitasService from '@/services/visitas.service'
import {
  mockObras,
  mockClientes,
} from '@/data/mockData'
import type { Empleado, Obra, Cliente, Entrega, Visita } from '@/types'

interface GlobalContextType {
  empleados: Empleado[]
  obras: Obra[]
  clientes: Cliente[]
  entregas: Entrega[]
  visitas: Visita[]
  loadingVisitas: boolean
  errorVisitas: string | null
  addEmpleado: (empleado: Omit<Empleado, 'cuil'>) => Promise<void>
  updateEmpleado: (
    cuil: string,
    data: Partial<Omit<Empleado, 'cuil'>>
  ) => Promise<void>
  deleteEmpleado: (cuil: string) => Promise<void>
  currentSection: string
  setCurrentSection: (section: string) => void
  finalizarEntrega: (id: number, observaciones: string) => Promise<void>
  finalizarVisita: (id: number, observaciones: string) => Promise<void>
  reloadVisitas: () => Promise<void>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras] = useState<Obra[]>(mockObras)
  const [clientes] = useState<Cliente[]>(mockClientes)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loadingVisitas, setLoadingVisitas] = useState(true)
  const [errorVisitas, setErrorVisitas] = useState<string | null>(null)

  // Cargar empleados desde la API
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

  // Cargar visitas desde la API
  useEffect(() => {
    loadVisitasData()
  }, [])

  const loadVisitasData = async () => {
    try {
      setLoadingVisitas(true)
      setErrorVisitas(null)
      const data = await visitasService.getAllVisitas()
      setVisitas(data)
    } catch (error) {
      console.error('Error al cargar visitas:', error)
      setErrorVisitas('Error al cargar las visitas')
    } finally {
      setLoadingVisitas(false)
    }
  }

  const reloadVisitas = async () => {
    await loadVisitasData()
  }

  const addEmpleado = async (empleadoData: Omit<Empleado, 'cuil'>) => {
    try {
      const { data: nuevoEmpleado } = await api.post<Empleado>(
        '/empleados',
        empleadoData
      )
      setEmpleados((prev) => [...prev, nuevoEmpleado])
    } catch (error) {
      console.error('Error al crear empleado:', error)
      throw error
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

  const finalizarEntrega = async (id: number, observaciones: string) => {
    try {
      // Llamar al servicio de entregas
      const entregaActualizada = await entregasService.finalizarEntrega(
        id,
        observaciones
      )
      
      // Actualizar el estado local si lo estás usando
      setEntregas((prev) =>
        prev.map((e) => (e.cod_entrega === id ? entregaActualizada : e))
      )
    } catch (error) {
      console.error('Error al finalizar entrega:', error)
      throw error
    }
  }

  const finalizarVisita = async (id: number, observaciones: string) => {
    try {
      const visitaFinalizada = await visitasService.finalizarVisita(
        id,
        observaciones
      )
      
      // Actualizar el estado local
      setVisitas((prev) =>
        prev.map((v) => (v.cod_visita === id ? visitaFinalizada : v))
      )
    } catch (error) {
      console.error('Error al finalizar visita:', error)
      throw error
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        empleados,
        obras,
        clientes,
        entregas,
        visitas,
        loadingVisitas,
        errorVisitas,
        addEmpleado,
        updateEmpleado,
        deleteEmpleado,
        currentSection,
        setCurrentSection,
        finalizarEntrega,
        finalizarVisita,
        reloadVisitas,
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