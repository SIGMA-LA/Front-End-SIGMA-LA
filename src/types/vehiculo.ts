import type { Visita } from './visita'
import {
  ESTADOS_DISPONIBILIDAD,
  ESTADOS_VEHICULO,
  TIPOS_VEHICULO,
} from '@/constants'

export type VehiculoTipo = (typeof TIPOS_VEHICULO)[number]

export type VehiculoEstado = (typeof ESTADOS_VEHICULO)[number]

export interface Vehiculo {
  patente: string
  tipo_vehiculo: VehiculoTipo
  estado: VehiculoEstado
  anio: number
  marca: string
  modelo: string
}

export interface VehiculoFormData {
  tipo_vehiculo: VehiculoTipo
  estado: VehiculoEstado
  patente: string
  anio?: number
  marca?: string
  modelo?: string
}

export type AvailabilityStatus = (typeof ESTADOS_DISPONIBILIDAD)[number]

export interface VehiculoConDisponibilidad extends Vehiculo {
  availabilityStatus: AvailabilityStatus
  warningMessage?: string
}

export interface UsoVehiculoEntrega {
  patente: string
  cod_entrega: number
  fecha_hora_ini_uso: string
  fecha_hora_ini_est: string
  fecha_hora_fin_real?: string
  estado: string
  vehiculo?: Vehiculo
}

export interface UsoVehiculoVisita {
  patente: string
  cod_visita: number
  fecha_hora_ini_uso: string
  fecha_hora_ini_est: string
  fecha_hora_fin_real?: string
  estado: string
  vehiculo?: Vehiculo
  visita?: Visita
}
