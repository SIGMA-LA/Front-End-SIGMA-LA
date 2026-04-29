import type { Cliente } from '@/types/cliente'
import type { Localidad } from '@/types/geo'
import type { Entrega } from '@/types/entrega'
import type { Visita } from '@/types/visita'
import type { Pago } from '@/types/pago'
import { ESTADOS_OBRA } from '@/constants'

export type EstadoObra = (typeof ESTADOS_OBRA)[number]
export type EstadoNotaFabricaProduccion =
  | 'SIN_ORDEN'
  | 'EN_PRODUCCION'
  | 'FINALIZADA'

export interface Presupuesto {
  nro_presupuesto: number
  cod_obra: number
  fecha_emision: string
  fecha_aceptacion?: string
  valor: number
}

export interface Obra {
  cod_obra: number
  cod_localidad: number
  cuil_cliente: string
  cuil_arquitecto?: string
  estado: EstadoObra
  direccion: string
  cliente: Cliente
  arquitecto?: Cliente | null
  nota_fabrica?: string
  nota_fabrica_pid?: string
  fecha_ini: string
  fecha_cancelacion: string | null
  localidad: Localidad
  entregas?: Entrega[]
  entrega?: Entrega[] // Alias para el backend
  visitas?: Visita[]
  visita?: Visita[] // Alias para el backend
  presupuesto?: Presupuesto[]
  pagos?: Pago[]
  pago?: Pago[] // Alias para el backend
  esGrande?: boolean
}

export interface CreateObraInput {
  direccion: string
  cuil_cliente: string
  cuil_arquitecto?: string | null
  cod_localidad: number
  fecha_ini: string
  estado?: EstadoObra
  nota_fabrica?: string
  esGrande?: boolean
}

export interface UpdateObraInput {
  direccion?: string
  cuil_cliente?: string
  cuil_arquitecto?: string | null
  cod_localidad?: number
  fecha_ini?: string
  estado?: EstadoObra
  nota_fabrica?: string
  esGrande?: boolean
}

export interface PresupuestoInput {
  valor: number
  fecha_emision: string
  fecha_aceptacion?: string
}
