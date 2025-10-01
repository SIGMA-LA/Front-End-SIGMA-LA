'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import api from '@/services/api/api'
import {
  mockClientes,
  mockEntregas,
  mockVisitas,
} from '@/data/mockData'
import type { Empleado, Obra, Cliente, Entrega, Visita, Localidad } from '@/types'

interface BackendObra {
  cod_obra: number;
  direccion: string;
  descripcion: string;
  cliente: {
    cuil: string;
    razon_social: string;
    telefono: string;
    mail: string;
  };
  nota_fabrica: string;
  fecha_ini: string;
  estado: 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada';
}

const mapObraToFrontend = (obra: BackendObra): Obra => ({
  id: obra.cod_obra,
  direccion: obra.direccion,
  cliente: {
    id: 0,
    razon_social: obra.cliente.razon_social,
    telefono: obra.cliente.telefono,
    email: obra.cliente.mail,
  },
  nota_fabrica: obra.nota_fabrica,
  fechaInicio: obra.fecha_ini,
  estado: obra.estado,
});

const mapObraToBackend = (obraData: any): any => ({
  direccion: obraData.direccion,
  descripcion: obraData.descripcion,
  presupuesto: parseFloat(obraData.presupuesto) || 0,
  fecha_ini: obraData.fechaInicio,
  estado: obraData.estado,
});

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
  fetchLocalidades: () => Promise<void>
  fetchObras: () => Promise<void>
  createObra: (obraData: Omit<Obra, 'id'>) => Promise<void>
  updateObra: (id: number, obraData: Partial<Omit<Obra, 'id'>>) => Promise<void>
  deleteObra: (id: number) => Promise<void>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [clientes] = useState<Cliente[]>(mockClientes)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [entregas] = useState<Entrega[]>(mockEntregas)
  const [visitas] = useState<Visita[]>(mockVisitas)

  // Cargar empleados desde la API al iniciar el contexto
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const { data } = await api.get('/api/empleados')
        setEmpleados(data)
      } catch (error) {
        console.error('Error al cargar empleados:', error)
      }
    }
    fetchEmpleados()
  }, [])

  const fetchLocalidades = async () => {
    if (localidades.length > 0) return;
    try {
      const { data } = await api.get<Localidad[]>('/api/localidades')
      setLocalidades(data)
    } catch (error) {
      console.error('Error al cargar localidades:', error)
    }
  }

  const fetchObras = async () => {
    try {
      const { data: backendObras } = await api.get<BackendObra[]>('/api/obras')
      const frontendObras = backendObras.map(mapObraToFrontend)
      setObras(frontendObras)
    } catch (error) {
      console.error('Error al cargar obras:', error)
      throw error
    }
  }

  const createObra = async (obraData: Omit<Obra, 'id' | 'cliente'>) => {
    try {
      const payload = mapObraToBackend(obraData) 
      const { data: nuevaObraBackend } = await api.post<BackendObra>('/api/obras', payload)
      const nuevaObraFrontend = mapObraToFrontend(nuevaObraBackend)
      setObras(prev => [nuevaObraFrontend, ...prev])
    } catch (error) {
      console.error('Error al crear obra:', error)
      throw error
    }
  }

  const updateObra = async (id: number, obraData: Partial<Omit<Obra, 'id'>>) => {
    try {
      const payload = mapObraToBackend(obraData) 
      const { data: obraActualizadaBackend } = await api.put<BackendObra>(
        `/api/obras/${id}`,
        payload,
      )
      const obraActualizadaFrontend = mapObraToFrontend(obraActualizadaBackend)
      setObras(prev =>
        prev.map(o => (o.id === id ? obraActualizadaFrontend : o)),
      )
    } catch (error) {
      console.error('Error al actualizar obra:', error)
      throw error
    }
  }
  
  const deleteObra = async (id: number) => {
    try {
      await api.delete(`/api/obras/${id}`)
      setObras(prev => prev.filter(o => o.id !== id))
    } catch (error) {
      console.error('Error al eliminar obra:', error)
      throw error
    }
  }

  const addEmpleado = async (empleadoData: Omit<Empleado, 'cuil'>) => {
    try {
      const { data: nuevoEmpleado } = await api.post<Empleado>(
        '/api/empleados',
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
        `/api/empleados/${cuil}`,
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
      await api.delete(`/api/empleados/${cuil}`)
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