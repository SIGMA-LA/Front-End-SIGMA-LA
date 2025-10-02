'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import api from '@/services/api/api'
import * as obraService from '@/services/obra.service'
import clienteService from '@/services/cliente.service'
import { ObraFormData } from '@/services/obra.service'
import {
  mockClientes,
  mockEntregas,
  mockVisitas,
} from '@/data/mockData'
import type { Empleado, Obra, Cliente, Entrega, Visita, Localidad } from '@/types'

interface GlobalContextType {
  empleados: Empleado[]
  obras: Obra[]
  clientes: Cliente[]
  entregas: Entrega[]
  visitas: Visita[]
  localidades: Localidad[]
  addEmpleado: (empleado: Omit<Empleado, 'cuil'>) => Promise<void>
  updateEmpleado: (
    cuil: string,
    data: Partial<Omit<Empleado, 'cuil'>>,
  ) => Promise<void>
  deleteEmpleado: (cuil: string) => Promise<void>
  currentSection: string
  setCurrentSection: (section: string) => void
  finalizarEntrega: (id: number, observaciones: string) => void
  finalizarVisita: (id: number, observaciones: string) => void
  fetchClientes: () => Promise<void>
  fetchLocalidades: () => Promise<void>
  fetchObras: () => Promise<void>
  createObra: (obraData: ObraFormData) => Promise<void>
  updateObra: (id: number, obraData: ObraFormData) => Promise<void>
  deleteObra: (id: number) => Promise<void>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [entregas] = useState<Entrega[]>(mockEntregas)
  const [visitas] = useState<Visita[]>(mockVisitas)

  useEffect(() => {
    fetchClientes()
  }, [])

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

  const fetchClientes = async () => {
    try {
      const clientesData = await clienteService.getAllClientes()
      setClientes(clientesData)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    }
  }

  const fetchLocalidades = async () => {
    if (localidades.length > 0) return;
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
      setObras(prev => [nuevaObra, ...prev])
    } catch (error) {
      console.error('Error al crear obra desde el contexto:', error)
      throw error
    }
  }

  const updateObra = async (id: number, obraData: ObraFormData) => {
    try {
      const obraActualizada = await obraService.updateObra(id, obraData)
      setObras(prev =>
        prev.map(o => (o.id === id ? obraActualizada : o)),
      )
    } catch (error) {
      console.error('Error al actualizar obra desde el contexto:', error)
      throw error
    }
  }
  
  const deleteObra = async (id: number) => {
    try {
      await obraService.deleteObra(id)
      setObras(prev => prev.filter(o => o.id !== id))
    } catch (error) {
      console.error('Error al eliminar obra desde el contexto:', error)
      throw error
    }
  }

  const addEmpleado = async (empleadoData: Omit<Empleado, 'cuil'>) => {
    try {
      const { data: nuevoEmpleado } = await api.post<Empleado>(
        '/empleados',
        empleadoData,
      )
      setEmpleados(prev => [...prev, nuevoEmpleado])
    } catch (error) {
      console.error('Error al crear empleado:', error)
      throw error
    }
  }

  const updateEmpleado = async (
    cuil: string,
    empleadoData: Partial<Omit<Empleado, 'cuil'>>,
  ) => {
    try {
      const { data: empleadoActualizado } = await api.put<Empleado>(
        `/empleados/${cuil}`,
        empleadoData,
      )
      setEmpleados(prev =>
        prev.map(u => (u.cuil === cuil ? empleadoActualizado : u)),
      )
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      throw error
    }
  }

  const deleteEmpleado = async (cuil: string) => {
    try {
      await api.delete(`/empleados/${cuil}`)
      setEmpleados(prev => prev.filter(u => u.cuil !== cuil))
    } catch (error) {
      console.error('Error al eliminar empleado:', error)
      throw error
    }
  }

  const finalizarEntrega = (id: number, observaciones: string) => {
    console.log(`Finalizando entrega ${id} con observaciones: ${observaciones}`)
  }

  const finalizarVisita = (id: number, observaciones: string) => {
    console.log(`Finalizando visita ${id} con observaciones: ${observaciones}`)
  }

  return (
    <GlobalContext.Provider
      value={{
        empleados,
        obras,
        clientes,
        entregas,
        visitas,
        localidades,
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
      'useGlobalContext debe ser usado dentro de un GlobalProvider',
    )
  }
  return context
}