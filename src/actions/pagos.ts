'use server'
import { Pago, PagoFormData, PagosFilter, ObraConPresupuesto } from '@/types'
import { getAccessToken } from './auth'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Obtener pagos con filtros opcionales
export async function getPagos(filters?: PagosFilter): Promise<Pago[]> {
  try {
    const token = await getAccessToken()

    // Construir query params según la nueva API
    const params = new URLSearchParams()
    if (filters?.cliente) params.append('cliente', filters.cliente)
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
    if (filters?.obra) params.append('obra', filters.obra)
    if (filters?.montoMin !== undefined)
      params.append('montoMin', filters.montoMin.toString())
    if (filters?.montoMax !== undefined)
      params.append('montoMax', filters.montoMax.toString())

    const queryString = params.toString()
    const url = `${baseUrl}/pagos${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al cargar los pagos: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en getPagos:', error)
    throw error
  }
}

// Mantener compatibilidad hacia atrás
export async function getAllPagos(): Promise<Pago[]> {
  return getPagos()
}

export async function getPagosObra(cod_obra: number): Promise<Pago[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/pagos/obra/${cod_obra}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al cargar los pagos: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en getPagosObra:', error)
    throw error
  }
}

export async function deletePago(cod_pago: number): Promise<void> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/pagos/${cod_pago}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al eliminar el pago: ${response.status} - ${errorText}`
      )
    }
  } catch (error) {
    console.error('Error en eliminar Pago:', error)
    throw error
  }
}

export async function createPagoForObra(
  pagoData: { monto: number },
  cod_obra: number
): Promise<Pago> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/pagos/obra/${cod_obra}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagoData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      throw new Error('Error al crear el pago')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en crear Pago:', error)
    throw error
  }
}

export async function createPago(pagoData: {
  cod_obra: number
  monto: number
  fecha_pago: string
}): Promise<Pago> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/pagos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagoData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al crear el pago: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en crear Pago:', error)
    throw error
  }
}

// Obtener obras que tienen presupuesto aceptado para crear pagos
export async function getObrasConPresupuestoAceptado(
  search?: string
): Promise<ObraConPresupuesto[]> {
  try {
    const token = await getAccessToken()

    const params = new URLSearchParams()
    if (search) params.append('search', search)

    const queryString = params.toString()
    const url = `${baseUrl}/obras-con-presupuesto${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      const errorText = await response.text()
      throw new Error(
        `Error al cargar obras: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()

    // Filtrar solo obras que realmente tienen saldo pendiente
    const obrasFiltradas = data.filter((obra: ObraConPresupuesto) => {
      return obra.saldoPendiente > 0
    })

    return obrasFiltradas
  } catch (error) {
    console.error('Error en getObrasConPresupuestoAceptado:', error)
    throw error
  }
}

// Verificar si hay obras con pagos pendientes
export async function hayObrasPendientes(): Promise<boolean> {
  try {
    const token = await getAccessToken()
    const response = await fetch(
      `${baseUrl}/obras/con-presupuesto-aceptado?search=`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }
      throw new Error(`Error al verificar obras pendientes: ${response.status}`)
    }

    const obras: ObraConPresupuesto[] = await response.json()
    // Si hay obras con saldo pendiente > 0, entonces hay pagos pendientes
    return obras.some((obra) => (obra.saldoPendiente || 0) > 0)
  } catch (error) {
    console.error('Error en hayObrasPendientes:', error)
    throw error
  }
}
