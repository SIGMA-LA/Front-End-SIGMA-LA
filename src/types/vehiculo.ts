export type VehiculoTipo =
  | 'CAMION CHICO'
  | 'CAMIONETA'
  | 'AUTOMOVIL'
  | 'CAMION GRANDE'

export type VehiculoEstado =
  | 'DISPONIBLE'
  | 'EN USO'
  | 'MANTENIMIENTO'
  | 'REPARACION'
  | 'FUERA DE SERVICIO'
  | 'RESERVADO'

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

export type AvailabilityStatus = 'DISPONIBLE' | 'ADVERTENCIA' | 'NO_DISPONIBLE'

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
}

export interface UsoVehiculoVisita {
  patente: string
  cod_visita: number
  fecha_hora_ini_uso: string
  fecha_hora_ini_est: string
  fecha_hora_fin_real?: string
  estado: string
}
