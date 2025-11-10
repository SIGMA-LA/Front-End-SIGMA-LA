'use server'

import { Entrega, EntregaEmpleado } from '@/types'
import { getAccessToken } from './auth'
import { revalidatePath } from 'next/cache'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import { redirect } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const baseUrl = `${API_BASE}/entregas`

/**
 * Obtiene entregas de un empleado por estado
 */
export async function getEntregasByEmpleadoAndEstado(
  cuilEmpleado: string,
  estado: 'ENTREGADO' | 'EN CURSO' | 'CANCELADO' | 'PENDIENTE'
): Promise<EntregaEmpleado[]> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(
    `${baseUrl}/${cuilEmpleado}/${estado}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )
  return response.ok ? await response.json() : []
}

/**
 * Finaliza una entrega
 */
export async function finalizarEntregaAction(
  codEntrega: number,
  observaciones?: string
) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/${codEntrega}/finalizar`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observaciones }),
      }
    )

    const data = await response.json()
    revalidatePath('/visitador')
    revalidatePath('/planta')
    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error al finalizar entrega:', error)
    return {
      success: false,
      data: null,
      error: 'Error al finalizar la entrega',
    }
  }
}

/**
 * Cancela una entrega
 */
export async function cancelarEntregaAction(
  codEntrega: number,
  motivo: string
) {
  try {
    const token = await getAccessToken()
    const response = await fetchWithErrorHandling(
      `${baseUrl}/${codEntrega}/cancelar`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo }),
      }
    )

    revalidatePath('/visitador')
    revalidatePath('/planta')
    return { success: true, error: null }
  } catch (error) {
    console.error('Error al cancelar entrega:', error)
    return { success: false, error: 'Error al cancelar la entrega' }
  }
}

/**
 * Refresca los datos de entregas
 */
export async function refreshEntregasData(cuil: string) {
  try {
    const [entregasPendientes, entregasRealizadas] = await Promise.all([
      getEntregasByEmpleadoAndEstado(cuil, 'PENDIENTE'),
      getEntregasByEmpleadoAndEstado(cuil, 'ENTREGADO'),
    ])

    return {
      entregasPendientes,
      entregasRealizadas,
      error: null,
    }
  } catch (error) {
    console.error('Error al refrescar entregas:', error)
    return {
      entregasPendientes: [],
      entregasRealizadas: [],
      error: 'Error al cargar las entregas',
    }
  }
}

// ... resto de funciones existentes
export async function obtenerEntregas(filtro?: string): Promise<Entrega[]> {
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

  let entregas: Entrega[] = await response.json()

  if (filtro?.trim()) {
    const filtroLower = filtro.trim().toLowerCase()

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
        obraDireccion.includes(filtroLower) ||
        clienteNombre.includes(filtroLower) ||
        clienteApellido.includes(filtroLower) ||
        clienteRazon.includes(filtroLower) ||
        detalle.includes(filtroLower) ||
        observaciones.includes(filtroLower) ||
        codigoEntrega.includes(filtroLower) ||
        empleadosNombres.includes(filtroLower)
      )
    })
  }

  return entregas
}

export async function obtenerEntregaPorId(id: number): Promise<Entrega | null> {
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

export async function crearEntrega(entregaData: {
  cod_obra: number
  fecha_hora_entrega: string
  detalle: string
  observaciones?: string
  dias_viaticos?: number
  empleados_asignados: Array<{
    cuil: string
    rol_entrega: string
  }>
}): Promise<Entrega> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entregaData),
  })
  return await response.json()
}

export async function actualizarEntrega(
  id: number,
  entregaData: {
    fecha_hora_entrega?: string
    detalle?: string
    observaciones?: string
    dias_viaticos?: number
    estado?: 'ENTREGADO' | 'EN CURSO' | 'CANCELADO' | 'PENDIENTE'
  }
): Promise<Entrega> {
  const token = await getAccessToken()
  const response = await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entregaData),
  })
  return await response.json()
}

export async function eliminarEntrega(id: number): Promise<void> {
  const token = await getAccessToken()
  await fetchWithErrorHandling(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function crearEntregaAction(formData: FormData) {
  try {
    const empleadosAsignados = JSON.parse(
      (formData.get('empleados_asignados') as string) || '[]'
    )

    const entregaData = {
      cod_obra: Number(formData.get('cod_obra')),
      fecha_hora_entrega: formData.get('fecha_hora_entrega') as string,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
      empleados_asignados: empleadosAsignados,
    }

    await crearEntrega(entregaData)
    revalidatePath('/coordinacion/entregas')
  } catch (error) {
    console.error('Error al crear entrega:', error)
    throw error
  }

  redirect('/coordinacion/entregas')
}

export async function actualizarEntregaAction(formData: FormData) {
  try {
    const codEntrega = Number(formData.get('cod_entrega'))

    const entregaData: any = {
      fecha_hora_entrega: formData.get('fecha_hora_entrega') as string,
      detalle: formData.get('detalle') as string,
      observaciones: (formData.get('observaciones') as string) || undefined,
      dias_viaticos: formData.get('dias_viaticos')
        ? Number(formData.get('dias_viaticos'))
        : undefined,
    }

    await actualizarEntrega(codEntrega, entregaData)
    revalidatePath('/coordinacion/entregas')
    revalidatePath(`/coordinacion/entregas/${codEntrega}`)
  } catch (error) {
    console.error('Error al actualizar entrega:', error)
    throw error
  }

  redirect('/coordinacion/entregas')
}
