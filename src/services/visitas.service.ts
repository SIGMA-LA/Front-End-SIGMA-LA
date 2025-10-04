import api from './api/api'
import { Visita } from '@/types'

// 1. Definir la estructura que viene del backend
interface EmpleadoAsignadoVisita {
  cuil: string
  cod_visita: number
  empleado: {
    cuil: string
    nombre: string
    apellido: string
    rol_actual: string
    area_trabajo: string
    contrasenia?: string
  }
}

interface BackendVisita {
  cod_visita: number
  fecha_hora_visita: string
  cod_obra?: number
  cod_postal?: number
  fecha_cancelacion?: string
  observaciones?: string
  motivo_visita: 'MEDICION' | 'RE-MEDICION' | 'REPARACION' | 'ASESORAMIENTO' | 'VISITA INICIAL'
  estado: 'PROGRAMADA' | 'EN CURSO' | 'CANCELADA' | 'REPROGRAMADA' | 'COMPLETADA'
  direccion_visita?: string
  obra?: {
    cod_obra: number
    cod_postal: number
    cuil: string
    fecha_ini: string
    estado: 'ACTIVA' | 'EN PRODUCCION' | 'FINALIZADA' | 'ENTREGADA' | 'CANCELADA' | 'EN ESPERA DE STOCK'
    fecha_cancelacion: string | null
    direccion: string
    nota_fabrica: string
    cliente: {
      cuil: string
      razon_social: string
      telefono: string
      mail: string
    }
    localidad?: {
      cod_postal: number
      nombre_localidad: string
    }
  }
  localidad?: {
    cod_postal: number
    nombre_localidad: string
  }
  empleado_visita: EmpleadoAsignadoVisita[]
  uso_vehiculo_visita?: Array<{
    patente: string
    fecha_hora_ini_uso: string
    fecha_hora_fin_est: string
    fecha_hora_fin_real?: string
    estado: string
    vehiculo: {
      patente: string
      tipo_vehiculo: string
      estado: string
    }
  }>
}

// 2. Función para mapear datos del backend al frontend
const mapToFrontend = (backendVisita: BackendVisita): Visita => {
  return {
    cod_visita: backendVisita.cod_visita,
    fecha_hora_visita: backendVisita.fecha_hora_visita,
    motivo_visita: backendVisita.motivo_visita as Visita['motivo_visita'],
    estado: backendVisita.estado as Visita['estado'],
    observaciones: backendVisita.observaciones,
    direccion_visita: backendVisita.direccion_visita,
    fecha_cancelacion: backendVisita.fecha_cancelacion,
    obra: backendVisita.obra && backendVisita.obra.cliente ? {
      cod_obra: backendVisita.obra.cod_obra,
      cod_postal: backendVisita.obra.cod_postal,
      cuil_cliente: backendVisita.obra.cuil,
      fecha_ini: backendVisita.obra.fecha_ini,
      estado: backendVisita.obra.estado,
      fecha_cancelacion: backendVisita.obra.fecha_cancelacion,
      direccion: backendVisita.obra.direccion,
      nota_fabrica: backendVisita.obra.nota_fabrica,
      cliente: {
        cuil: backendVisita.obra.cliente.cuil,
        razon_social: backendVisita.obra.cliente.razon_social,
        telefono: backendVisita.obra.cliente.telefono,
        mail: backendVisita.obra.cliente.mail,
      },
      localidad: backendVisita.obra.localidad,
    } : undefined,
    empleados_asignados: backendVisita.empleado_visita?.map((ev) => ({
      cuil: ev.empleado?.cuil || ev.cuil,
      nombre: ev.empleado?.nombre || '',
      apellido: ev.empleado?.apellido || '',
      rol_actual: ev.empleado?.rol_actual || '',
      area_trabajo: ev.empleado?.area_trabajo || '',
      contrasenia: ev.empleado?.contrasenia,
    })) || [],
    vehiculos_usados: backendVisita.uso_vehiculo_visita?.map((uv) => ({
      patente: uv.patente,
      cod_visita: backendVisita.cod_visita,
      fecha_hora_ini_uso: uv.fecha_hora_ini_uso,
      fecha_hora_fin_est: uv.fecha_hora_fin_est,
      fecha_hora_fin_real: uv.fecha_hora_fin_real,
      fecha_hora_ini_est: uv.fecha_hora_fin_est,
      estado: uv.estado,
      vehiculo: uv.vehiculo,
    })),
  }
}

class VisitasService {
  private baseURL = '/visitas'

  /**
   * Obtener todas las visitas
   */
  async getAllVisitas(): Promise<Visita[]> {
    try {
      const response = await api.get<BackendVisita[]>(this.baseURL)
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error('Error al obtener visitas:', error)
      throw new Error('No se pudieron cargar las visitas')
    }
  }

