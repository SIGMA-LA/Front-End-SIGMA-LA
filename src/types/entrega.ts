import type { Empleado } from '@/types/auth'
import type { Obra } from '@/types/obra'
import type { UsoMaquinaria } from '@/types/maquinaria'
import type { UsoVehiculoEntrega } from '@/types/vehiculo'
import {
  ESTADOS_ENTREGA,
  ESTADOS_ORDEN_PRODUCCION,
  ROLES_ENTREGA,
} from '@/constants'

export type EstadoEntrega = (typeof ESTADOS_ENTREGA)[number]

export interface Entrega {
  cod_entrega: number
  cod_obra: number
  obra: Obra
  fecha_hora_entrega: string
  estado: EstadoEntrega
  observaciones?: string
  detalle: string
  empleados_asignados: EntregaEmpleado[]
  maquinarias?: UsoMaquinaria[]
  vehiculos?: UsoVehiculoEntrega[]
  dias_viaticos?: number
  orden_de_produccion?: OrdenProduccion
}

export type RolEntrega = (typeof ROLES_ENTREGA)[number]

export interface EntregaEmpleado {
  cuil: string
  cod_obra: number
  cod_entrega: number
  rol_entrega: RolEntrega
  empleado: Empleado
  entrega: Entrega
  obra: Obra
}

export type EstadoOrdenProduccion = (typeof ESTADOS_ORDEN_PRODUCCION)[number]

export interface OrdenProduccion {
  cod_op: number
  cod_obra: number
  estado: EstadoOrdenProduccion
  fecha_confeccion: string
  fecha_validacion: string | null
  url: string
  public_id: string | null
  obra: Obra
}
