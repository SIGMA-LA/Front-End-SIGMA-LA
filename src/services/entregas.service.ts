import api from './api/api'
import { EntregaEmpleado, Empleado, Obra, Cliente, Localidad } from '@/types'

interface BackendEntregaEmpleado {
  cuil: string
  cod_obra: number
  cod_entrega: number
  rol_entrega: string
  entrega: {
    cod_entrega: number
    cod_obra: number
    fecha_hora_entrega: string
    estado: 'PENDIENTE' | 'ENTREGADO' | 'EN CURSO' | 'CANCELADO'
    observaciones?: string
    detalle: string
    obra: {
      cod_obra: number
      cod_postal: number
      cuil: string
      fecha_ini: string
      estado:
        | 'ACTIVA'
        | 'EN PRODUCCION'
        | 'FINALIZADA'
        | 'ENTREGADA'
        | 'EN ESPERA DE STOCK'
      fecha_cancelacion?: string
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
  }
  obra: {
    cod_obra: number
    cod_postal: number
    cuil: string
    fecha_ini: string
    estado:
      | 'ACTIVA'
      | 'EN PRODUCCION'
      | 'FINALIZADA'
      | 'ENTREGADA'
      | 'EN ESPERA DE STOCK'
    fecha_cancelacion?: string
    direccion: string
    nota_fabrica: string
    cliente: {
      cuil: string
      razon_social: string
      telefono: string
      mail: string
    }
  }
  empleado: {
    cuil: string
    nombre: string
    apellido: string
    rol_actual: string
    area_trabajo: string
    contrasenia?: string
  }
}

export interface CreateEntregaEmpleadoDTO {
  cuil: string
  cod_entrega: number
  cod_obra: number
  rol_entrega: string
}

export interface UpdateEntregaEmpleadoDTO {
  rol_entrega?: string
}

// Función para mapear datos del backend al frontend
const mapToFrontend = (
  backendEntregaEmpleado: BackendEntregaEmpleado
): EntregaEmpleado => {
  return {
    cuil: backendEntregaEmpleado.cuil,
    cod_obra: backendEntregaEmpleado.cod_obra,
    cod_entrega: backendEntregaEmpleado.cod_entrega,
    rol_entrega: backendEntregaEmpleado.rol_entrega,
    obra: {
      cod_obra: backendEntregaEmpleado.obra.cod_obra,
      cod_postal: backendEntregaEmpleado.obra.cod_postal,
      cuil_cliente: backendEntregaEmpleado.obra.cuil,
      fecha_ini: backendEntregaEmpleado.obra.fecha_ini,
      estado: backendEntregaEmpleado.obra.estado,
      fecha_cancelacion: backendEntregaEmpleado.obra.fecha_cancelacion,
      direccion: backendEntregaEmpleado.obra.direccion,
      nota_fabrica: backendEntregaEmpleado.obra.nota_fabrica,
      cliente: {
        cuil: backendEntregaEmpleado.obra.cliente.cuil,
        razon_social: backendEntregaEmpleado.obra.cliente.razon_social,
        telefono: backendEntregaEmpleado.obra.cliente.telefono,
        mail: backendEntregaEmpleado.obra.cliente.mail,
      },
    },
    empleado: {
      cuil: backendEntregaEmpleado.empleado.cuil,
      nombre: backendEntregaEmpleado.empleado.nombre,
      apellido: backendEntregaEmpleado.empleado.apellido,
      rol_actual: backendEntregaEmpleado.empleado.rol_actual,
      area_trabajo: backendEntregaEmpleado.empleado.area_trabajo,
      contrasenia: backendEntregaEmpleado.empleado.contrasenia,
    },
    entrega: {
      cod_entrega: backendEntregaEmpleado.entrega.cod_entrega,
      cod_obra: backendEntregaEmpleado.entrega.cod_obra,
      obra: {
        cod_obra: backendEntregaEmpleado.entrega.obra.cod_obra,
        cod_postal: backendEntregaEmpleado.entrega.obra.cod_postal,
        cuil_cliente: backendEntregaEmpleado.entrega.obra.cuil,
        fecha_ini: backendEntregaEmpleado.entrega.obra.fecha_ini,
        estado: backendEntregaEmpleado.entrega.obra.estado,
        fecha_cancelacion:
          backendEntregaEmpleado.entrega.obra.fecha_cancelacion,
        direccion: backendEntregaEmpleado.entrega.obra.direccion,
        nota_fabrica: backendEntregaEmpleado.entrega.obra.nota_fabrica,
        cliente: {
          cuil: backendEntregaEmpleado.entrega.obra.cliente.cuil,
          razon_social:
            backendEntregaEmpleado.entrega.obra.cliente.razon_social,
          telefono: backendEntregaEmpleado.entrega.obra.cliente.telefono,
          mail: backendEntregaEmpleado.entrega.obra.cliente.mail,
        },
      },
      fecha_hora_entrega: backendEntregaEmpleado.entrega.fecha_hora_entrega,
      estado: backendEntregaEmpleado.entrega.estado,
      observaciones: backendEntregaEmpleado.entrega.observaciones,
      detalle: backendEntregaEmpleado.entrega.detalle,
      empleados_asignados: [],
    },
  }
}

class EntregasService {
  private baseURL = '/entregaEmpleado'

