import { cache } from 'react'
import { cookies } from 'next/headers'
import { Empleado, Provincia } from '@/types'
import { getAccessToken } from '@/actions/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

/**
 * React cache: Deduplica requests en el mismo render.
 * Perfecto para datos por usuario que se piden múltiples veces en un render.
 */
export const getUsuario = cache(async (): Promise<Empleado | null> => {
  const cookieStore = await cookies()
  const usuario = cookieStore.get('usuario')?.value
  if (!usuario) return null
  try {
    return JSON.parse(usuario)
  } catch {
    return null
  }
})

/**
 * Cache de provincias con Next.js Data Cache.
 * Se cachea en disco por 1 hora, compartido entre todos los usuarios.
 */
export const getProvincias = cache(async (): Promise<Provincia[]> => {
  try {
    const token = await getAccessToken()
    const res = await fetch(`${API_URL}/provincias`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error obteniendo provincias:', error)
    return []
  }
})

/**
 * Cache del empleado actual con Next.js Data Cache.
 * Se cachea por 5 minutos.
 */
export const getEmpleadoActual = cache(async () => {
  try {
    const token = await getAccessToken()
    const res = await fetch(`${API_URL}/empleados/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    })

    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error obteniendo empleado actual:', error)
    return null
  }
})
