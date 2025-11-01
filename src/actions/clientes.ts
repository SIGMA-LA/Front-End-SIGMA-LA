'use server'

import { Cliente } from '@/types'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const baseUrl = API_BASE.endsWith('/clientes')
  ? API_BASE
  : `${API_BASE}/clientes`

export async function obtenerClientes(filtro?: string): Promise<Cliente[]> {
  try {
    const token = await getAccessToken()
    const url = filtro?.trim()
      ? `${baseUrl}/buscar?q=${encodeURIComponent(filtro.trim())}`
      : baseUrl

    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[obtenerClientes]', error)
    return []
  }
}

export async function obtenerCliente(cuil: string): Promise<Cliente | null> {
  if (!cuil) return null
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${encodeURIComponent(cuil)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    return await res.json()
  } catch (error) {
    console.error('[obtenerCliente]', error)
    return null
  }
}

export async function crearCliente(formData: FormData): Promise<any> {
  try {
    const token = await getAccessToken()
    const raw = Object.fromEntries(formData.entries()) as Record<
      string,
      FormDataEntryValue
    >
    const dataCliente: Record<string, string> = {}
    for (const [key, val] of Object.entries(raw)) {
      if (typeof val === 'string') {
        dataCliente[key] = val.trim()
      }
    }
    if (!dataCliente.cuil) {
      throw new Error('CUIL es requerido')
    }
    const cuilDigits = dataCliente.cuil.replace(/\D/g, '')
    if (cuilDigits.length !== 11) {
      throw new Error('CUIL inválido (debe tener 11 dígitos)')
    }
    dataCliente.cuil = cuilDigits

    const payload = {
      cuil: dataCliente.cuil,
      tipo_cliente: dataCliente.tipo_cliente,
      telefono: dataCliente.telefono,
      mail: dataCliente.mail,
      razon_social: dataCliente.razon_social,
      nombre: dataCliente.nombre,
      apellido: dataCliente.apellido,
      sexo: dataCliente.sexo,
    }

    const res = await fetchWithErrorHandling(`${baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const response = await res.json()

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return response
  } catch (error) {
    console.error('[crearCliente]', error)
    throw error
  }
}

export async function actualizarCliente(
  cuil: string,
  clienteData: Partial<Cliente>
): Promise<Cliente | null> {
  if (!cuil) return null
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${encodeURIComponent(cuil)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      }
    )
    const data = await res.json()

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return data
  } catch (error) {
    console.error('[actualizarCliente]', error)
    return null
  }
}

export async function eliminarCliente(
  cuil: string
): Promise<{ success: boolean; error?: string }> {
  if (!cuil) return { success: false, error: 'CUIL inválido' }
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${baseUrl}/${encodeURIComponent(cuil)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    revalidatePath('/coordinacion/clientes')
    revalidatePath('/ventas/clientes')

    return { success: true }
  } catch (error: any) {
    console.error('[eliminarCliente]', error)
    return { success: false, error: error?.message ?? 'Error desconocido' }
  }
}

export async function obtenerObrasCliente(cuil: string): Promise<any[]> {
  if (!cuil) return []
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${baseUrl}/${encodeURIComponent(cuil)}/obras`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[obtenerObrasCliente]', error)
    return []
  }
}