  async getEntregasByEmpleado(cuil: string): Promise<EntregaEmpleado[]> {
    try {
      const response = await api.get<BackendEntregaEmpleado[]>(
        `${this.baseURL}/${cuil}`
      )
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error(`Error al obtener entregas para empleado ${cuil}:`, error)
      throw error
    }
  }

  async getEntregasByEmpleadoAndEstado(
    cuil: string,
    estado: 'PENDIENTE' | 'ENTREGADO' | 'EN CURSO' | 'CANCELADO'
  ): Promise<EntregaEmpleado[]> {
    try {
      const response = await api.get<BackendEntregaEmpleado[]>(
        `${this.baseURL}/${cuil}/${estado}`
      )
      return response.data.map(mapToFrontend)
    } catch (error) {
      console.error(
        `Error al obtener entregas ${estado} para empleado ${cuil}:`,
        error
      )
      throw error
    }
  }

  async getEntregaByEmpleadoAndId(
    cuil: string,
    codEntrega: number
  ): Promise<EntregaEmpleado> {
    try {
      const response = await api.get<BackendEntregaEmpleado>(
        `${this.baseURL}/${cuil}/${codEntrega}`
      )
      return mapToFrontend(response.data)
    } catch (error) {
      console.error(
        `Error al obtener entrega ${codEntrega} para empleado ${cuil}:`,
        error
      )
      throw error
    }
  }

  async getEntregasPendientes(cuil: string): Promise<EntregaEmpleado[]> {
    return this.getEntregasByEmpleadoAndEstado(cuil, 'PENDIENTE')
  }

  async getEntregasEntregadas(cuil: string): Promise<EntregaEmpleado[]> {
    return this.getEntregasByEmpleadoAndEstado(cuil, 'ENTREGADO')
  }

  async getEntregasEnCurso(cuil: string): Promise<EntregaEmpleado[]> {
    return this.getEntregasByEmpleadoAndEstado(cuil, 'EN CURSO')
  }

  async getEntregasCanceladas(cuil: string): Promise<EntregaEmpleado[]> {
    return this.getEntregasByEmpleadoAndEstado(cuil, 'CANCELADO')
  }

  async asignarEmpleadoAEntrega(data: CreateEntregaEmpleadoDTO): Promise<void> {
    try {
      await api.post(this.baseURL, data)
    } catch (error) {
      console.error('Error al asignar empleado a entrega:', error)
      throw error
    }
  }

  async updateRolEnEntrega(
    cuil: string,
    codEntrega: number,
    data: UpdateEntregaEmpleadoDTO
  ): Promise<void> {
    try {
      await api.put(`${this.baseURL}/${cuil}/${codEntrega}`, data)
    } catch (error) {
      console.error('Error al actualizar rol en entrega:', error)
      throw error
    }
  }

  async removerEmpleadoDeEntrega(
    cuil: string,
    codEntrega: number
  ): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${cuil}/${codEntrega}`)
    } catch (error) {
      console.error('Error al remover empleado de entrega:', error)
      throw error
    }
  }

  async getEstadisticasEmpleado(cuil: string): Promise<{
    total: number
    porRol: { [rol: string]: number }
    porEstado: { [estado: string]: number }
  }> {
    try {
      const entregas = await this.getEntregasByEmpleado(cuil)

      const estadisticas = {
        total: entregas.length,
        porRol: {} as { [rol: string]: number },
        porEstado: {} as { [estado: string]: number },
      }

      entregas.forEach((entrega) => {
        const rol = entrega.rol_entrega || 'Sin rol'
        estadisticas.porRol[rol] = (estadisticas.porRol[rol] || 0) + 1

        estadisticas.porEstado[entrega.entrega.estado] =
          (estadisticas.porEstado[entrega.entrega.estado] || 0) + 1
      })

      return estadisticas
    } catch (error) {
      console.error('Error al obtener estadísticas del empleado:', error)
      throw error
    }
  }
}

export const entregasService = new EntregasService()
export default entregasService
