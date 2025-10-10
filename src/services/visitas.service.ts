import api from './api/api'
import { Visita, Empleado, UsoVehiculoVisita } from '@/types'

interface EmpleadoAsignadoVisita {
cuil: string
  cod_visita: number
  empleado:{
    cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
  contrasenia?: string
  }
  visita: Visita
}

interface BackendCliente {
  cuil?: string
  razon_social?: string
  telefono: string
  mail: string
  nombre?: string
  apellido?: string
  tipo_cliente: 'PERSONA' | 'EMPRESA'
}

interface BackendVisita {
  cod_visita: number
  fecha_hora_visita: string
  cod_obra?: number
  cod_localidad?: number
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
    cliente: BackendCliente
localidad: {
    cod_localidad: number
    nombre_localidad: string
    cod_provincia: number
  }
  }
  localidad: {
    cod_localidad: number
    nombre_localidad: string
    cod_provincia: number
    provincia:{
      cod_provincia: number
      nombre: string
    }
  }
  empleado_visita: EmpleadoAsignadoVisita[]
  uso_vehiculo_visita: UsoVehiculoVisita
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
          cod_localidad: backendVisita.cod_localidad || 0,
          cuil_cliente: backendVisita.obra.cliente?.cuil || '',
          fecha_ini: '',
          estado: 'EN ESPERA DE PAGO' as const,
          fecha_cancelacion: backendVisita.fecha_cancelacion || null,
          direccion: backendVisita.obra.direccion,
          nota_fabrica: '',
          cliente: {
            cuil: backendVisita.obra.cliente?.cuil || '',
            tipo_cliente: backendVisita.obra.cliente?.tipo_cliente || 'EMPRESA',
            razon_social: backendVisita.obra.cliente?.razon_social,
            telefono: backendVisita.obra.cliente?.telefono || '',
            mail: backendVisita.obra.cliente?.mail || '',
            nombre: backendVisita.obra.cliente?.nombre,
            apellido: backendVisita.obra.cliente?.apellido,
          },
          localidad:{
            cod_localidad: backendVisita.obra.localidad.cod_localidad,
            nombre_localidad: backendVisita.obra.localidad.nombre_localidad,
            cod_provincia: backendVisita.obra.localidad.cod_provincia,
            provincia:{
              cod_provincia: backendVisita.localidad.provincia.cod_provincia,
              nombre: backendVisita.localidad.provincia.nombre,
            }
          },
        }
      : undefined,
      localidad:{
            cod_localidad: backendVisita.localidad.cod_localidad,
            nombre_localidad: backendVisita.localidad.nombre_localidad,
            cod_provincia: backendVisita.localidad.cod_provincia,
            provincia:{
              cod_provincia: backendVisita.localidad.provincia.cod_provincia,
              nombre: backendVisita.localidad.provincia.nombre,
            }
          },
    empleado_visita:
      backendVisita.empleado_visita?.map((ev) => ({
        cuil: ev.cuil,
        cod_visita: ev.cod_visita,
        empleado: {
        cuil: ev.empleado.cuil,
        nombre: ev.empleado.nombre,
        apellido: ev.empleado.nombre,
        rol_actual: ev.empleado.rol_actual,
        area_trabajo: ev.empleado.area_trabajo,
        contrasenia: undefined
        },
        visita: ev.visita,
      })) || [],
    uso_vehiculo_visita: backendVisita.uso_vehiculo_visita
  }
}

class VisitasService {
  private baseURL = '/visitas'

  async getAllVisitas(): Promise<Visita[]> {
    try {
      const response = await api.get<BackendVisita[]>(this.baseURL)
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error('Error al obtener visitas:', error)
      throw new Error('No se pudieron cargar las visitas')
    }
  }

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

  async createVisita(data: {
    fecha_hora_visita: string
    cod_obra?: number
    cod_localidad?: number
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

  async updateVisita(
    cod_visita: number,
    data: {
      fecha_hora_visita?: string
      cod_obra?: number
      cod_localidad?: number
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