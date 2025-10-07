import api from './api/api'
import {
  Entrega,
  EntregaEmpleado,
  Empleado,
  Obra,
  Cliente,
  Localidad,
} from '@/types'

interface EmpleadoAsignado {
  cuil: string
  cod_obra: number
  cod_entrega: number
  rol_entrega: string
  empleado: {
    cuil: string
    nombre: string
    apellido: string
    rol_actual: string
    area_trabajo: string
    contrasenia?: string
  }
}

interface BackendEntrega {
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
      | 'EN ESPERA DE PAGO'
      | 'PAGADA PARCIALMENTE'
      | 'EN ESPERA DE STOCK'
      | 'EN PRODUCCION'
      | 'PRODUCCION FINALIZADA'
      | 'PAGADA TOTALMENTE'
      | 'ENTREGADA'
      | 'CANCELADA'
    fecha_cancelacion: string | null
    direccion: string
    nota_fabrica: string
    cliente: {
      cuil: string
      razon_social: string
      telefono: string
      mail: string
    }
    localidad: {
      cod_postal: number
      nombre_localidad: string
    }
  }
  entrega_empleado: EmpleadoAsignado[]
}

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
        | 'EN ESPERA DE PAGO'
        | 'PAGADA PARCIALMENTE'
        | 'EN ESPERA DE STOCK'
        | 'EN PRODUCCION'
        | 'PRODUCCION FINALIZADA'
        | 'PAGADA TOTALMENTE'
        | 'ENTREGADA'
        | 'CANCELADA'
      fecha_cancelacion: string | null
      direccion: string
      nota_fabrica: string
      cliente: {
        cuil: string
        razon_social: string
        telefono: string
        mail: string
      }
      localidad: {
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
      | 'EN ESPERA DE PAGO'
      | 'PAGADA PARCIALMENTE'
      | 'EN ESPERA DE STOCK'
      | 'EN PRODUCCION'
      | 'PRODUCCION FINALIZADA'
      | 'PAGADA TOTALMENTE'
      | 'ENTREGADA'
      | 'CANCELADA'
    fecha_cancelacion: string | null
    direccion: string
    nota_fabrica: string
    localidad: {
      cod_postal: number
      nombre_localidad: string
    }
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

export interface CreateEntregaDTO {
  cod_obra: number
  fecha_hora_entrega: string
  detalle: string
  observaciones?: string
  dias_viaticos?: number
  empleados: {
    cuil: string
    rol_entrega: 'ENCARGADO' | 'AYUDANTE'
  }[]
  maquinarias?: number[]
  cod_op?: number
}

export interface CreateEntregaEmpleadoDTO {
  cuil: string
  cod_entrega: number
  cod_obra: number
  rol_entrega: string
}

export interface FinalizarEntregaDTO {
  estado: 'ENTREGADO'
  observaciones?: string
}

export interface UpdateEntregaEmpleadoDTO {
  rol_entrega?: string
}

const mapGetAllToFrontend = (backendEntrega: any): Entrega => {
  const empleados_asignados =
    backendEntrega.entrega_empleado?.map((ee: any) => ({
      rol_entrega: ee.rol_entrega,
      empleado: {
        cuil: ee.empleado?.cuil || ee.cuil,
        nombre: ee.empleado?.nombre || 'Nombre no disponible',
        apellido: ee.empleado?.apellido || 'Apellido no disponible',
      },
    })) || []

  const maquinarias_usadas =
    backendEntrega.uso_maquinaria?.map((um: any) => ({
      cod_maquina: um.cod_maquina,
      descripcion: um.maquinaria?.descripcion || 'Descripción no disponible',
    })) || []

  return {
    cod_entrega: backendEntrega.cod_entrega,
    cod_obra: backendEntrega.cod_obra,
    fecha_hora_entrega: backendEntrega.fecha_hora_entrega,
    estado: backendEntrega.estado,
    observaciones: backendEntrega.observaciones,
    detalle: backendEntrega.detalle,
    dias_viaticos: backendEntrega.dias_viaticos,
    obra: backendEntrega.obra,
    empleados_asignados: empleados_asignados,
    maquinarias_usadas: maquinarias_usadas,
    orden_de_produccion: backendEntrega.orden_de_produccion,
  }
}

// Mapea la estructura del backend a la estructura del frontend
const mapToFrontend = (
  backendEntregaEmpleado: BackendEntregaEmpleado
): EntregaEmpleado => {
  const maquinarias_usadas =
    (backendEntregaEmpleado.entrega as any).uso_maquinaria?.map((um: any) => ({
      cod_maquina: um.cod_maquina,
      descripcion: um.maquinaria?.descripcion || 'Descripción no disponible',
    })) || []

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
      localidad: backendEntregaEmpleado.obra.localidad,
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
        localidad: backendEntregaEmpleado.entrega.obra.localidad,
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
      maquinarias_usadas: maquinarias_usadas,
    },
  }
}

class EntregasService {
  private baseURL = '/entregas'

