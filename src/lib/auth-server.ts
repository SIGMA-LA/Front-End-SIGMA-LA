'use server'

import { Empleado } from '@/types'
import { cookies } from 'next/headers'

export async function getUsuarioFromCookies(): Promise<Empleado | null> {
  const cookieStore = await cookies()
  const usuarioCookie = cookieStore.get('usuario')?.value
  if (!usuarioCookie) return null
  try {
    return JSON.parse(usuarioCookie)
  } catch {
    return null
  }
}

export async function getValidAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (accessToken) {
    return accessToken
  }

  // Lógica de Refresh Token (si no hay accessToken)
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    throw new Error('Sesión no encontrada. Por favor, inicie sesión de nuevo.')
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    if (!baseUrl) throw new Error('La URL de la API no está configurada.')

    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('No se pudo renovar la sesión.')
    }

    const data = await response.json()
    const newAccessToken = data.token || data.accessToken

    if (!newAccessToken) {
      throw new Error('La respuesta de refresh no contenía un nuevo token.')
    }

    return newAccessToken
  } catch (error) {
    console.error('Error renovando el token:', error)
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
  }
}