  /**
   * Obtener una visita por ID
   */
  async getVisitaById(cod_visita: number): Promise<Visita> {
    try {
      const response = await api.get<BackendVisita>(`${this.baseURL}/${cod_visita}`)
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al obtener visita ${cod_visita}:`, error)
      throw new Error('No se pudo cargar la visita')
    }
  }

  /**
   * Crear una nueva visita
   */
  async createVisita(data: {
    fecha_hora_visita: string
    cod_obra?: number
    cod_postal?: number
    motivo_visita: string
    estado: string
    observaciones?: string
    direccion_visita?: string
  }): Promise<Visita> {
    try {
      const response = await api.post<BackendVisita>(this.baseURL, data)
      return mapToFrontend(response.data)
    } catch (error) {
      console.error('Error al crear visita:', error)
      throw new Error('No se pudo crear la visita')
    }
  }

  /**
   * Actualizar una visita existente
   */
  async updateVisita(
    cod_visita: number,
    data: {
      fecha_hora_visita?: string
      cod_obra?: number
      cod_postal?: number
      motivo_visita?: string
      estado?: string
      observaciones?: string
      direccion_visita?: string
      fecha_cancelacion?: string
    }
  ): Promise<Visita> {
    try {
      const response = await api.put<BackendVisita>(
        `${this.baseURL}/${cod_visita}`,
        data
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al actualizar visita ${cod_visita}:`, error)
      throw new Error('No se pudo actualizar la visita')
    }
  }

  /**
   * Eliminar una visita
   */
  async deleteVisita(cod_visita: number): Promise<Visita> {
    try {
      const response = await api.delete<BackendVisita>(
        `${this.baseURL}/${cod_visita}`
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al eliminar visita ${cod_visita}:`, error)
      throw new Error('No se pudo eliminar la visita')
    }
  }

  /**
   * Finalizar una visita (cambiar estado a COMPLETADA)
   */
  async finalizarVisita(
    cod_visita: number,
    observaciones?: string
  ): Promise<Visita> {
    try {
      const updateData: {
        estado: string
        observaciones?: string
      } = {
        estado: 'COMPLETADA',
      }

      if (observaciones) {
        updateData.observaciones = observaciones
      }

      const response = await api.put<BackendVisita>(
        `${this.baseURL}/${cod_visita}`,
        updateData
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al finalizar visita ${cod_visita}:`, error)
      throw new Error('No se pudo finalizar la visita')
    }
  }

  /**
   * Obtener visitas por empleado y estado
   */
  async getVisitasByEmpleadoAndEstado(
    cuil: string,
    estado: 'PROGRAMADA' | 'EN CURSO' | 'CANCELADA' | 'REPROGRAMADA' | 'COMPLETADA'
  ): Promise<Visita[]> {
    try {
      // Obtener todas las visitas y filtrar por empleado y estado
      const allVisitas = await this.getAllVisitas()
      
      return allVisitas.filter((visita) => {
        // Verificar que el empleado esté asignado a la visita
        const isAssigned = visita.empleados_asignados?.some(
          (emp) => emp.cuil === cuil
        )
        // Verificar que el estado coincida
        const matchesEstado = visita.estado === estado
        
        return isAssigned && matchesEstado
      })
    } catch (error) {
      console.error(
        `Error al obtener visitas ${estado} para empleado ${cuil}:`,
        error
      )
      throw error
    }
  }

  /**
   * Obtener visitas por empleado
   */
  async getVisitasByEmpleado(cuil: string): Promise<Visita[]> {
    try {
      const allVisitas = await this.getAllVisitas()
      
      return allVisitas.filter((visita) =>
        visita.empleados_asignados?.some((emp) => emp.cuil === cuil)
      )
    } catch (error) {
      console.error(`Error al obtener visitas del empleado ${cuil}:`, error)
      throw new Error('No se pudieron cargar las visitas del empleado')
    }
  }

  /**
   * Obtener visitas por obra
   */
  async getVisitasByObra(cod_obra: number): Promise<Visita[]> {
    try {
      const allVisitas = await this.getAllVisitas()
      return allVisitas.filter((visita) => visita.obra?.cod_obra === cod_obra)
    } catch (error) {
      console.error(`Error al obtener visitas de la obra ${cod_obra}:`, error)
      throw new Error('No se pudieron cargar las visitas de la obra')
    }
  }

  /**
   * Cancelar una visita
   */
  async cancelarVisita(
    cod_visita: number,
    observaciones?: string
  ): Promise<Visita> {
    try {
      const updateData: {
        estado: string
        fecha_cancelacion: string
        observaciones?: string
      } = {
        estado: 'CANCELADA',
        fecha_cancelacion: new Date().toISOString(),
      }

      if (observaciones) {
        updateData.observaciones = observaciones
      }

      const response = await api.put<BackendVisita>(
        `${this.baseURL}/${cod_visita}`,
        updateData
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al cancelar visita ${cod_visita}:`, error)
      throw new Error('No se pudo cancelar la visita')
    }
  }
}

const visitasService = new VisitasService()
export default visitasService