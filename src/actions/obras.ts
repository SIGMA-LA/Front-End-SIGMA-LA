// @/actions/obras.ts - VERSIÓN COMPLETA Y CORREGIDA
'use server'

import { Obra } from '@/types'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'

// Construir baseUrl correctamente
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const baseUrl = API_BASE.endsWith('/obras') ? API_BASE : `${API_BASE}/obras`

console.log('[obras.ts] baseUrl configurado:', baseUrl)

// Helper para manejar errores de fetch
async function fetchWithErrorHandling(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000), // 10 segundos
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      if (response.status === 404) {
        throw new Error('Recurso no encontrado.')
      }
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return response
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('La petición tardó demasiado. Verifica tu conexión.')
    }
    if (error.cause?.code === 'ECONNREFUSED') {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica que esté corriendo.'
      )
    }
    throw error
  }
}

// ============================================
// BÚSQUEDA Y FILTRADO
// ============================================

/**
 * Buscar obras por texto (dirección, cliente, etc.)
 * El backend espera: GET /api/obras/buscar?{texto}
 */
export async function obtenerObras(filtro?: string): Promise<Obra[]> {
  try {
    const token = await getAccessToken()

    // IMPORTANTE: El backend espera el texto SIN clave (ej: ?texto en lugar de ?q=texto)
    let url = baseUrl
    if (filtro && filtro.trim().length > 0) {
      url = `${baseUrl}/buscar?${encodeURIComponent(filtro.trim())}`
    }

    console.log('[obtenerObras] URL:', url)

    const response = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('[obtenerObras] Resultados:', data?.length || 0)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[obtenerObras] Error:', error)
    return []
  }
}

/**
 * Filtrar obras por estado o localidad
 * GET /api/obras/filtrar?estado=X&localidad=Y
 */
export async function filtrarObras({
  estado,
  cod_localidad,
}: {
  estado?: string
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', cod_localidad.toString())

    const url = `${baseUrl}/filtrar?${params.toString()}`
    console.log('[filtrarObras] URL:', url)

    const response = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[filtrarObras] Error:', error)
    return []
  }
}

/**
 * Server Action wrapper para filtrarObras
 */
export async function filtrarObrasAction(filters: {
  estado?: string
  cod_localidad?: number
  cod_provincia?: number
}): Promise<Obra[]> {
  'use server'
  try {
    const obras = await filtrarObras({
      estado: filters.estado,
      cod_localidad: filters.cod_localidad,
    })
    return obras
  } catch (err) {
    console.error('[filtrarObrasAction] Error:', err)
    return []
  }
}

// ============================================
// OBTENER OBRA POR ID
// ============================================

/**
 * Obtener una obra específica por ID
 * GET /api/obras/:id
 */
export async function obtenerObra(id: number): Promise<Obra> {
  console.group('[obtenerObra] Inicio')

  // Validación ESTRICTA del ID
  console.log('1. ID recibido:', id, 'Tipo:', typeof id)

  if (id === undefined || id === null) {
    console.error('❌ ID es undefined o null')
    console.groupEnd()
    throw new Error('ID de obra es undefined o null')
  }

  // Convertir a número si viene como string
  const numericId = typeof id === 'string' ? parseInt(id, 10) : Number(id)
  console.log('2. ID numérico:', numericId)

  if (isNaN(numericId) || numericId <= 0) {
    console.error('❌ ID inválido después de conversión:', numericId)
    console.groupEnd()
    throw new Error(`ID de obra inválido: ${id}`)
  }

  try {
    const token = await getAccessToken()
    const url = `${baseUrl}/${numericId}`

    console.log('3. URL completa:', url)
    console.log('4. Token presente:', !!token)

    const response = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('5. ✅ Obra recibida:', data?.cod_obra)
    console.groupEnd()

    return data
  } catch (error) {
    console.error('6. ❌ Error al obtener obra:', error)
    console.groupEnd()
    throw new Error(`No se pudo obtener la obra #${numericId}: ${error}`)
  }
}

// ============================================
// OBRAS COMPLETAS (con fallback)
// ============================================

/**
 * Obtener obras con datos completos
 * Intenta usar /completas, si no existe usa /filtrar
 */
export async function obtenerObrasCompletas({
  estado,
  cod_localidad,
}: {
  estado?: string
  cod_localidad?: number
}): Promise<Obra[]> {
  try {
    const token = await getAccessToken()
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (cod_localidad) params.append('localidad', cod_localidad.toString())

    // Intentar endpoint /completas primero
    try {
      const url = `${baseUrl}/completas?${params.toString()}`
      const response = await fetchWithErrorHandling(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (endpointError) {
      // Si /completas no existe, usar /filtrar como fallback
      console.log(
        '[obtenerObrasCompletas] Endpoint /completas no disponible, usando /filtrar'
      )
      return await filtrarObras({ estado, cod_localidad })
    }
  } catch (error) {
    console.error('[obtenerObrasCompletas] Error:', error)
    // Último fallback
    try {
      return await filtrarObras({ estado, cod_localidad })
    } catch (fallbackError) {
      console.error('[obtenerObrasCompletas] Fallback falló:', fallbackError)
      return []
    }
  }
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Eliminar una obra (cambia estado a CANCELADA)
 * DELETE /api/obras/:id
 */
export async function deleteObra(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    revalidatePath('/ventas/obras')
    return { success: true }
  } catch (error: unknown) {
    console.error('[deleteObra] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

// ============================================
// NOTA DE FÁBRICA
// ============================================

/**
 * Subir nota de fábrica
 * POST /api/obras/:id/nota-fabrica
 */
export async function uploadNotaFabrica(
  codObra: number,
  file: FormData
): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/${codObra}/nota-fabrica`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: file,
      }
    )

    const data = await response.json()
    revalidatePath('/ventas/obras')
    return data
  } catch (error) {
    console.error('[uploadNotaFabrica] Error:', error)
    throw error
  }
}

/**
 * Eliminar nota de fábrica
 * DELETE /api/obras/:id/nota-fabrica
 */
export async function deleteNotaFabrica(codObra: number): Promise<Obra> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/${codObra}/nota-fabrica`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    revalidatePath('/ventas/obras')
    return data
  } catch (error) {
    console.error('[deleteNotaFabrica] Error:', error)
    throw error
  }
}
