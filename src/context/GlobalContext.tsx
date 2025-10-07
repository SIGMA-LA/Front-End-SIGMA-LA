'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import api from '@/services/api/api'
import entregasService from '@/services/entregas.service'
import visitasService from '@/services/visitas.service'
import * as obraService from '@/services/obra.service'
import clienteService from '@/services/cliente.service'
import { ObraFormData } from '@/services/obra.service'
import presupuestoService, {
  PresupuestoFormData,
} from '@/services/presupuesto.service'
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
  localidades: Localidad[]
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
  createObra: (obraData: ObraFormData) => Promise<Obra>
  updateObra: (id: number, obraData: ObraFormData) => Promise<void>
  createPresupuesto: (
    presupuestoData: PresupuestoFormData,
    cod_obra: number
  ) => Promise<void>
  updatePresupuesto: (
    nro_presupuesto: number,
    data: PresupuestoFormData
  ) => Promise<void>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [obras, setObras] = useState<Obra[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [currentSection, setCurrentSection] = useState('dashboard')

  // --- FUNCIONES DE CARGA DE DATOS (MEMORIZADAS CON useCallback) ---

  const fetchEmpleados = useCallback(async () => {
    try {
      const { data } = await api.get('/empleados')
      setEmpleados(data)
    } catch (error) {
      console.error('Error al cargar empleados:', error)
    }
  }, [])

  const fetchClientes = useCallback(async () => {
    try {
      const clientesData = await clienteService.getAllClientes()
      setClientes(clientesData)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    }
  }, [])

  const fetchLocalidades = useCallback(async () => {
    try {
      const { data } = await api.get<Localidad[]>('/localidades')
      setLocalidades(data)
    } catch (error) {
      console.error('Error al cargar localidades:', error)
    }
  }, [])

  const fetchObras = useCallback(async () => {
    try {
      const obrasData = await obraService.getObras()
      setObras(obrasData)
    } catch (error) {
      console.error('Error al cargar obras desde el contexto:', error)
      throw error
    }
  }, [])

  // Efecto para la carga inicial de datos
  useEffect(() => {
    fetchClientes()
    fetchEmpleados()
    // `fetchObras` y `fetchLocalidades` se llaman bajo demanda desde los componentes
  }, [fetchClientes, fetchEmpleados])

  // --- FUNCIONES CRUD (MEMORIZADAS CON useCallback) ---

  const createObra = useCallback(
    async (obraData: ObraFormData): Promise<Obra> => {
      try {
        const nuevaObra = await obraService.createObra(obraData)
        setObras((prev) => [nuevaObra, ...prev])
        return nuevaObra
      } catch (error) {
        console.error('Error al crear obra desde el contexto:', error)
        throw error
      }
    },
    []
  )

  const updateObra = useCallback(async (id: number, obraData: ObraFormData) => {
    try {
      const obraActualizada = await obraService.updateObra(id, obraData)
      setObras((prev) =>
        prev.map((o) => (o.cod_obra === id ? obraActualizada : o))
      )
    } catch (error) {
      console.error('Error al actualizar obra desde el contexto:', error)
      throw error
    }
  }, [])

  const addEmpleado = useCallback(
    async (empleadoData: Omit<Empleado, 'cuil'>) => {
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
    },
    []
  )

  const updateEmpleado = useCallback(
    async (cuil: string, empleadoData: Partial<Omit<Empleado, 'cuil'>>) => {
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
    },
    []
  )

  const deleteEmpleado = useCallback(async (cuil: string) => {
    try {
      await api.delete(`/empleados/${cuil}`)
      setEmpleados((prev) => prev.filter((u) => u.cuil !== cuil))
    } catch (error) {
      console.error('Error al eliminar empleado:', error)
      throw error
    }
  }, [])

  const finalizarEntrega = useCallback(
    async (id: number, observaciones?: string) => {
      try {
        await entregasService.finalizarEntrega(id, observaciones)
        // Aquí podrías agregar lógica para actualizar el estado de entregas si es necesario
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        throw error
      }
    },
    []
  )

  const finalizarVisita = useCallback(
    async (id: number, observaciones?: string) => {
      try {
        await visitasService.finalizarVisita(id, observaciones)
        // Aquí podrías agregar lógica para actualizar el estado de visitas si es necesario
      } catch (error) {
        console.error('Error al finalizar visita:', error)
        throw error
      }
    },
    []
  )

  const createPresupuesto = useCallback(
    async (presupuestoData: PresupuestoFormData, cod_obra: number) => {
      try {
        await presupuestoService.createPresupuesto(presupuestoData, cod_obra)
      } catch (error) {
        console.error('Error al crear presupuesto desde el contexto:', error)
        throw error
      }
    },
    []
  )

  const updatePresupuesto = useCallback(
    async (nro_presupuesto: number, data: PresupuestoFormData) => {
      try {
        await presupuestoService.updatePresupuesto(nro_presupuesto, data)
      } catch (error) {
        console.error('Error al actualizar presupuesto:', error)
        throw error
      }
    },
    []
  )

  return (
    <GlobalContext.Provider
      value={{
        empleados,
        obras,
        clientes,
        localidades,
        addEmpleado,
        updateEmpleado,
        deleteEmpleado,
        currentSection,
        setCurrentSection,
        finalizarEntrega,
        finalizarVisita,
        fetchObras,
        createObra,
        updateObra,
        fetchClientes,
        fetchLocalidades,
        createPresupuesto,
        updatePresupuesto,
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
