'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'
import type { Empleado } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

/**
 * Retrieves the access token from cookies or refreshes it using the refresh token
 * @returns {Promise<string>} The access token
 * @throws {Error} If no tokens are available or if refresh fails
 */
export async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (accessToken) {
    return accessToken
  }

  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    throw new Error('No tokens available. Please log in again.')
  }

  try {
    const response = await fetchWithErrorHandling(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json()
    return data.token || data.accessToken
  } catch (error) {
    console.error('[getAccessToken] Token refresh failed:', error)
    throw new Error('Session expired. Please log in again.')
  }
}

/**
 * Authenticates a user and redirects to their dashboard
 * @param {FormData} formData - Form data containing cuil and contrasenia
 * @returns {Promise<{ error?: string; redirectTo?: string }>} Error message if login fails or redirect URL on success
 */
export async function loginAction(
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  const cuil = formData.get('cuil') as string
  const contrasenia = formData.get('contrasenia') as string

  if (!cuil || !contrasenia) {
    return { error: 'CUIL y contraseña son requeridos' }
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuil, contrasenia }),
    })

    if (!response.ok) {
      return { error: 'CUIL o contraseña incorrectos' }
    }

    const data = await response.json()
    const usuario = data.usuario || data.user
    const accessToken = data.accessToken || data.token
    const refreshToken = data.refreshToken

    if (!usuario?.rol_actual) {
      return { error: 'Usuario sin rol asignado' }
    }

    if (!accessToken) {
      return { error: 'No se recibió token de autenticación' }
    }

    // Setear cookies manualmente en Next.js para que lleguen al navegador
    const cookieStore = await cookies()

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    })

    cookieStore.set('usuario', JSON.stringify(usuario), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    })

    if (refreshToken) {
      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
    }
    const dashboardPath = `/${usuario.rol_actual.toLowerCase()}`
    return { redirectTo: dashboardPath }
  } catch (error) {
    console.error('[loginAction] Error:', error)
    return { error: 'Error al iniciar sesión. Intente nuevamente.' }
  }
}

/**
 * Logs out the current user and redirects to login
 */
export async function logoutAction(): Promise<void> {
  try {
    const token = await getAccessToken()

    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
  } catch (error) {
    console.error('[logoutAction] Error:', error)
  } finally {
    // Clear cookies and redirect to login
    const cookieStore = await cookies()
    cookieStore.delete('accessToken')
    cookieStore.delete('usuario')
    cookieStore.delete('refreshToken')
    redirect('/login')
  }
}
