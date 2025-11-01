'use server'

import { getAccessToken } from './auth'
import { Visita, VisitaFormData } from '@/types'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/visitas'

/**
 * Obtiene una visita por su ID
 */
export async function obtenerVisitaPorId(id: number): Promise<Visita | null> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  return response.ok ? await response.json() : null
}

/**
 * Cancela una visita por ID
 */
export async function cancelarVisita(id: number): Promise<Visita> {
  const token = await getAccessToken()
  const visita = await obtenerVisitaPorId(id)
  if (!visita) throw new Error('Visita no encontrada')

  const updatePayload = {
    estado: 'CANCELADA',
    fecha_cancelacion: new Date().toISOString().split('T')[0],
  }

  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatePayload),
  })

  const result = await response.json()
  return result
}

/**
 * Obtiene todas las visitas
 */
export async function obtenerVisitas(): Promise<Visita[]> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  return await response.json()
}

/**
 * Crea una nueva visita
 */
export async function crearVisita(visitaData: VisitaFormData): Promise<Visita> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitaData),
  })
  return await response.json()
}

/**
 * Actualiza una visita existente
 */
export async function actualizarVisita(
  id: number,
  visitaData: Partial<VisitaFormData>
): Promise<Visita> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitaData),
  })
  return await response.json()
}

export async function crearVisitaAction(formData: FormData) {
  try {
    const visitaData: any = {
      fecha_hora_visita: `${formData.get('fecha')}T${formData.get('hora')}:00`, // ✅ Agregá segundos
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

    await crearVisita(visitaData)
    revalidatePath('/coordinacion/visitas')
  } catch (error) {
    console.error('❌ Error al crear visita:', error)
    throw error
  }

  redirect('/coordinacion/visitas')
}

export async function actualizarVisitaAction(formData: FormData) {
  try {
    const codVisita = Number(formData.get('cod_visita'))

    const visitaData: any = {
      fecha_hora_visita: `${formData.get('fecha')}T${formData.get('hora')}:00`, // ✅ Agregá segundos
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
    await actualizarVisita(codVisita, visitaData)
    revalidatePath('/coordinacion/visitas')
  } catch (error) {
    console.error('❌ Error al actualizar visita:', error)
    throw error
  }

  redirect('/coordinacion/visitas')
}
