'use server'

import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types/actions'
import type { PedidoStock, EstadoPedidoStock, CreatePedidoStockInput } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/pedido-stock`

export async function createPedidoStock(data: CreatePedidoStockInput): Promise<ActionResponse<PedidoStock>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await res.json()
    revalidatePath('/produccion')
    revalidatePath('/coordinacion/pedidos')
    return { success: true, data: responseData }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear pedido de stock'
    console.error('[createPedidoStock]', message)
    return { success: false, error: message }
  }
}

export async function getPedidosStock(): Promise<ActionResponse<PedidoStock[]>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0, tags: ['pedidos-stock'] },
    })
    const responseData = await res.json()
    return { success: true, data: responseData }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener pedidos de stock'
    console.error('[getPedidosStock]', message)
    return { success: false, error: message }
  }
}

export async function updatePedidoStockEstado(id: string, estado: EstadoPedidoStock): Promise<ActionResponse<PedidoStock>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    })
    const responseData = await res.json()
    revalidatePath('/coordinacion/pedidos')
    revalidatePath('/produccion')
    return { success: true, data: responseData }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar estado del pedido'
    console.error('[updatePedidoStockEstado]', message)
    return { success: false, error: message }
  }
}
