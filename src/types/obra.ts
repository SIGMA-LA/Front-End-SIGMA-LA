import type { Cliente } from '@/types/cliente'
import type { Localidad } from '@/types/geo'
import type { Entrega } from '@/types/entrega'
import type { Visita } from '@/types/visita'
import type { Pago } from '@/types/pago'

export type EstadoObra =
  | 'EN ESPERA DE PAGO'
  | 'PAGADA PARCIALMENTE'
  | 'EN ESPERA DE STOCK'
  | 'EN PRODUCCION'
  | 'PRODUCCION FINALIZADA'
  | 'PAGADA TOTALMENTE'
  | 'ENTREGADA'
  | 'CANCELADA'

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
}

export interface CreateObraInput {
  direccion: string
  cuil_cliente: string
  cuil_arquitecto?: string | null
  cod_localidad: number
  fecha_ini: string
  estado?: EstadoObra
  nota_fabrica?: string
}

export interface UpdateObraInput {
  direccion?: string
  cuil_cliente?: string
  cuil_arquitecto?: string | null
  cod_localidad?: number
  fecha_ini?: string
  estado?: EstadoObra
  nota_fabrica?: string
}

export interface PresupuestoInput {
  valor: number
  fecha_emision: string
  fecha_aceptacion?: string
}

