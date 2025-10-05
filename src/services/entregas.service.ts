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
      | 'ACTIVA'
      | 'EN PRODUCCION'
      | 'FINALIZADA'
      | 'ENTREGADA'
      | 'EN ESPERA DE STOCK'
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
        | 'ACTIVA'
        | 'EN PRODUCCION'
        | 'FINALIZADA'
        | 'ENTREGADA'
        | 'EN ESPERA DE STOCK'
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
      | 'ACTIVA'
      | 'EN PRODUCCION'
      | 'FINALIZADA'
      | 'ENTREGADA'
      | 'EN ESPERA DE STOCK'
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
  empleados: {
    cuil: string
    rol_entrega: 'ENCARGADO' | 'AYUDANTE'
  }[]
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

// Mapea la estructura del backend a la estructura del frontend
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
    },
  }
}

class EntregasService {
  private baseURL = '/entregas'

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
      const entregaPayload = {
        cod_obra: entregaData.cod_obra,
        fecha_hora_entrega: entregaData.fecha_hora_entrega,
        detalle: entregaData.detalle,
        estado: 'PENDIENTE',
        observaciones: entregaData.observaciones,
      }

      console.log('Paso 1 - Creando entrega:', entregaPayload)

      const responseEntrega = await api.post<BackendEntrega>(
        this.baseURL,
        entregaPayload
      )

      const entregaCreada = responseEntrega.data
      console.log('Entrega creada:', entregaCreada)

      const empleadosPayload = {
        empleados: entregaData.empleados,
      }

      console.log('Paso 2 - Asignando empleados:', empleadosPayload)

      const responseConEmpleados = await api.post<any>(
        `${this.baseURL}/${entregaCreada.cod_entrega}/empleados`,
        empleadosPayload
      )

      const entregaCompleta = responseConEmpleados.data

      return {
        cod_entrega: entregaCompleta.cod_entrega,
        cod_obra: entregaCompleta.cod_obra,
        obra: {
          cod_obra: entregaCompleta.obra.cod_obra,
          cod_postal: entregaCompleta.obra.cod_postal,
          cuil_cliente: entregaCompleta.obra.cuil,
          fecha_ini: entregaCompleta.obra.fecha_ini,
          estado: entregaCompleta.obra.estado,
          fecha_cancelacion: entregaCompleta.obra.fecha_cancelacion,
          direccion: entregaCompleta.obra.direccion,
          nota_fabrica: entregaCompleta.obra.nota_fabrica || '',
          localidad: entregaCompleta.obra.localidad,
          cliente: entregaCompleta.obra.cliente,
        },
        fecha_hora_entrega: entregaCompleta.fecha_hora_entrega,
        estado: entregaCompleta.estado,
        observaciones: entregaCompleta.observaciones,
        detalle: entregaCompleta.detalle,
        empleados_asignados:
          entregaCompleta.entrega_empleado?.map((emp: any) => ({
            cuil: emp.cuil,
            cod_obra: emp.cod_obra,
            cod_entrega: emp.cod_entrega,
            rol_entrega: emp.rol_entrega,
            empleado: emp.empleado,
            entrega: {} as any,
            obra: entregaCompleta.obra as any,
          })) || [],
      }
    } catch (error: any) {
      console.error('Error al crear entrega:', error)
      if (error.response) {
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
      }
      throw new Error(
        error.response?.data?.message ||
          'Error al crear la entrega en el servidor'
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
  ): Promise<FinalizarEntregaDTO> {
    try {
      const updateData: {
        estado: 'ENTREGADO'
        observaciones?: string
      } = {
        estado: 'ENTREGADO',
      }

      if (observaciones && observaciones.trim() !== '') {
        updateData.observaciones = observaciones.trim()
      }

      const response = await api.put(
        `${this.baseURL}/${cod_entrega}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error(`Error al finalizar entrega ${cod_entrega}:`, error)
      throw new Error(
        `No se pudo finalizar la entrega: ${error.response?.data?.message || error.message}`
      )
    }
  }
}

const entregasService = new EntregasService()
export default entregasService
