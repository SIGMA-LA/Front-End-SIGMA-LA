import api from './api/api'
import { Entrega } from '../types'

interface BackendEntrega {
  id: number
  cod_obra: number
  cuil_empleado: string
  fecha_entrega: string
  hora_entrega?: string
  estado: 'PENDIENTE' | 'ENTREGADA' | 'EN CURSO' | 'CANCELADA'
  observaciones?: string
  direccion_entrega: string
  productos: string[]
  vehiculo?: string
  obra: {
    cod_obra: number
    direccion: string
    cliente: {
      cuil: string
      razon_social: string
      telefono: string
      mail: string
    }
    nota_fabrica: string
    fecha_ini: string
    estado: 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada'
  }
  empleado: {
    cuil: string
    nombre: string
    apellido: string
  }
}

export interface CreateEntregaDTO {
  cod_obra: number
  cuil_empleado: string
  fecha_entrega: string
  hora_entrega: string
  direccion_entrega: string
  productos: string[]
  vehiculo?: string
  observaciones?: string
}

export interface UpdateEntregaDTO {
  fecha_entrega?: string
  hora_entrega?: string
  estado?: 'PENDIENTE' | 'ENTREGADA' | 'EN CURSO' | 'CANCELADA'
  observaciones?: string
  direccion_entrega?: string
  productos?: string[]
  vehiculo?: string
}

// Función para mapear datos del backend al frontend
const mapToFrontend = (backendEntrega: BackendEntrega): Entrega => {
  return {
    id: backendEntrega.id,
    obra: {
      id: backendEntrega.obra.cod_obra,
      direccion: backendEntrega.obra.direccion,
      cliente: {
        id: 0,
        nombre:
          backendEntrega.obra.cliente.razon_social.split(' ')[0] || 'Cliente',
        apellido:
          backendEntrega.obra.cliente.razon_social
            .split(' ')
            .slice(1)
            .join(' ') || '',
        telefono: backendEntrega.obra.cliente.telefono,
        email: backendEntrega.obra.cliente.mail,
      },
      descripcion: backendEntrega.obra.nota_fabrica,
      presupuesto: 0, // No disponible en backend
      fechaInicio: backendEntrega.obra.fecha_ini,
      estado: backendEntrega.obra.estado,
    },
    fecha: backendEntrega.fecha_entrega,
    hora: backendEntrega.hora_entrega || '09:00',
    estado: backendEntrega.estado,
    encargadoAsignado: `${backendEntrega.empleado.nombre} ${backendEntrega.empleado.apellido}`,
    productos: backendEntrega.productos,
    direccionEntrega: backendEntrega.direccion_entrega,
    observaciones: backendEntrega.observaciones || 'Sin observaciones',
    vehiculo: backendEntrega.vehiculo,
    documentos: [], // No disponible en backend por ahora
  }
}

const mapCreateToBackend = (entregaData: CreateEntregaDTO) => ({
  cod_obra: entregaData.cod_obra,
  cuil_empleado: entregaData.cuil_empleado,
  fecha_entrega: entregaData.fecha_entrega,
  hora_entrega: entregaData.hora_entrega,
  direccion_entrega: entregaData.direccion_entrega,
  productos: entregaData.productos,
  vehiculo: entregaData.vehiculo,
  observaciones: entregaData.observaciones,
})

const mapUpdateToBackend = (entregaData: UpdateEntregaDTO) => ({
  fecha_entrega: entregaData.fecha_entrega,
  hora_entrega: entregaData.hora_entrega,
  estado: entregaData.estado,
  observaciones: entregaData.observaciones,
  direccion_entrega: entregaData.direccion_entrega,
  productos: entregaData.productos,
  vehiculo: entregaData.vehiculo,
})

class EntregasService {
  private baseURL = '/entregas'

  /**
   * Método privado para obtener entregas por estado de un empleado específico.
   * @param cuilEmpleado - CUIL del empleado
   * @param estado - Estado de las entregas a obtener
   * @returns Lista de entregas formateadas para el frontend
   */
  private async getEntregasByEstado(
    cuilEmpleado: string,
    estado: 'PENDIENTE' | 'ENTREGADA' | 'EN CURSO' | 'CANCELADA'
  ): Promise<Entrega[]> {
    try {
      const response = await api.get<BackendEntrega[]>(
        `${this.baseURL}/empleado/${cuilEmpleado}`,
        {
          params: { estado },
        }
      )

      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error(
        `Error al obtener entregas ${estado} para empleado ${cuilEmpleado}:`,
        error
      )
      throw error
    }
  }

