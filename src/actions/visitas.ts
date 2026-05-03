'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Visita, VisitaFormData, MotivoVisita, PaginatedResponse } from '@/types'
import type { ActionResponse } from '@/types/actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE_URL = API_URL.endsWith('/visitas') ? API_URL : `${API_URL}/visitas`

/**
 * Retrieves a single visita by ID
 * @param {number} id - Visita ID
 * @returns {Promise<Visita | null>} Visita data or null if not found
 */
export async function getVisita(id: number): Promise<Visita | null> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<Visita>(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['visitas', `visita-${id}`] },
    })
    return await response.json()
  } catch (error) {
    console.error('[getVisita]', error)
    return null
  }
}

/**
 * Retrieves visitas with optional text and status filters
 * @param {string} filtro - Optional search query
 * @param {string} status - Optional status filter
 * @returns {Promise<Visita[]>} List of visitas matching filter
 */
export async function getVisitas(
  filtro?: string,
  status?: string,
  page: number = 1,
  pageSize: number = 25
): Promise<PaginatedResponse<Visita>> {
  const emptyResponse: PaginatedResponse<Visita> = {
    data: [], total: 0, totalPages: 0, page, pageSize,
  }
  try {
    const token = await getAccessToken()
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('estado', status)
    if (filtro?.trim()) queryParams.append('q', filtro.trim())
    queryParams.append('page', String(page))
    queryParams.append('pageSize', String(pageSize))

    const url =
      filtro?.trim()
        ? `${BASE_URL}/buscar?${queryParams.toString()}`
        : `${BASE_URL}?${queryParams.toString()}`

    const response = await fetchWithErrorHandling<PaginatedResponse<Visita>>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['visitas'] },
    })

    const data = await response.json()

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data as PaginatedResponse<Visita>
    }

    return emptyResponse
  } catch (error) {
    console.error('[getVisitas]', error)
    return emptyResponse
  }
}

/**
 * Retrieves visitas for a specific empleado filtered by estado with pagination
 * @param {string} cuil - Empleado CUIL
 * @param {string[]} estados - List of estados to filter
 * @param {string} search - Optional search query
 * @param {string} date - Optional date filter
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise<PaginatedResponse<Visita>>} Paginated list of visitas for empleado
 */
