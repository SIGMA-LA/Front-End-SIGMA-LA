import type { AvailabilityStatus } from '@/types/vehiculo'

export type EstadoMaquinaria = 'DISPONIBLE' | 'NO DISPONIBLE'

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
}

export interface MaquinariaConDisponibilidad extends Maquinaria {
  availabilityStatus: AvailabilityStatus
  warningMessage?: string
}
