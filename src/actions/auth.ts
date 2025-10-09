import { cookies } from 'next/headers'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get('accessToken')?.value

  if (accessToken) {
    return accessToken
  }
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    throw new Error(
      'No hay tokens disponibles. Por favor, inicia sesión nuevamente.'
    )
  }

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error('Error al renovar el token de acceso')
    }

    const data = await response.json()
    return data.token || data.accessToken
  } catch (error) {
    console.error('Error renovando token:', error)
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
  }
}
