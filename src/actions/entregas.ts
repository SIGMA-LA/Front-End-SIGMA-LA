'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Entrega, EntregaEmpleado, EstadoEntrega, RolEntrega } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/entregas`

interface CreateEntregaData {
  cod_obra: number
  fecha_hora_entrega: string
  detalle: string
  observaciones?: string
  dias_viaticos?: number
  fecha_salida_estimada?: string
  fecha_regreso_estimado?: string
  empleados_asignados: Array<{
    cuil: string
    rol_entrega: RolEntrega
  }>
  vehiculos?: string[]
  maquinarias?: string[] | number[]
}

interface UpdateEntregaData {
  fecha_hora_entrega?: string
  detalle?: string
  observaciones?: string
  dias_viaticos?: number
  estado?: EstadoEntrega
  vehiculos?: string[]
  maquinarias?: string[] | number[]
}

/**
 * Retrieves deliveries for an employee filtered by status
 * @param {string} cuilEmpleado - Employee's CUIL identifier
 * @param {EstadoEntrega} estado - Entrega status filter
 * @returns {Promise<EntregaEmpleado[]>} List of employee's deliveries
 */
export async function getEntregasByEmpleado(
  cuilEmpleado: string,
  estado: EstadoEntrega,
  search?: string,
  date?: string
): Promise<EntregaEmpleado[]> {
  try {
    const token = await getAccessToken()
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (date) queryParams.append('date', date)

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : ''

    const res = await fetchWithErrorHandling(
      `${BASE_URL}/${cuilEmpleado}/${estado}${queryStr}`,
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
    const rawEntregas: {
      cod_obra: number
      cod_entrega: number
      entrega_empleado?: { cuil: string; rol_entrega: string; empleado: unknown }[]
      empleados_asignados?: { cuil: string; rol_entrega: string; empleado: unknown }[]
      uso_vehiculo_entrega?: unknown[]
      vehiculos?: unknown[]
      uso_maquinaria?: unknown[]
      maquinarias?: unknown[]
      obra?: unknown
      [key: string]: unknown
    }[] = await res.json()

    return rawEntregas.map((e) => {
      const empleados = e.entrega_empleado || e.empleados_asignados || []
      const ee = empleados.find((emp) => emp.cuil === cuilEmpleado) || {}
      const role = 'rol_entrega' in ee ? (ee.rol_entrega as string) : ''
      const empl = 'empleado' in ee ? ee.empleado : undefined

      return {
        cuil: cuilEmpleado,
        cod_obra: e.cod_obra,
        cod_entrega: e.cod_entrega,
        rol_entrega: role,
        empleado: empl,
        entrega: {
          ...e,
          empleados_asignados: empleados,
          vehiculos: e.uso_vehiculo_entrega || e.vehiculos || [],
          maquinarias: e.uso_maquinaria || e.maquinarias || []
        },
        obra: e.obra || {}
      }
    }) as unknown as EntregaEmpleado[]
  } catch (error) {
    console.error('[getEntregasByEmpleado]', error)
    return []
  }
}

/**
 * Retrieves all deliveries with optional filtering
 * @param {string} filter - Optional search query
 * @param {string} estado - Optional state filter
 * @returns {Promise<Entrega[]>} List of deliveries
 */
export async function getEntregas(filter?: string, estado?: string): Promise<Entrega[]> {
  try {
    const token = await getAccessToken()
    
    let url = BASE_URL
    const params = new URLSearchParams()
    if (filter) params.append('q', filter)
    if (estado) params.append('estado', estado)

    if (params.toString()) {
      url = `${BASE_URL}?${params.toString()}`
    }

    const res = await fetchWithErrorHandling(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['entregas'] },
    })

    const rawEntregas: Record<string, unknown>[] = await res.json()
    let entregas: Entrega[] = rawEntregas.map((e) => ({
      ...e,
      empleados_asignados: e.entrega_empleado || e.empleados_asignados || [],
      vehiculos: e.uso_vehiculo_entrega || e.vehiculos || [],
      maquinarias: e.uso_maquinaria || e.maquinarias || []
    })) as unknown as Entrega[]

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

    let data: Record<string, unknown> | null = await res.json()
    if (data) {
      data = {
        ...data,
        empleados_asignados: data.entrega_empleado || data.empleados_asignados || [],
        vehiculos: data.uso_vehiculo_entrega || data.vehiculos || [],
        maquinarias: data.uso_maquinaria || data.maquinarias || []
      }
    }
    return data as unknown as Entrega | null
  } catch (error) {
    console.error('[getEntrega]', error)
    return null
  }
}

/**
 * Finalizes a Entrega
 * @param {number} codEntrega - Entrega ID
 * @param {string} observaciones - Optional final observations
 * @returns {Promise<{success: boolean, data?: unknown, error?: string | null}>} Operation result
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
  const payload = {
    ...entregaData,
    empleados: entregaData.empleados_asignados,
    estado: 'PENDIENTE',
    maquinarias: entregaData.maquinarias?.map(m => Number(m)),
  }

  const res = await fetchWithErrorHandling(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  let data: Record<string, unknown> | null = await res.json()
  if (data) {
    data = {
      ...data,
      empleados_asignados: data.entrega_empleado || data.empleados_asignados || [],
      vehiculos: data.uso_vehiculo_entrega || data.vehiculos || [],
      maquinarias: data.uso_maquinaria || data.maquinarias || []
    }
  }
  return data as unknown as Entrega
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
  const payload = {
    ...entregaData,
    maquinarias: entregaData.maquinarias?.map(m => Number(m)),
  }

  const res = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  let data: Record<string, unknown> | null = await res.json()
  if (data) {
    data = {
      ...data,
      empleados_asignados: data.entrega_empleado || data.empleados_asignados || [],
      vehiculos: data.uso_vehiculo_entrega || data.vehiculos || [],
      maquinarias: data.uso_maquinaria || data.maquinarias || []
    }
  }
  return data as unknown as Entrega
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
    const vehiculosData = formData.get('vehiculos')
    const vehiculos = vehiculosData ? JSON.parse(vehiculosData as string) : undefined
    const maquinariasData = formData.get('maquinarias')
    const maquinarias = maquinariasData ? JSON.parse(maquinariasData as string) : undefined

    const entregaData: CreateEntregaData = {
      cod_obra: Number(formData.get('cod_obra')),
      fecha_hora_entrega: formData.get('fecha_hora_entrega') as string,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
      fecha_salida_estimada: formData.get('fecha_salida_estimada') as string || undefined,
      fecha_regreso_estimado: formData.get('fecha_regreso_estimado') as string || undefined,
      empleados_asignados: empleadosAsignados,
      vehiculos,
      maquinarias,
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
    const vehiculosData = formData.get('vehiculos')
    const vehiculos = vehiculosData ? JSON.parse(vehiculosData as string) : undefined
    const maquinariasData = formData.get('maquinarias')
    const maquinarias = maquinariasData ? JSON.parse(maquinariasData as string) : undefined

    const entregaData: UpdateEntregaData = {
      fecha_hora_entrega: formData.get('fecha_hora_entrega') as string,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
      vehiculos,
      maquinarias,
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
