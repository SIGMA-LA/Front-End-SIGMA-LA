'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import api from '@/services/api/api'
//import { mockUsuarios } from '@/data/mockData'
import { Empleado } from '@/types'

interface AuthContextType {
  usuario: Empleado | null
  cargando: boolean
  login: (cuil: string, contrasenia: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Empleado | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem('token_sigma')
      if (token) {
        try {
          const { data } = await api.get('/api/empleados')
          setUsuario(data)
        } catch (error) {
          console.error('La sesión ha expirado o el token no es válido', error)
          localStorage.removeItem('token_sigma')
          localStorage.removeItem('usuario_sigma')
        }
      }
      setCargando(false)
    }

    verificarSesion()
  }, [])

  const login = async (cuil: string, contrasenia: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/api/auth/login', {
        cuil: cuil,
        contrasenia: contrasenia,
      })

      //CAMBIAR, LA RESPUESTA DEL BACKEND DEBE SER SOLO EL TOKEN
      const { token, empleado } = data

      if (token && empleado) {
        setUsuario(empleado)
        localStorage.setItem('usuario_sigma', JSON.stringify(empleado))
        localStorage.setItem('token_sigma', token)
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
    localStorage.removeItem('usuario_sigma')
    localStorage.removeItem('token_sigma')
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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
