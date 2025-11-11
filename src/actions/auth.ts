import { cookies } from 'next/headers'
import { fetchWithErrorHandling } from '@/lib/fetchWithErrorHandling'

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
