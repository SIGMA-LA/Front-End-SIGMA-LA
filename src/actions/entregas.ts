'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type {
  Entrega,
  EntregaEmpleado,
  EstadoEntrega,
  RolEntrega,
  PaginatedResponse,
} from '@/types'
import type { Empleado } from '@/types/auth'
import type { Obra } from '@/types/obra'
import type { UsoMaquinaria } from '@/types/maquinaria'
import type { UsoVehiculoEntrega } from '@/types/vehiculo'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = `${API_URL}/entregas`

interface EntregaEmpleadoApi {
  cuil: string
  rol_entrega?: RolEntrega
  empleado?: Empleado
}

interface EntregaApiPayload {
  cod_entrega: number
  cod_obra: number
  obra?: Obra
  entrega_empleado?: EntregaEmpleadoApi[]
  uso_vehiculo_entrega?: UsoVehiculoEntrega[]
  vehiculos?: UsoVehiculoEntrega[]
  uso_maquinaria?: UsoMaquinaria[]
  maquinarias?: UsoMaquinaria[]
}

interface CreateEntregaData {
  cod_obra: number
  fecha_hora_entrega: string
  detalle: string
  observaciones?: string
  dias_viaticos?: number
  fecha_salida_estimada?: string
  fecha_regreso_estimado?: string
  entrega_empleado: Array<{
    cuil: string
    rol_entrega: RolEntrega
  }>
  vehiculos?: string[]
  maquinarias?: string[] | number[]
  esFinal?: boolean
  cod_ops?: number[]
}

interface UpdateEntregaData {
  fecha_hora_entrega?: string
  detalle?: string
  observaciones?: string
  dias_viaticos?: number
  estado?: EstadoEntrega
  vehiculos?: string[]
  maquinarias?: string[] | number[]
  empleados?: Array<{ cuil: string; rol_entrega: RolEntrega }>
  fecha_salida_estimada?: string
  fecha_regreso_estimado?: string
  cod_ops?: number[]
}

/**
 * Retrieves deliveries for an employee filtered by status with pagination
 * @param {string} cuilEmpleado - Employee's CUIL identifier
 * @param {EstadoEntrega} estado - Entrega status filter
 * @param {string} search - Optional search query
 * @param {string} date - Optional date filter
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise<PaginatedResponse<EntregaEmpleado>>} Paginated list of employee's deliveries
 */
