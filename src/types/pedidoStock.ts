import type { Obra } from './obra'

export type EstadoPedidoStock = 'PENDIENTE' | 'APROBADO' | 'PEDIDO' | 'RECIBIDO'

export interface PedidoStock {
  id: string
  obraId: number
  descripcion: string
  estado: EstadoPedidoStock
  createdAt: string
  updatedAt: string
  obra?: Obra
}

export interface CreatePedidoStockInput {
  obraId: number
  descripcion: string
}

export interface UpdatePedidoStockEstadoInput {
  estado: EstadoPedidoStock
}
