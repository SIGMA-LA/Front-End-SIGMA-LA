'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Entrega, EntregaEmpleado } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/entregas`

interface CreateEntregaData {
  cod_obra: number
  fecha_hora_entrega: string
  detalle: string
  observaciones?: string
  dias_viaticos?: number
  empleados_asignados: Array<{
    cuil: string
    rol_entrega: string
  }>
}

interface UpdateEntregaData {
  fecha_hora_entrega?: string
  detalle?: string
  observaciones?: string
  dias_viaticos?: number
  estado?: 'ENTREGADO' | 'EN CURSO' | 'CANCELADO' | 'PENDIENTE'
}

/**
 * Retrieves deliveries for an employee filtered by status
 * @param {string} cuilEmpleado - Employee's CUIL identifier
 * @param {string} estado - Entrega status filter
 * @returns {Promise<EntregaEmpleado[]>} List of employee's deliveries
 */
export async function getEntregasByEmpleado(
  cuilEmpleado: string,
  estado: 'ENTREGADO' | 'EN CURSO' | 'CANCELADO' | 'PENDIENTE'
): Promise<EntregaEmpleado[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${cuilEmpleado}/${estado}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 30,
          tags: ['entregas', `entregas-empleado-${cuilEmpleado}`],
        },
      }
    )
    return await res.json()
  } catch (error) {
    console.error('[getEntregasByEmpleado]', error)
    return []
  }
}

/**
 * Retrieves all deliveries with optional filtering
 * @param {string} filter - Optional search query
 * @returns {Promise<Entrega[]>} List of deliveries
 */
export async function getEntregas(filter?: string): Promise<Entrega[]> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['entregas'] },
    })

    let entregas: Entrega[] = await res.json()

    // Client-side filtering if needed
    if (filter?.trim()) {
      const filterLower = filter.trim().toLowerCase()

      entregas = entregas.filter((entrega) => {
        const obraDireccion = entrega.obra?.direccion?.toLowerCase() || ''
        const clienteNombre = entrega.obra?.cliente?.nombre?.toLowerCase() || ''
        const clienteApellido =
          entrega.obra?.cliente?.apellido?.toLowerCase() || ''
        const clienteRazon =
          entrega.obra?.cliente?.razon_social?.toLowerCase() || ''
        const detalle = entrega.detalle?.toLowerCase() || ''
        const observaciones = entrega.observaciones?.toLowerCase() || ''
        const codigoEntrega = String(entrega.cod_entrega || '')

        const empleadosNombres =
          entrega.empleados_asignados
            ?.map((ea) =>
              `${ea.empleado?.nombre} ${ea.empleado?.apellido}`.toLowerCase()
            )
            .join(' ') || ''

        return (
          obraDireccion.includes(filterLower) ||
          clienteNombre.includes(filterLower) ||
          clienteApellido.includes(filterLower) ||
          clienteRazon.includes(filterLower) ||
          detalle.includes(filterLower) ||
          observaciones.includes(filterLower) ||
          codigoEntrega.includes(filterLower) ||
          empleadosNombres.includes(filterLower)
        )
      })
    }

    return entregas
  } catch (error) {
    console.error('[getEntregas]', error)
    return []
  }
}

/**
 * Retrieves a single Entrega by ID
 * @param {number} id - Entrega ID
 * @returns {Promise<Entrega | null>} Entrega data or null if not found
 */
export async function getEntrega(id: number): Promise<Entrega | null> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: [`entrega-${id}`] },
    })
    return await res.json()
  } catch (error) {
    console.error('[getEntrega]', error)
    return null
  }
}

/**
 * Finalizes a Entrega
 * @param {number} codEntrega - Entrega ID
 * @param {string} observaciones - Optional final observations
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} Operation result
 */
export async function finalizarEntrega(
  codEntrega: number,
  observaciones?: string
) {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${codEntrega}/finalizar`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observaciones }),
      }
    )

    const data = await res.json()

    revalidatePath('/visitador')
    revalidatePath('/planta')
    revalidatePath('/coordinacion/entregas')

    return { success: true, data, error: null }
  } catch (error) {
    console.error('[finalizarEntrega]', error)
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : 'Error finalizing Entrega',
    }
  }
}

/**
 * Cancels a Entrega
 * @param {number} codEntrega - Entrega ID
 * @param {string} motivo - Cancellation reason
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 */
export async function cancelarEntrega(
  codEntrega: number,
  motivo: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${codEntrega}/cancelar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motivo }),
    })

    revalidatePath('/visitador')
    revalidatePath('/planta')
    revalidatePath('/coordinacion/entregas')

    return { success: true }
  } catch (error) {
    console.error('[cancelarEntrega]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error canceling Entrega',
    }
  }
}

/**
 * Creates a new Entrega
 * @param {CreateEntregaData} entregaData - Entrega data
 * @returns {Promise<Entrega>} Created Entrega
 */
export async function createEntrega(
  entregaData: CreateEntregaData
): Promise<Entrega> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entregaData),
  })
  return await res.json()
}

/**
 * Updates an existing Entrega
 * @param {number} id - Entrega ID
 * @param {UpdateEntregaData} entregaData - Fields to update
 * @returns {Promise<Entrega>} Updated Entrega
 */
export async function updateEntrega(
  id: number,
  entregaData: UpdateEntregaData
): Promise<Entrega> {
  const token = await getAccessToken()
  const res = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entregaData),
  })
  return await res.json()
}

/**
 * Deletes a Entrega
 * @param {number} id - Entrega ID
 * @returns {Promise<void>}
 */
export async function deleteEntrega(id: number): Promise<void> {
  const token = await getAccessToken()
  await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Creates a Entrega from form data and redirects
 * @param {FormData} formData - Form submission data
 */
export async function createEntregaFromForm(formData: FormData) {
  try {
    const empleadosAsignados = JSON.parse(
      (formData.get('empleados_asignados') as string) || '[]'
    )

    const entregaData: CreateEntregaData = {
      cod_obra: Number(formData.get('cod_obra')),
      fecha_hora_entrega: formData.get('fecha_hora_entrega') as string,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
      empleados_asignados: empleadosAsignados,
    }

    await createEntrega(entregaData)
    revalidatePath('/coordinacion/entregas')
  } catch (error) {
    console.error('[createEntregaFromForm]', error)
    throw error
  }

  redirect('/coordinacion/entregas')
}

/**
 * Updates a Entrega from form data and redirects
 * @param {FormData} formData - Form submission data
 */
export async function updateEntregaFromForm(formData: FormData) {
  try {
    const codEntrega = Number(formData.get('cod_entrega'))

    const entregaData: UpdateEntregaData = {
      fecha_hora_entrega: formData.get('fecha_hora_entrega') as string,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
    }

    await updateEntrega(codEntrega, entregaData)
    revalidatePath('/coordinacion/entregas')
    revalidatePath(`/coordinacion/entregas/${codEntrega}`)
  } catch (error) {
    console.error('[updateEntregaFromForm]', error)
    throw error
  }

  redirect('/coordinacion/entregas')
}