  async getAllEntregas(): Promise<Entrega[]> {
    try {
      const { data } = await api.get<any[]>(this.baseURL)
      return data.map(mapGetAllToFrontend)
    } catch (error) {
      console.error('Error al obtener todas las entregas:', error)
      throw error
    }
  }

  // Obtiene entregas de un empleado filtradas por estado
  async getEntregasByEmpleadoAndEstado(
    cuil: string,
    estado: 'PENDIENTE' | 'ENTREGADO' | 'EN CURSO' | 'CANCELADO'
  ): Promise<EntregaEmpleado[]> {
    try {
      const response = await api.get<BackendEntrega[]>(
        `${this.baseURL}/${cuil}/${estado}`
      )
      const assignments = response.data.flatMap((entrega) => {
        const specificAssignment = entrega.entrega_empleado.find(
          (assignment) => assignment.cuil === cuil
        )
        if (specificAssignment) {
          const backendEntregaEmpleado: BackendEntregaEmpleado = {
            cuil: specificAssignment.cuil,
            cod_obra: specificAssignment.cod_obra,
            cod_entrega: specificAssignment.cod_entrega,
            rol_entrega: specificAssignment.rol_entrega,
            empleado: specificAssignment.empleado,
            obra: entrega.obra,
            entrega: {
              cod_entrega: entrega.cod_entrega,
              cod_obra: entrega.cod_obra,
              fecha_hora_entrega: entrega.fecha_hora_entrega,
              estado: entrega.estado,
              observaciones: entrega.observaciones,
              detalle: entrega.detalle,
              obra: entrega.obra,
              localidad: entrega.obra.localidad,
            } as BackendEntregaEmpleado['entrega'],
          }
          return [backendEntregaEmpleado]
        }
        return []
      })

      return assignments.map(mapToFrontend)
    } catch (error) {
      console.error(
        `Error al obtener entregas ${estado} para empleado ${cuil}:`,
        error
      )
      throw error
    }
  }

  async createEntrega(entregaData: CreateEntregaDTO): Promise<Entrega> {
    try {
      const payload = {
        ...entregaData,
        estado: 'PENDIENTE',
      }

      console.log('Payload final enviado al backend:', payload)

      const response = await api.post<any>(this.baseURL, payload)

      return response.data as Entrega
    } catch (error: any) {
      console.error('Error detallado al crear entrega:', error)
      if (error.response) {
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
      }
      throw new Error(
        error.response?.data?.message ||
          'Error al crear la entrega en el servidor.'
      )
    }
  }

  // Obtiene una entrega específica de un empleado
  async getEntregaByEmpleadoAndId(
    cuil: string,
    codEntrega: number
  ): Promise<EntregaEmpleado> {
    try {
      const response = await api.get<BackendEntrega>(
        `${this.baseURL}/${cuil}/${codEntrega}`
      )
      const entrega = response.data
      const specificAssignment = entrega.entrega_empleado.find(
        (assignment) => assignment.cuil === cuil
      )

      if (!specificAssignment) {
        throw new Error('Asignación de empleado no encontrada en la entrega.')
      }

      const backendEntregaEmpleado: BackendEntregaEmpleado = {
        cuil: specificAssignment.cuil,
        cod_obra: specificAssignment.cod_obra,
        cod_entrega: specificAssignment.cod_entrega,
        rol_entrega: specificAssignment.rol_entrega,
        empleado: specificAssignment.empleado,
        obra: entrega.obra,
        entrega: {
          cod_entrega: entrega.cod_entrega,
          cod_obra: entrega.cod_obra,
          fecha_hora_entrega: entrega.fecha_hora_entrega,
          estado: entrega.estado,
          observaciones: entrega.observaciones,
          detalle: entrega.detalle,
          obra: entrega.obra,
          localidad: entrega.obra.localidad,
        } as BackendEntregaEmpleado['entrega'],
      }

      return mapToFrontend(backendEntregaEmpleado)
    } catch (error) {
      console.error(
        `Error al obtener entrega ${codEntrega} para empleado ${cuil}:`,
        error
      )
      throw error
    }
  }

  // Marca una entrega como finalizada con observaciones opcionales
  async finalizarEntrega(
    cod_entrega: number,
    observaciones?: string
  ): Promise<Entrega> {
    try {
      const { data } = await api.patch<BackendEntrega>(
        `${this.baseURL}/${cod_entrega}/finalizar`,
        { observaciones }
      )
      return mapGetAllToFrontend(data)
    } catch (error: any) {
      throw new Error(
        `No se pudo finalizar la entrega: ${error.response?.data?.message || error.message}`
      )
    }
  }

  // Marca una entrega como cancelada con observaciones opcionales
  async cancelarEntrega(
    cod_entrega: number,
    motivo?: string
  ): Promise<Entrega> {
    try {
      const { data } = await api.patch<BackendEntrega>(
        `${this.baseURL}/${cod_entrega}/cancelar`,
        { motivo }
      )
      return mapGetAllToFrontend(data)
    } catch (error: any) {
      throw new Error(
        `No se pudo cancelar la entrega: ${error.response?.data?.message || error.message}`
      )
    }
  }
}

const entregasService = new EntregasService()
export default entregasService
