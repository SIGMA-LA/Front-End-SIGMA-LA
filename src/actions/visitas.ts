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
 * Obtiene todas las visitas con filtrado opcional
 */
export async function obtenerVisitas(filtro?: string): Promise<Visita[]> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) return []

  let visitas: Visita[] = await response.json()

  // Filtrado en el servidor
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

    await crearVisita(visitaData)
    revalidatePath('/coordinacion/visitas')
  } catch (error) {
    console.error('Error al crear visita:', error)
    throw error
  }

  redirect('/coordinacion/visitas')
}

export async function actualizarVisitaAction(formData: FormData) {
  try {
    const codVisita = Number(formData.get('cod_visita'))

    const visitaData: any = {
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
    await actualizarVisita(codVisita, visitaData)
    revalidatePath('/coordinacion/visitas')
  } catch (error) {
    console.error('Error al actualizar visita:', error)
    throw error
  }

  redirect('/coordinacion/visitas')
}
