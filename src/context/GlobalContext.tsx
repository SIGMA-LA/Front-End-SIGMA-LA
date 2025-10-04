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
import * as obraService from '@/services/obra.service'
import clienteService from '@/services/cliente.service'
import { ObraFormData } from '@/services/obra.service'
import type {
  Empleado,
  Obra,
  Cliente,
  Entrega,
  Visita,
  Localidad,
} from '@/types'

interface GlobalContextType {
  empleados: Empleado[]
  obras: Obra[]
  clientes: Cliente[]
  addEmpleado: (empleado: Omit<Empleado, 'cuil'>) => Promise<void>
  updateEmpleado: (
    cuil: string,
    data: Partial<Omit<Empleado, 'cuil'>>
  ) => Promise<void>
  deleteEmpleado: (cuil: string) => Promise<void>
  currentSection: string
  setCurrentSection: (section: string) => void
  finalizarEntrega: (id: number, observaciones?: string) => Promise<void>
  finalizarVisita: (id: number, observaciones?: string) => Promise<void>
  fetchClientes: () => Promise<void>
  fetchLocalidades: () => Promise<void>
  fetchObras: () => Promise<void>
  createObra: (obraData: ObraFormData) => Promise<void>
  updateObra: (id: number, obraData: ObraFormData) => Promise<void>
  deleteObra: (id: number) => Promise<void>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [obras, setObras] = useState<Obra[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [currentSection, setCurrentSection] = useState('dashboard')

  useEffect(() => {
    fetchClientes()
    fetchEmpleados()
  }, [])

  const fetchEmpleados = async () => {
    try {
      const { data } = await api.get('/empleados')
      setEmpleados(data)
    } catch (error) {
      console.error('Error al cargar empleados:', error)
    }
  }

  const fetchClientes = async () => {
    try {
      const clientesData = await clienteService.getAllClientes()
      setClientes(clientesData)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    }
  }

  const fetchLocalidades = async () => {
    if (localidades.length > 0) return
    try {
      const { data } = await api.get<Localidad[]>('/localidades')
      setLocalidades(data)
    } catch (error) {
      console.error('Error al cargar localidades:', error)
    }
  }

  const fetchObras = async () => {
    try {
      const obrasData = await obraService.getObras()
      setObras(obrasData)
    } catch (error) {
      console.error('Error al cargar obras desde el contexto:', error)
      throw error
    }
  }

  const createObra = async (obraData: ObraFormData) => {
    try {
      const nuevaObra = await obraService.createObra(obraData)
      setObras((prev) => [nuevaObra, ...prev])
    } catch (error) {
      console.error('Error al crear obra desde el contexto:', error)
      throw error
    }
  }

  const updateObra = async (id: number, obraData: ObraFormData) => {
    try {
      const obraActualizada = await obraService.updateObra(id, obraData)
      setObras((prev) =>
        prev.map((o) => (o.cod_obra === id ? obraActualizada : o))
      )
    } catch (error) {
      console.error('Error al actualizar obra desde el contexto:', error)
      throw error
    }
  }

  const deleteObra = async (id: number) => {
    try {
      await obraService.deleteObra(id)
      setObras((prev) => prev.filter((o) => o.cod_obra !== id))
    } catch (error) {
      console.error('Error al eliminar obra desde el contexto:', error)
      throw error
    }
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

  // Funciones utilitarias - no manejan estado local, solo hacen la petición
  const finalizarEntrega = async (id: number, observaciones?: string) => {
    try {
      await entregasService.finalizarEntrega(id, observaciones)
    } catch (error) {
      console.error('Error al finalizar entrega:', error)
      throw error
    }
  }

  const finalizarVisita = async (id: number, observaciones?: string) => {
    try {
      await visitasService.finalizarVisita(id, observaciones)
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
        addEmpleado,
        updateEmpleado,
        deleteEmpleado,
        currentSection,
        setCurrentSection,
        fetchLocalidades,
        finalizarEntrega,
        finalizarVisita,
        fetchObras,
        createObra,
        updateObra,
        deleteObra,
        fetchClientes,
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
