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

const BASE_URL = 'http://localhost:4000/api/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Empleado | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`${BASE_URL}/profile`)
        if (data) setUsuario(data)
      } catch {
        setUsuario(null)
      } finally {
        setCargando(false)
      }
    }
    fetchProfile()
  }, [])

  const login = async (cuil: string, contrasenia: string): Promise<boolean> => {
    try {
      const { data } = await api.post(`${BASE_URL}/login`, {
        cuil,
        contrasenia,
      })
      if (data.empleado) {
        setUsuario(data.empleado)
        return true
      }
      return false
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    setUsuario(null)
    await api.post(`${BASE_URL}/logout`)
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
