import api from './api/api'
import { Visita } from '@/types'

interface EmpleadoAsignadoVisita {
  cuil: string
  cod_visita: number
  empleado: {
    cuil: string
    nombre: string
    apellido: string
    rol_actual: string
    // area_trabajo y contrasenia no vienen en el select del backend
  }
}

// Interfaz ajustada según lo que devuelve el backend
interface BackendVisita {
  cod_visita: number
  fecha_hora_visita: string
  cod_obra?: number
  cod_postal?: number
  fecha_cancelacion?: string
  observaciones?: string
  motivo_visita:
    | 'MEDICION'
    | 'RE-MEDICION'
    | 'REPARACION'
    | 'ASESORAMIENTO'
    | 'VISITA INICIAL'
  estado:
    | 'PROGRAMADA'
    | 'EN CURSO'
    | 'CANCELADA'
    | 'REPROGRAMADA'
    | 'COMPLETADA'
  direccion_visita?: string
  obra?: {
    cod_obra: number
    direccion: string
    cliente: {
      razon_social: string
      telefono: string
      mail: string
    }
  }
  localidad: {
    cod_postal: number
    nombre_localidad: string
  }
  empleado_visita: EmpleadoAsignadoVisita[]
}

// Mapea la estructura del backend a la estructura del frontend
const mapToFrontend = (backendVisita: BackendVisita): Visita => {
  return {
    cod_visita: backendVisita.cod_visita,
    fecha_hora_visita: backendVisita.fecha_hora_visita,
    motivo_visita: backendVisita.motivo_visita as Visita['motivo_visita'],
    estado: backendVisita.estado as Visita['estado'],
    observaciones: backendVisita.observaciones,
    direccion_visita: backendVisita.direccion_visita,
    fecha_cancelacion: backendVisita.fecha_cancelacion,
    obra: backendVisita.obra
      ? {
          cod_obra: backendVisita.obra.cod_obra,
          cod_postal: backendVisita.cod_postal || 0,
          cuil_cliente: '',
          fecha_ini: '', // No viene del backend limitado
          estado: 'EN ESPERA DE PAGO' as const, // No viene del backend limitado
          fecha_cancelacion: backendVisita.fecha_cancelacion || null,
          direccion: backendVisita.obra.direccion,
          nota_fabrica: '', // No viene del backend limitado
          cliente: {
            cuil: '',
            razon_social: backendVisita.obra.cliente?.razon_social || '',
            telefono: backendVisita.obra.cliente?.telefono || '',
            mail: backendVisita.obra.cliente?.mail || '',
          },
          localidad: backendVisita.localidad,
        }
      : undefined,
    empleados_asignados:
      backendVisita.empleado_visita?.map((ev) => ({
        cuil: ev.empleado?.cuil || ev.cuil,
        nombre: ev.empleado?.nombre || '',
        apellido: ev.empleado?.apellido || '',
        rol_actual: ev.empleado?.rol_actual || '',
        area_trabajo: '',
        contrasenia: undefined,
      })) || [],
    vehiculos_usados: [],
  }
}

class VisitasService {
  private baseURL = '/visitas'

  // Obtiene todas las visitas (con estructura completa)
  async getAllVisitas(): Promise<Visita[]> {
    try {
      const response = await api.get<BackendVisita[]>(this.baseURL)
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error('Error al obtener visitas:', error)
      throw new Error('No se pudieron cargar las visitas')
    }
  }

  // Obtiene una visita específica por ID (con estructura completa)
  async getVisitaById(cod_visita: number): Promise<Visita> {
    try {
      const response = await api.get<BackendVisita>(
        `${this.baseURL}/${cod_visita}`
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al obtener visita ${cod_visita}:`, error)
      throw new Error('No se pudo cargar la visita')
    }
  }

  // Crea una nueva visita
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

  // Actualiza una visita existente
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

  // Elimina una visita
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

  // Marca una visita como completada con observaciones opcionales
  async finalizarVisita(
    cod_visita: number,
    observaciones?: string
  ): Promise<Visita> {
    try {
      const response = await api.patch<BackendVisita>(
        `${this.baseURL}/${cod_visita}/finalizar`,
        { observaciones }
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(`Error al finalizar visita ${cod_visita}:`, error)
      throw new Error('No se pudo finalizar la visita')
    }
  }

  // Obtiene visitas de un empleado filtradas por estado - ESTRUCTURA LIMITADA
  async getVisitasByEmpleadoAndEstado(
    cuil: string,
    estado:
      | 'PROGRAMADA'
      | 'EN CURSO'
      | 'CANCELADA'
      | 'REPROGRAMADA'
      | 'COMPLETADA'
  ): Promise<Visita[]> {
    try {
      const response = await api.get<BackendVisita[]>(
        `${this.baseURL}/empleado/${cuil}/${estado}`
      )
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error(
        `Error al obtener visitas ${estado} para empleado ${cuil}:`,
        error
      )
      throw new Error(`No se pudieron cargar las visitas ${estado}`)
    }
  }

  // Obtiene todas las visitas de un empleado - ESTRUCTURA LIMITADA
  async getVisitasByEmpleado(cuil: string): Promise<Visita[]> {
    try {
      const response = await api.get<BackendVisita[]>(
        `${this.baseURL}/empleado/${cuil}`
      )
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error(`Error al obtener visitas del empleado ${cuil}:`, error)
      throw new Error('No se pudieron cargar las visitas del empleado')
    }
  }

  // Obtiene visitas asociadas a una obra - ESTRUCTURA LIMITADA
  async getVisitasByObra(cod_obra: number): Promise<Visita[]> {
    try {
      const response = await api.get<BackendVisita[]>(
        `${this.baseURL}/obra/${cod_obra}`
      )
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error(`Error al obtener visitas de la obra ${cod_obra}:`, error)
      throw new Error('No se pudieron cargar las visitas de la obra')
    }
  }

  // Cancela una visita con un motivo opcional
  async cancelarVisita(cod_visita: number, motivo?: string): Promise<Visita> {
    try {
      const response = await api.patch<BackendVisita>(
        `${this.baseURL}/${cod_visita}/cancelar`,
        { motivo }
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