export async function getEntregasByEmpleado(
  cuilEmpleado: string,
  estado: EstadoEntrega,
  search?: string,
  date?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<EntregaEmpleado>> {
  const emptyResponse: PaginatedResponse<EntregaEmpleado> = {
    data: [],
    total: 0,
    totalPages: 0,
    page,
    pageSize,
  }

  try {
    const token = await getAccessToken()
    const url = new URL(`${BASE_URL}/${cuilEmpleado}/${estado}`)
    if (search) url.searchParams.append('search', search)
    if (date) url.searchParams.append('date', date)
    url.searchParams.append('page', String(page))
    url.searchParams.append('pageSize', String(pageSize))

    const res = await fetchWithErrorHandling<PaginatedResponse<EntregaApiPayload>>(
      url.toString(),
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
    const apiResponse = await res.json()

    console.log(apiResponse)
    if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
      const mappedData = apiResponse.data.map((e: EntregaApiPayload) => {
        const ee = (e.entrega_empleado || []).find(
          (emp: EntregaEmpleadoApi) => emp.cuil === cuilEmpleado
        )
        const entregaEmpleado = (e.entrega_empleado ||
          []) as unknown as EntregaEmpleado[]

        return {
          cuil: cuilEmpleado,
          cod_obra: e.cod_obra,
          cod_entrega: e.cod_entrega,
          rol_entrega: ee?.rol_entrega || 'ACOMPANANTE',
          empleado: ee?.empleado as EntregaEmpleado['empleado'],
          entrega: {
            ...(e as unknown as Entrega),
            entrega_empleado: entregaEmpleado,
            vehiculos: e.uso_vehiculo_entrega || e.vehiculos || [],
            maquinarias: e.uso_maquinaria || e.maquinarias || [],
          },
          obra: (e.obra || {}) as EntregaEmpleado['obra'],
        }
      }) as unknown as EntregaEmpleado[]

      return {
        ...apiResponse,
        data: mappedData,
      }
    }

    return emptyResponse
  } catch (error) {
    console.error('[getEntregasByEmpleado]', error)
    return emptyResponse
  }
}

/**
 * Retrieves all deliveries with optional filtering
 * @param {string} filter - Optional search query
 * @param {string} estado - Optional state filter
 * @returns {Promise<Entrega[]>} List of deliveries
 */
export async function getEntregas(
  filter?: string,
  estado?: string,
  page: number = 1,
  pageSize: number = 25
): Promise<PaginatedResponse<Entrega>> {
  const emptyResponse: PaginatedResponse<Entrega> = {
    data: [], total: 0, totalPages: 0, page, pageSize,
  }
  try {
    const token = await getAccessToken()

    const params = new URLSearchParams()
    if (filter?.trim()) params.append('q', filter.trim())
    if (estado && estado !== 'ALL') params.append('estado', estado)
    params.append('page', String(page))
    params.append('pageSize', String(pageSize))

    const url = `${BASE_URL}?${params.toString()}`

    const res = await fetchWithErrorHandling<PaginatedResponse<Entrega>>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['entregas'] },
    })

    const data = await res.json()

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data as PaginatedResponse<Entrega>
    }

    return emptyResponse
  } catch (error) {
    console.error('[getEntregas]', error)
    return emptyResponse
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
    const res = await fetchWithErrorHandling<Entrega>(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: [`entrega-${id}`] },
    })

    const data = await res.json()
    if (data) {
      Object.assign(data, {
        entrega_empleado: data.entrega_empleado || [],
        vehiculos: data.uso_vehiculo_entrega || data.vehiculos || [],
        maquinarias: data.uso_maquinaria || data.maquinarias || [],
      })
    }
    return data
  } catch (error) {
    console.error('[getEntrega]', error)
    return null
  }
}

export async function finalizarEntrega(
  codEntrega: number,
  observaciones?: string
): Promise<ActionResponse<Entrega>> {
  try {
    const token = await getAccessToken()
    const res = await fetchWithErrorHandling<Entrega>(
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

    revalidateTag(`entrega-${codEntrega}`)
    revalidatePath('/visitador')
    revalidatePath('/planta')
    revalidatePath('/coordinacion/entregas')

    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo finalizar la entrega. Intentá nuevamente.'
    console.error('[finalizarEntrega]', message)
    return {
      success: false,
      error: message,
    }
  }
}

export async function cancelarEntrega(
  codEntrega: number,
  motivo: string
): Promise<ActionResponse<Entrega>> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling<Entrega>(
      `${BASE_URL}/${codEntrega}/cancelar`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo }),
      }
    )

    revalidateTag(`entrega-${codEntrega}`)
    revalidatePath('/visitador')
    revalidatePath('/planta')
    revalidatePath('/coordinacion/entregas')
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo cancelar la entrega. Intentá nuevamente.'
    console.error('[cancelarEntrega]', message)
    return {
      success: false,
      error: message,
    }
  }
}