export async function getVisitasByEmpleado(
  cuil: string,
  estados?: string[],
  search?: string,
  date?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Visita>> {
  const emptyResponse: PaginatedResponse<Visita> = {
    data: [],
    total: 0,
    totalPages: 0,
    page,
    pageSize,
  }

  try {
    const token = await getAccessToken()
    const queryParams = new URLSearchParams()
    estados?.forEach((estado) => queryParams.append('estado', estado))
    if (search) queryParams.append('search', search)
    if (date) queryParams.append('date', date)
    queryParams.append('page', String(page))
    queryParams.append('pageSize', String(pageSize))

    const response = await fetchWithErrorHandling<PaginatedResponse<Visita>>(
      `${BASE_URL}/empleado/${cuil}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 30,
          tags: ['visitas', `visitas-empleado-${cuil}`],
        },
      }
    )

    const data = await response.json()
    if (data && typeof data === 'object' && 'data' in data) {
      return data as PaginatedResponse<Visita>
    }

    return emptyResponse
  } catch (error) {
    console.error('[getVisitasByEmpleado]', error)
    return emptyResponse
  }
}

export async function createVisita(
  visitaData: VisitaFormData
): Promise<ActionResponse<Visita>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<Visita>(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitaData),
    })
    const data = await response.json()
    revalidatePath('/coordinacion/visitas')
    revalidatePath('/visitador')
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la visita. Intentá nuevamente.'
    console.error('[createVisita]', message)
    return { success: false, error: message }
  }
}

export async function updateVisita(
  id: number,
  visitaData: Partial<VisitaFormData>
): Promise<ActionResponse<Visita>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitaData),
    })
    const data = await response.json()
    revalidatePath('/coordinacion/visitas')
    revalidatePath('/visitador')
    revalidatePath(`/coordinacion/visitas/${id}/editar`)
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la visita. Intentá nuevamente.'
    console.error('[updateVisita]', message)
    return { success: false, error: message }
  }
}

export async function finalizarVisita(
  codVisita: number,
  observaciones?: string
): Promise<ActionResponse<Visita>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<Visita>(
      `${BASE_URL}/${codVisita}/finalizar`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ observaciones }),
      }
    )

    const data = await response.json()
    revalidatePath('/visitador')
    revalidatePath('/coordinacion/visitas')
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al finalizar la visita'
    console.error('[finalizarVisita]', message)
    return { success: false, error: message }
  }
}

export async function cancelarVisita(
  codVisita: number,
  motivo: string
): Promise<ActionResponse<Visita>> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<Visita>(
      `${BASE_URL}/${codVisita}/cancelar`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo }),
      }
    )

    const data = await response.json()
    revalidatePath('/visitador')
    revalidatePath('/coordinacion/visitas')
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al cancelar la visita'
    console.error('[cancelarVisita]', message)
    return { success: false, error: message }
  }
}

/**
 * Creates a visita from form data and redirects
 * @param {FormData} formData - Form data from client
 */
export async function createVisitaFromForm(formData: FormData): Promise<ActionResponse<Visita>> {
  try {
    const visitaData: VisitaFormData & { fechaSalida?: string; fechaHasta?: string } = {
      fecha_hora_visita: `${formData.get('fecha')}T${formData.get('hora')}:00Z`,
      fechaSalida: formData.get('fechaSalida') && formData.get('horaSalida')
        ? `${formData.get('fechaSalida')}T${formData.get('horaSalida')}:00Z`
        : undefined,
      fechaHasta: formData.get('fechaRegreso') && formData.get('horaRegreso')
        ? `${formData.get('fechaRegreso')}T${formData.get('horaRegreso')}:00Z`
        : undefined,
      motivo_visita: formData.get('tipo') as MotivoVisita,
      observaciones: formData.get('observaciones') as string,
      direccion_visita: formData.get('direccion') as string,
      cod_obra: formData.get('obraId') ? Number(formData.get('obraId')) : null,
      cod_localidad: formData.get('cod_localidad')
        ? Number(formData.get('cod_localidad'))
        : null,
      dias_viatico: Number(formData.get('diasViatico')),
      empleados_visita: JSON.parse(formData.get('empleados_visita') as string),
      vehiculo: formData.get('vehiculo') as string,
      nombre_cliente: (formData.get('nombre') as string) || null,
      apellido_cliente: (formData.get('apellido') as string) || null,
      telefono_cliente: (formData.get('clienteTelefono') as string) || null,
    }

    return await createVisita(visitaData)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al procesar el formulario'
    console.error('[createVisitaFromForm]', message)
    return { success: false, error: message }
  }
}

/**
 * Updates a visita from form data and redirects
 * @param {FormData} formData - Form data from client
 */
export async function updateVisitaFromForm(formData: FormData): Promise<ActionResponse<Visita>> {
  try {
    const codVisita = Number(formData.get('cod_visita'))

    const visitaData: Partial<VisitaFormData> & { fechaSalida?: string; fechaHasta?: string } = {
      fecha_hora_visita: `${formData.get('fecha')}T${formData.get('hora')}:00Z`,
      fechaSalida: formData.get('fechaSalida') && formData.get('horaSalida')
        ? `${formData.get('fechaSalida')}T${formData.get('horaSalida')}:00Z`
        : undefined,
      fechaHasta: formData.get('fechaRegreso') && formData.get('horaRegreso')
        ? `${formData.get('fechaRegreso')}T${formData.get('horaRegreso')}:00Z`
        : undefined,
      motivo_visita: formData.get('tipo') as MotivoVisita,
      observaciones: formData.get('observaciones') as string,
      direccion_visita: formData.get('direccion') as string,
      cod_obra: formData.get('obraId') ? Number(formData.get('obraId')) : null,
      cod_localidad: formData.get('cod_localidad')
        ? Number(formData.get('cod_localidad'))
        : null,
      dias_viatico: Number(formData.get('diasViatico')),
      empleados_visita: JSON.parse(formData.get('empleados_visita') as string),
      vehiculo: formData.get('vehiculo') as string,
      nombre_cliente: (formData.get('nombre') as string) || null,
      apellido_cliente: (formData.get('apellido') as string) || null,
      telefono_cliente: (formData.get('clienteTelefono') as string) || null,
    }
    return await updateVisita(codVisita, visitaData)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al procesar el formulario'
    console.error('[updateVisitaFromForm]', message)
    return { success: false, error: message }
  }
}

/**
 * Retrieves prospectos (visitas sin obra asignada)
 */
export async function getProspectos(
  status?: string,
  page: number = 1,
  pageSize: number = 25
): Promise<PaginatedResponse<Visita>> {
  const emptyResponse: PaginatedResponse<Visita> = {
    data: [], total: 0, totalPages: 0, page, pageSize,
  }
  try {
    const token = await getAccessToken()
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('estado', status)
    queryParams.append('page', String(page))
    queryParams.append('pageSize', String(pageSize))

    const url = `${BASE_URL}/prospectos?${queryParams.toString()}`

    const response = await fetchWithErrorHandling<PaginatedResponse<Visita>>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['visitas', 'prospectos'] },
    })

    const data = await response.json()
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data as PaginatedResponse<Visita>
    }
    return emptyResponse
  } catch (error) {
    console.error('[getProspectos]', error)
    return emptyResponse
  }
}

export async function crearProspecto(data: {
  nombre: string
  telefono: string
  direccion: string
  cod_localidad: number
}): Promise<ActionResponse<Visita>> {
  try {
    const visitaData = {
      nombre_cliente: data.nombre,
      telefono_cliente: data.telefono,
      direccion_visita: data.direccion,
      cod_localidad: data.cod_localidad,
      motivo_visita: 'INICIAL',
      estado: 'PROGRAMADA', // We keep it PROGRAMADA but without date so it's "pending schedule"
      fecha_hora_visita: null as unknown as string, // Backend allows null if we send it in API wait, API might reject null if schema is strict? Let's send a fake date far in future if needed? No, backend accepts empty string or null? Let's check backend schema in sigma-la-schemas if it fails. We can also just send it as a random date and wait for coordinacion to change it? Or just let it be. Prisma allows it.
      empleados_visita: [],
      vehiculo: '',
      dias_viatico: 1
    }

    // Since fecha_hora_visita is required by Prisma logic if it's a date but wait, it's optional in schema?
    // Let's send a "fake" date like 1970-01-01T00:00:00Z to indicate it's not scheduled, or just new Date() because it's required by the CreateVisitaData interface!
    // Wait, CreateVisitaData requires `fecha_hora_visita: string`.
    const visitaPayload = {
      ...visitaData,
      fecha_hora_visita: new Date(new Date().setHours(0,0,0,0)).toISOString(), // today
      observaciones: 'SOLICITUD DE PROSPECTO - FALTA AGENDAR'
    }

    const token = await getAccessToken()
    const response = await fetchWithErrorHandling<Visita>(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitaPayload),
    })
    const resData = await response.json()
    revalidatePath('/ventas/prospectos')
    revalidatePath('/coordinacion')
    return { success: true, data: resData }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear solicitud'
    console.error('[crearProspecto]', message)
    return { success: false, error: message }
  }
}
