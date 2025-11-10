'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useRouter } from 'next/navigation'
import api from '@/services/api/api'
import { Empleado } from '@/types'

interface AuthContextType {
  usuario: Empleado | null
  cargando: boolean
  login: (cuil: string, contrasenia: string) => Promise<Empleado>
  logout: () => void
}

const BASE_URL = 'http://localhost:4000/api/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Empleado | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`${BASE_URL}/profile`)
        if (data && isMounted) {
          setUsuario(data)
        }
      } catch {
        if (isMounted) {
          setUsuario(null)
        }
      } finally {
        if (isMounted) {
          setCargando(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (
    cuil: string,
    contrasenia: string
  ): Promise<Empleado> => {
    try {
      const { data } = await api.post(`${BASE_URL}/login`, {
        cuil,
        contrasenia,
      })
      if (data.usuario) {
        setUsuario(data.usuario)
        return data.usuario
      }
      throw new Error('La respuesta de la API no contiene datos del usuario.')
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        console.error('Respuesta del servidor:', (error as any).response?.data)
      }
      setUsuario(null)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post(`${BASE_URL}/logout`)
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setUsuario(null)
      router.push('/login')
      router.refresh()
    }
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
