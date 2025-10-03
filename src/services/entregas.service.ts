import api from './api/api'
import { EntregaEmpleado, Empleado, Obra, Cliente, Localidad } from '@/types'

// 1. Definir la estructura real que viene del backend (array de 'entrega's con relaciones)
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
    cuil: string // cuil_cliente
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
  entrega_empleado: EmpleadoAsignado[] // <-- El array de asignaciones
}

// 2. Mantener la estructura del DTO de asignación que 'mapToFrontend' espera
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

// Función para mapear datos del backend al frontend (espera la estructura plana)
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
  private baseURL = '/entregas'

  // ... getEntregasByEmpleado(cuil) debe ser actualizado si usa la misma ruta que getEntregasByEmpleadoAndEstado sin estado
  // Para simplificar, asumimos que getEntregasByEmpleado es un caso especial de la de estado o usa otra ruta.

  async getEntregasByEmpleadoAndEstado(
    cuil: string,
    estado: 'PENDIENTE' | 'ENTREGADO' | 'EN CURSO' | 'CANCELADO'
  ): Promise<EntregaEmpleado[]> {
    try {
      // 3. Recibir el array de ENTREGAS (BackendEntrega[])
      const response = await api.get<BackendEntrega[]>(
        `${this.baseURL}/${cuil}/${estado}`
      )
      
      // Aplanar el array de ENTREGAS a un array de ASIGNACIONES (BackendEntregaEmpleado[])
      const assignments = response.data.flatMap((entrega) => {
        // Encontramos la asignación específica para el CUIL del empleado que se está consultando.
        const specificAssignment = entrega.entrega_empleado.find(
          (assignment) => assignment.cuil === cuil
        )
        
        // Si encontramos la asignación específica, creamos el DTO plano esperado por mapToFrontend.
        if (specificAssignment) {
          const backendEntregaEmpleado: BackendEntregaEmpleado = {
            cuil: specificAssignment.cuil,
            cod_obra: specificAssignment.cod_obra,
            cod_entrega: specificAssignment.cod_entrega,
            rol_entrega: specificAssignment.rol_entrega,
            empleado: specificAssignment.empleado,
            // Copiamos la obra y la entrega de la entrega principal
            obra: entrega.obra, 
            // Necesitamos que el objeto entrega no tenga el array 'entrega_empleado'
            // para que coincida con la estructura esperada por el DTO.
            entrega: {
              cod_entrega: entrega.cod_entrega,
              cod_obra: entrega.cod_obra,
              fecha_hora_entrega: entrega.fecha_hora_entrega,
              estado: entrega.estado,
              observaciones: entrega.observaciones,
              detalle: entrega.detalle,
              obra: entrega.obra, // Obra anidada en la entrega (ya viene del backend)
              // No incluimos 'entrega_empleado' aquí
            } as BackendEntregaEmpleado['entrega'] // Cast para ignorar la diferencia de tipos
          }
          return [backendEntregaEmpleado]
        }
        return [] // Si por alguna razón la asignación no está, descartar la entrega (no debería pasar si el repo filtra bien)
      })

      // 4. Mapear el array de asignaciones a la estructura final del frontend
      return assignments.map(mapToFrontend)
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
      // Si esta ruta devuelve una sola 'entrega', también necesita el aplanamiento
      const response = await api.get<BackendEntrega>(
        `${this.baseURL}/${cuil}/${codEntrega}`
      )
      
      const entrega = response.data

      // Aplanar el objeto ENTREGAS a un objeto ASIGNACIÓN (BackendEntregaEmpleado)
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
        } as BackendEntregaEmpleado['entrega']
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
  
  // ... resto de métodos ...
}

const entregasService = new EntregasService()
export default entregasService