import axios from 'axios'

const API_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Interceptor para manejar 401 y refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthRefresh = originalRequest.url.includes('/auth/refresh')
    const isAuthLogin = originalRequest.url.includes('/auth/login')
    const isAuthProfile = originalRequest.url.includes('/auth/profile')
    const isOnLoginPage = window.location.pathname === '/login'

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRefresh &&
      !isAuthLogin &&
      !isAuthProfile
    ) {
      originalRequest._retry = true
      try {
        await api.post('/auth/refresh')
        return api(originalRequest)
      } catch (refreshError) {
        // Solo redirigí si NO estás ya en /login
        if (!isOnLoginPage) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // Si el error viene de /auth/refresh, /auth/login o /auth/profile, solo rechazá sin redirigir
    if (
      error.response &&
      error.response.status === 401 &&
      (isAuthRefresh || isAuthLogin || isAuthProfile)
    ) {
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)
export default api