export async function createEntrega(
  entregaData: CreateEntregaData
): Promise<ActionResponse<Entrega>> {
  try {
    const token = await getAccessToken()
    const payload = {
      ...entregaData,
      empleados: entregaData.entrega_empleado,
      estado: 'PENDIENTE',
      maquinarias: entregaData.maquinarias?.map((m) => Number(m)),
    }

    const res = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (data) {
      Object.assign(data, {
        entrega_empleado: data.entrega_empleado || [],
        vehiculos: data.uso_vehiculo_entrega || data.vehiculos || [],
        maquinarias: data.uso_maquinaria || data.maquinarias || [],
      })
    }

    revalidatePath('/coordinacion/entregas')
    revalidatePath('/planta/entregas')
    return { success: true, data: data as unknown as Entrega }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo crear la entrega. Intentá nuevamente.'
    console.error('[createEntrega]', message)
    return {
      success: false,
      error: message,
    }
  }
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
): Promise<ActionResponse<Entrega>> {
  try {
    const token = await getAccessToken()
    const payload = {
      ...entregaData,
      maquinarias: entregaData.maquinarias?.map((m) => Number(m)),
      cod_ops: entregaData.cod_ops,
    }

    const res = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (data) {
      Object.assign(data, {
        entrega_empleado: data.entrega_empleado || [],
        vehiculos: data.uso_vehiculo_entrega || data.vehiculos || [],
        maquinarias: data.uso_maquinaria || data.maquinarias || [],
      })
    }

    revalidateTag(`entrega-${id}`)
    revalidatePath('/coordinacion/entregas')
    revalidatePath(`/coordinacion/entregas/${id}/editar`)

    return { success: true, data: data as unknown as Entrega }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo actualizar la entrega. Intentá nuevamente.'
    console.error('[updateEntrega]', message)
    return {
      success: false,
      error: message,
    }
  }
}

/**
 * Deletes a Entrega
 * @param {number} id - Entrega ID
 * @returns {Promise<void>}
 */
export async function deleteEntrega(id: number): Promise<ActionResponse> {
  try {
    const token = await getAccessToken()
    await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    revalidateTag(`entrega-${id}`)
    revalidatePath('/coordinacion/entregas')
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo eliminar la entrega. Intentá nuevamente.'
    console.error('[deleteEntrega]', message)
    return {
      success: false,
      error: message,
    }
  }
}

/**
 * Creates a Entrega from form data and redirects
 * @param {FormData} formData - Form submission data
 */
export async function createEntregaFromForm(formData: FormData) {
  try {
    const entregaEmpleado = JSON.parse(
      (formData.get('entrega_empleado') as string) || '[]'
    )
    const vehiculosData = formData.get('vehiculos')
    const vehiculos = vehiculosData
      ? JSON.parse(vehiculosData as string)
      : undefined
    const maquinariasData = formData.get('maquinarias')
    const maquinarias = maquinariasData
      ? JSON.parse(maquinariasData as string)
      : undefined

    const entregaData: CreateEntregaData = {
      cod_obra: Number(formData.get('cod_obra')),
      fecha_hora_entrega: `${formData.get('fecha_hora_entrega')}Z`,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
      fecha_salida_estimada: formData.get('fecha_salida_estimada')
        ? `${formData.get('fecha_salida_estimada')}Z`
        : undefined,
      fecha_regreso_estimado: formData.get('fecha_regreso_estimado')
        ? `${formData.get('fecha_regreso_estimado')}Z`
        : undefined,
      entrega_empleado: entregaEmpleado,
      vehiculos,
      maquinarias,
    }

    const res = await createEntrega(entregaData)
    if (!res.success) throw new Error(res.error)
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
  const codEntrega = Number(formData.get('cod_entrega'))
  try {
    const vehiculosData = formData.get('vehiculos')
    const vehiculos = vehiculosData
      ? JSON.parse(vehiculosData as string)
      : undefined
    const maquinariasData = formData.get('maquinarias')
    const maquinarias = maquinariasData
      ? JSON.parse(maquinariasData as string)
      : undefined

    const entregaData: UpdateEntregaData = {
      fecha_hora_entrega: `${formData.get('fecha_hora_entrega')}Z`,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
      vehiculos,
      maquinarias,
    }

    const res = await updateEntrega(codEntrega, entregaData)
    if (!res.success) throw new Error(res.error)
    revalidatePath('/coordinacion/entregas')
    revalidatePath(`/coordinacion/entregas/${codEntrega}`)
  } catch (error) {
    console.error('[updateEntregaFromForm]', error)
    throw error
  }

  redirect('/coordinacion/entregas')
}