  /**
   * Obtiene todas las entregas del backend.
   * @returns Lista de entregas formateadas para el frontend
   */
  async getAllEntregas(): Promise<Entrega[]> {
    const { data } = await api.get<BackendEntrega[]>(this.baseURL)
    return data.map(mapToFrontend)
  }

  /**
   * Obtiene una entrega específica por su ID.
   * @param id - ID de la entrega
   * @returns Entrega formateada para el frontend
   */
  async getEntregaById(id: number): Promise<Entrega> {
    const { data } = await api.get<BackendEntrega>(`${this.baseURL}/${id}`)
    return mapToFrontend(data)
  }

  /**
   * Obtiene entregas pendientes de un empleado.
   * @param cuilEmpleado - CUIL del empleado
   * @returns Lista de entregas pendientes
   */
  async getEntregasPendientes(cuilEmpleado: string): Promise<Entrega[]> {
    return this.getEntregasByEstado(cuilEmpleado, 'PENDIENTE')
  }

  /**
   * Obtiene entregas entregadas de un empleado.
   * @param cuilEmpleado - CUIL del empleado
   * @returns Lista de entregas entregadas
   */
  async getEntregasEntregadas(cuilEmpleado: string): Promise<Entrega[]> {
    return this.getEntregasByEstado(cuilEmpleado, 'ENTREGADA')
  }

  /**
   * Obtiene entregas en curso de un empleado.
   * @param cuilEmpleado - CUIL del empleado
   * @returns Lista de entregas en curso
   */
  async getEntregasEnCurso(cuilEmpleado: string): Promise<Entrega[]> {
    return this.getEntregasByEstado(cuilEmpleado, 'EN CURSO')
  }

  /**
   * Obtiene entregas canceladas de un empleado.
   * @param cuilEmpleado - CUIL del empleado
   * @returns Lista de entregas canceladas
   */
  async getEntregasCanceladas(cuilEmpleado: string): Promise<Entrega[]> {
    return this.getEntregasByEstado(cuilEmpleado, 'CANCELADA')
  }

  /**
   * Crea una nueva entrega.
   * @param entregaData - Datos de la entrega en formato frontend
   * @returns La nueva entrega creada, formateada para el frontend
   */
  async createEntrega(entregaData: CreateEntregaDTO): Promise<Entrega> {
    const payload = mapCreateToBackend(entregaData)
    const { data } = await api.post<BackendEntrega>(this.baseURL, payload)
    return mapToFrontend(data)
  }

  /**
   * Actualiza una entrega existente.
   * @param id - ID de la entrega a actualizar
   * @param entregaData - Datos a actualizar en formato frontend
   * @returns La entrega actualizada, formateada para el frontend
   */
  async updateEntrega(
    id: number,
    entregaData: UpdateEntregaDTO
  ): Promise<Entrega> {
    const payload = mapUpdateToBackend(entregaData)
    const { data } = await api.put<BackendEntrega>(
      `${this.baseURL}/${id}`,
      payload
    )
    return mapToFrontend(data)
  }

  /**
   * Finaliza una entrega cambiando su estado y agregando observaciones.
   * @param id - ID de la entrega a finalizar
   * @param observaciones - Observaciones finales
   */
  async finalizarEntrega(id: number, observaciones: string): Promise<void> {
    try {
      await api.post(`${this.baseURL}/${id}/finalizar`, { observaciones })
    } catch (error) {
      console.error(`Error al finalizar entrega ${id}:`, error)
      throw error
    }
  }

  /**
   * Elimina una entrega por su ID.
   * @param id - ID de la entrega a eliminar
   */
  async deleteEntrega(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`)
  }
}

export const entregasService = new EntregasService()

// Exportar también las funciones individuales para compatibilidad
export const finalizarEntrega = (id: number, observaciones: string) =>
  entregasService.finalizarEntrega(id, observaciones)

export const obtenerEntregasDeEncargado = async (cuil: string) => {
  const [pendientes, entregadas] = await Promise.all([
    entregasService.getEntregasPendientes(cuil),
    entregasService.getEntregasEntregadas(cuil),
  ])
  return { pendientes, entregadas }
}

export default entregasService
