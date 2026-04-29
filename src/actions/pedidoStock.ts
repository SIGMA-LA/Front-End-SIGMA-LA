'use server'

import { fetchAPI } from '@/lib/fetchAPI'
import type { ApiResponse, PedidoStock, EstadoPedidoStock, CreatePedidoStockInput } from '@/types'

export async function createPedidoStock(data: CreatePedidoStockInput): Promise<ApiResponse<PedidoStock>> {
  return fetchAPI<PedidoStock>('/api/pedido-stock', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getPedidosStock(): Promise<ApiResponse<PedidoStock[]>> {
  return fetchAPI<PedidoStock[]>('/api/pedido-stock')
}

export async function updatePedidoStockEstado(id: string, estado: EstadoPedidoStock): Promise<ApiResponse<PedidoStock>> {
  return fetchAPI<PedidoStock>(`/api/pedido-stock/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  })
}
