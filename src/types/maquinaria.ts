import type { AvailabilityStatus } from '@/types/vehiculo'
import { ESTADOS_MAQUINARIA } from '@/constants'
import type { Entrega } from './entrega'

export type EstadoMaquinaria = (typeof ESTADOS_MAQUINARIA)[number]

export interface Maquinaria {
  cod_maquina: number
  descripcion: string
  estado: EstadoMaquinaria
  uso_maquinaria?: UsoMaquinaria[]
}

export interface MaquinariaSimple {
  cod_maquina: number
  descripcion: string
}

export interface UsoMaquinaria {
  cod_maquina: number
  cod_entrega: number
  fecha_hora_ini_uso: string
  fecha_hora_fin_est: string
  fecha_hora_fin_real?: string
  estado: string
  maquinaria?: Maquinaria
  entrega: Entrega
}

export interface UsosProgramadosMaquinaria {
  uso_maquinaria: UsoMaquinaria[]
}

export interface MaquinariaConDisponibilidad extends Maquinaria {
  availabilityStatus: AvailabilityStatus
  warningMessage?: string
}
