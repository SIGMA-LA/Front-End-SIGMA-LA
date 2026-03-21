import type { Empleado } from '@/types/auth'
import type { Obra } from '@/types/obra'
import type { Localidad } from '@/types/geo'
import type { UsoVehiculoVisita } from '@/types/vehiculo'

export type MotivoVisita =
  | 'MEDICION'
  | 'RE-MEDICION'
  | 'REPARACION'
  | 'ASESORAMIENTO'
  | 'VISITA INICIAL'

export type EstadoVisita =
  | 'PROGRAMADA'
  | 'EN CURSO'
  | 'CANCELADA'
  | 'REPROGRAMADA'
  | 'COMPLETADA'

export interface EmpleadoVisita {
  cuil: string
  cod_visita: number
  empleado: Empleado
  visita: Visita
}

export interface Visita {
  cod_visita: number
  obra?: Obra
  fecha_hora_visita: string
  motivo_visita: MotivoVisita
  estado?: EstadoVisita
  empleado_visita: EmpleadoVisita[]
  observaciones?: string
  direccion_visita?: string
  uso_vehiculo_visita: UsoVehiculoVisita
  fecha_cancelacion?: string
  dias_viaticos?: number
  nombre_cliente?: string
  apellido_cliente?: string
  telefono_cliente?: string
  mail_cliente?: string
  localidad?: Localidad
}

export type VisitaFormData = {
  fecha_hora_visita: string
  motivo_visita: MotivoVisita
  observaciones: string
  direccion_visita: string
  cod_obra: number | null
  cod_localidad: number | null
  dias_viatico: number
  empleados_visita: string[]
  vehiculo: string
  nombre_cliente?: string | null
  apellido_cliente?: string | null
  telefono_cliente?: string | null
}
