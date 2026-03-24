import type { Empleado } from '@/types/auth'
import type { Obra } from '@/types/obra'
import type { UsoMaquinaria } from '@/types/maquinaria'
import type { UsoVehiculoEntrega } from '@/types/vehiculo'

export type EstadoEntrega = 'ENTREGADO' | 'CANCELADO' | 'PENDIENTE'

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

export type RolEntrega = 'ENCARGADO' | 'ACOMPANANTE'

export interface EntregaEmpleado {
  cuil: string
  cod_obra: number
  cod_entrega: number
  rol_entrega: RolEntrega
  empleado: Empleado
  entrega: Entrega
  obra: Obra
}


export type EstadoOrdenProduccion = 'PENDIENTE' | 'APROBADA' | 'EN PRODUCCION' | 'FINALIZADA'

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
