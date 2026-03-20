'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { getAccessToken } from './auth'
import type { Visita, VisitaFormData } from '@/types'

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
    const response = await fetchWithErrorHandling(`${BASE_URL}/${id}`, {
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
 * Retrieves visitas with optional text filter
 * @param {string} filtro - Optional search query
 * @returns {Promise<Visita[]>} List of visitas matching filter
 */
export async function getVisitas(filtro?: string): Promise<Visita[]> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30, tags: ['visitas'] },
    })

    let visitas: Visita[] = await response.json()

    // Client-side filtering if filter is provided
    if (filtro?.trim()) {
      const filtroLower = filtro.trim().toLowerCase()

      visitas = visitas.filter((visita) => {
        const nombreCliente = visita.nombre_cliente?.toLowerCase() || ''
        const apellidoCliente = visita.apellido_cliente?.toLowerCase() || ''
        const direccion = visita.direccion_visita?.toLowerCase() || ''
        const obraDireccion = visita.obra?.direccion?.toLowerCase() || ''
        const clienteObra = visita.obra?.cliente
        const clienteObraNombre = clienteObra?.nombre?.toLowerCase() || ''
        const clienteObraApellido = clienteObra?.apellido?.toLowerCase() || ''
        const clienteObraRazon = clienteObra?.razon_social?.toLowerCase() || ''
        const motivo = visita.motivo_visita?.toLowerCase() || ''
        const observaciones = visita.observaciones?.toLowerCase() || ''
        const codigoVisita = String(visita.cod_visita || '')

        const empleadosNombres =
          visita.empleado_visita
            ?.map((ev) =>
              `${ev.empleado?.nombre} ${ev.empleado?.apellido}`.toLowerCase()
            )
            .join(' ') || ''

        return (
          nombreCliente.includes(filtroLower) ||
          apellidoCliente.includes(filtroLower) ||
          direccion.includes(filtroLower) ||
          obraDireccion.includes(filtroLower) ||
          clienteObraNombre.includes(filtroLower) ||
          clienteObraApellido.includes(filtroLower) ||
          clienteObraRazon.includes(filtroLower) ||
          motivo.includes(filtroLower) ||
          observaciones.includes(filtroLower) ||
          codigoVisita.includes(filtroLower) ||
          empleadosNombres.includes(filtroLower)
        )
      })
    }

    return visitas
  } catch (error) {
    console.error('[getVisitas]', error)
    return []
  }
}

/**
 * Retrieves visitas for a specific empleado filtered by estado
 * @param {string} cuil - Empleado CUIL
 * @param {string[]} estados - List of estados to filter (PENDIENTE, FINALIZADA, CANCELADA)
 * @returns {Promise<Visita[]>} List of visitas for empleado
 */
export async function getVisitasByEmpleado(
  cuil: string,
  estados?: string[]
): Promise<Visita[]> {
  try {
    const token = await getAccessToken()
    const queryParams = new URLSearchParams()
    estados?.forEach((estado) => queryParams.append('estado', estado))

    const response = await fetchWithErrorHandling(
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

    return await response.json()
  } catch (error) {
    console.error('[getVisitasByEmpleado]', error)
    return []
  }
}

/**
 * Creates a new visita
 * @param {VisitaFormData} visitaData - Visita data
 * @returns {Promise<Visita>} Created visita
 */
export async function createVisita(
  visitaData: VisitaFormData
): Promise<Visita> {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitaData),
    })
    const result = await response.json()
    revalidatePath('/coordinacion/visitas')
    return result
  } catch (error) {
    console.error('[createVisita]', error)
    throw error
  }
}

/**
 * Updates a visita by ID
 * @param {number} id - Visita ID
 * @param {Partial<VisitaFormData>} visitaData - Partial visita data to update
 * @returns {Promise<Visita>} Updated visita
 */
export async function updateVisita(
  id: number,
  visitaData: Partial<VisitaFormData>
): Promise<Visita> {
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
    const result = await response.json()
    revalidatePath('/coordinacion/visitas')
    return result
  } catch (error) {
    console.error('[updateVisita]', error)
    throw error
  }
}

/**
 * Finalizes a visita (changes estado to FINALIZADA)
 * @param {number} codVisita - Visita ID
 * @param {string} observaciones - Optional observations
 * @returns {Promise<{success: boolean, data: unknown, error: string | null}>} Operation result
 */
export async function finalizarVisita(
  codVisita: number,
  observaciones?: string
) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
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
    return { success: true, data, error: null }
  } catch (error) {
    console.error('[finalizarVisita]', error)
    return { success: false, data: null, error: 'Error al finalizar la visita' }
  }
}

/**
 * Cancels a visita (changes estado to CANCELADA)
 * @param {number} codVisita - Visita ID
 * @param {string} motivo - Cancellation reason
 * @returns {Promise<{success: boolean, data: unknown, error: string | null}>} Operation result
 */
export async function cancelarVisita(codVisita: number, motivo: string) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
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
    return { success: true, data, error: null }
  } catch (error) {
    console.error('[cancelarVisita]', error)
    return { success: false, data: null, error: 'Error al cancelar la visita' }
  }
}

/**
 * Creates a visita from form data and redirects
 * @param {FormData} formData - Form data from client
 */
export async function createVisitaFromForm(formData: FormData) {
  try {
    const visitaData: VisitaFormData = {
      fecha_hora_visita: `${formData.get('fecha')}T${formData.get('hora')}:00`,
      motivo_visita: formData.get('tipo') as string,
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

    await createVisita(visitaData)
    revalidatePath('/coordinacion/visitas')
  } catch (error) {
    console.error('[createVisitaFromForm]', error)
    throw error
  }

  redirect('/coordinacion/visitas')
}

/**
 * Updates a visita from form data and redirects
 * @param {FormData} formData - Form data from client
 */
export async function updateVisitaFromForm(formData: FormData) {
  try {
    const codVisita = Number(formData.get('cod_visita'))

    const visitaData: Partial<VisitaFormData> = {
      fecha_hora_visita: `${formData.get('fecha')}T${formData.get('hora')}:00`,
      motivo_visita: formData.get('tipo') as string,
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
    await updateVisita(codVisita, visitaData)
    revalidatePath('/coordinacion/visitas')
  } catch (error) {
    console.error('[updateVisitaFromForm]', error)
    throw error
  }

  redirect('/coordinacion/visitas')
}
