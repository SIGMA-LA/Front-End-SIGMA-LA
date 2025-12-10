'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import { OrdenProduccion } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/ordenes-produccion')
  ? API_URL
  : `${API_URL}/ordenes-produccion`

/**
 * Retrieves a single orden de produccion by code
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} Operation result with orden data
 */
export async function getOrdenProduccion(cod_op: number) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${BASE_URL}/${cod_op}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 30, tags: [`orden-${cod_op}`] },
    })

    const orden = await response.json()

    return {
      success: true,
      data: orden,
    }
  } catch (error) {
    console.error('[getOrdenProduccion]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Retrieves ordenes de produccion with optional filters
 * @param {string} estado - Optional estado filter (PENDIENTE, APROBADA, EN PRODUCCION, FINALIZADA)
 * @param {number} cod_obra - Optional obra code filter
 * @returns {Promise<{success: boolean, data: any[], error?: string}>} Operation result with ordenes list
 */
export async function getOrdenesProduccion(
  estado?: 'PENDIENTE' | 'APROBADA' | 'EN PRODUCCION' | 'FINALIZADA',
  cod_obra?: number
) {
  try {
    let url = BASE_URL

    // Use specific endpoint for certain estados
    if (estado === 'APROBADA') {
      url = `${BASE_URL}/validadas`
    } else if (estado === 'EN PRODUCCION') {
      url = `${BASE_URL}/en-produccion`
    }

    // Use obra-specific endpoint if cod_obra is provided
    if (cod_obra) {
      url = `${BASE_URL}/obra/${cod_obra}`
    }

    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 30, tags: ['ordenes-produccion'] },
    })

    const ordenes = await response.json()

    // Filter manually if estado is specified and not a specific endpoint
    if (
      estado &&
      estado !== 'APROBADA' &&
      estado !== 'EN PRODUCCION' &&
      !cod_obra
    ) {
      return {
        success: true,
        data: ordenes.filter(
          (orden: OrdenProduccion) => orden.estado === estado
        ),
      }
    }

    return {
      success: true,
      data: ordenes,
    }
  } catch (error) {
    console.error('[getOrdenesProduccion]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: [],
    }
  }
}

/**
 * Retrieves validated ordenes de produccion (estado APROBADA)
 * @returns {Promise<OrdenProduccion[]>} List of validated ordenes
 */
export async function getOrdenesValidadas() {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${BASE_URL}/validadas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 30, tags: ['ordenes-validadas'] },
    })

    return await response.json()
  } catch (error) {
    console.error('[getOrdenesValidadas]', error)
    return []
  }
}

/**
 * Retrieves ordenes de produccion in production (estado EN PRODUCCION)
 * @returns {Promise<OrdenProduccion[]>} List of ordenes in production
 */
export async function getOrdenesEnProduccion() {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${BASE_URL}/en-produccion`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 30, tags: ['ordenes-produccion'] },
    })

    return await response.json()
  } catch (error) {
    console.error('[getOrdenesEnProduccion]', error)
    return []
  }
}

/**
 * Retrieves all ordenes de produccion for a specific obra
 * @param {number} cod_obra - Obra code
 * @returns {Promise<OrdenProduccion[]>} List of ordenes for the obra
 */
export async function getOrdenesByObra(
  cod_obra: number
): Promise<OrdenProduccion[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/obra/${cod_obra}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 30,
          tags: ['ordenes-produccion', `ordenes-obra-${cod_obra}`],
        },
      }
    )

    return await response.json()
  } catch (error) {
    console.error('[getOrdenesByObra]', error)
    return []
  }
}

/**
 * Retrieves finalized ordenes de produccion for a specific obra
 * @param {number} cod_obra - Obra code
 * @returns {Promise<OrdenProduccion[]>} List of finalized ordenes for the obra
 */
export async function getOrdenesByObraAndFinalizada(
  cod_obra: number
): Promise<OrdenProduccion[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/obra/${cod_obra}/finalizada`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 30,
          tags: ['ordenes-produccion', `ordenes-obra-${cod_obra}`],
        },
      }
    )

    return await response.json()
  } catch (error) {
    console.error('[getOrdenesByObraAndFinalizada]', error)
    return []
  }
}

/**
 * Creates a new orden de produccion
 * @param {FormData} formData - Form data with cod_obra and PDF file
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} Operation result
 */
export async function createOrdenProduccion(formData: FormData) {
  try {
    const cod_obra = formData.get('cod_obra') as string
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'Debe seleccionar un archivo',
      }
    }

    if (file.type !== 'application/pdf') {
      return {
        success: false,
        error: 'Solo se permiten archivos PDF',
      }
    }

    // Crear FormData para enviar al backend
    const backendFormData = new FormData()
    backendFormData.append('cod_obra', cod_obra)
    backendFormData.append('file', file)

    const token = await getAccessToken()

    // Send directly to backend (has Multer + Cloudinary configured)
    // DO NOT include Content-Type when sending FormData
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al crear orden de producción')
    }

    const ordenCreada = await response.json()
    revalidatePath('/produccion')
    revalidatePath('/obras')

    return {
      success: true,
      data: ordenCreada,
    }
  } catch (error) {
    console.error('[createOrdenProduccion]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Approves an orden de produccion (changes estado to APROBADA)
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, data?: any, error?: string, message?: string}>} Operation result
 */
export async function approveOrdenProduccion(cod_op: number) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${BASE_URL}/${cod_op}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estado: 'APROBADA',
        fecha_validacion: new Date().toISOString(),
      }),
    })

    const ordenActualizada = await response.json()
    revalidatePath('/dashboard')
    revalidatePath('/coordinacion')

    return {
      success: true,
      data: ordenActualizada,
      message: 'Orden de producción aprobada exitosamente',
    }
  } catch (error) {
    console.error('[approveOrdenProduccion]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Starts production for an orden (changes estado to EN PRODUCCION)
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Operation result
 */
export async function startProduccion(cod_op: number) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/${cod_op}/iniciar`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    await response.json()
    revalidatePath('/produccion')
    revalidatePath('/coordinacion/ordenes-produccion')

    return {
      success: true,
      message: 'Producción iniciada exitosamente',
    }
  } catch (error) {
    console.error('[startProduccion]', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al iniciar producción',
    }
  }
}

/**
 * Finalizes production for an orden (changes estado to FINALIZADA)
 * @param {number} cod_op - Orden de produccion code/ID
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Operation result
 */
export async function finishProduccion(cod_op: number) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${BASE_URL}/${cod_op}/finalizar`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    await response.json()
    revalidatePath('/produccion')
    revalidatePath('/coordinacion/ordenes-produccion')

    return {
      success: true,
      message: 'Producción finalizada exitosamente',
    }
  } catch (error) {
    console.error('[finishProduccion]', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al finalizar producción',
    }
  }
}

// Alias para compatibilidad
export const crearOrdenProduccion = createOrdenProduccion
