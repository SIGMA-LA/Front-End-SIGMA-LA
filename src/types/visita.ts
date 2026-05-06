import type { Empleado } from '@/types/auth'
import type { Obra } from '@/types/obra'
import type { Localidad } from '@/types/geo'
import type { UsoVehiculoVisita } from '@/types/vehiculo'
import { ESTADOS_VISITA, MOTIVOS_VISITA } from '@/constants'

export type MotivoVisita = (typeof MOTIVOS_VISITA)[number]

export type EstadoVisita = (typeof ESTADOS_VISITA)[number]

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
  uso_vehiculo_visita?: UsoVehiculoVisita | UsoVehiculoVisita[]
  fecha_cancelacion?: string
  dias_viatico?: number
  nombre_cliente?: string
  apellido_cliente?: string
  telefono_cliente?: string
  mail_cliente?: string
  localidad?: Localidad
}

export type VisitaFormData = {
  fecha_hora_visita: string
  fechaSalida?: string
  horaSalida?: string
  fechaRegreso?: string
  horaRegreso?: string
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
