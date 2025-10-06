'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import api from '@/services/api/api'
import { Empleado } from '@/types'

interface AuthContextType {
  usuario: Empleado | null
  cargando: boolean
  login: (cuil: string, contrasenia: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Función para establecer cookies del lado del cliente
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document !== 'undefined') {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
  }
}

// Función para eliminar cookies
function deleteCookie(name: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Empleado | null>(null)
  const [cargando, setCargando] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const verificarSesion = async () => {
      const token = localStorage.getItem('token_sigma')
      const usuarioGuardado = localStorage.getItem('usuario_sigma')

      if (token && usuarioGuardado) {
        try {
          const usuarioParsed = JSON.parse(usuarioGuardado)
          setUsuario(usuarioParsed)

          // NUEVO: También establecer la cookie para Server Actions
          setCookie('accessToken', token, 1) // 1 día de duración

          try {
            await api.get('/auth/profile')
          } catch (error) {
            console.warn(
              'Token podría estar expirado, manteniendo sesión local'
            )
          }
        } catch (error) {
          console.error('Error al verificar el perfil:', error)
          console.error('Error al parsear usuario guardado:', error)
          localStorage.removeItem('token_sigma')
          localStorage.removeItem('usuario_sigma')

          // NUEVO: Limpiar cookies también
          deleteCookie('accessToken')
          deleteCookie('refreshToken')

          setUsuario(null)
        }
      }
      setCargando(false)
    }
    verificarSesion()
  }, [mounted])

  const login = async (cuil: string, contrasenia: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', {
        cuil: cuil,
        contrasenia: contrasenia,
      })

      const { token, empleado, refreshToken } = data

      if (token && empleado) {
        setUsuario(empleado)

        // Guardar en localStorage (para compatibilidad con código existente)
        localStorage.setItem('token_sigma', token)
        localStorage.setItem('usuario_sigma', JSON.stringify(empleado))

        // NUEVO: Guardar también en cookies (para Server Actions)
        setCookie('accessToken', token, 1) // 1 día

        // Si tu backend devuelve refreshToken, guardarlo también
        if (refreshToken) {
          setCookie('refreshToken', refreshToken, 7) // 7 días
        }

        return true
      }
      return false
    } catch (error) {
      console.error('Error en el inicio de sesión:', error)
      throw error
    }
  }

  const logout = () => {
    setUsuario(null)

    // Limpiar localStorage (código existente)
    localStorage.removeItem('token_sigma')
    localStorage.removeItem('usuario_sigma')

    // NUEVO: Limpiar cookies también
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
