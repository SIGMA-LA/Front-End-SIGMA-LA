import type { Obra, EstadoObra } from './obra'
import type { Cliente } from './cliente'

export interface Pago {
  cod_pago: number
  cod_obra: number
  fecha_pago: string
  monto: number
  obra: Obra
}

export interface PagoFormData {
  cod_obra: number
  fecha_pago: string
  monto: number
}

export interface PagosFilter {
  search?: string
  cliente?: string
  fechaDesde?: string
  fechaHasta?: string
  obra?: string
  montoMin?: number
  montoMax?: number
}

export interface ObraConPresupuesto {
  cod_obra: number
  direccion: string
  estado: EstadoObra
  cliente: Cliente
  presupuesto: {
    nro_presupuesto: number
    valor: number
    fecha_aceptacion: string
  }
  totalPagado: number
  saldoPendiente: number
  porcentajePagado: number
  cantidad_pagos: number
}
