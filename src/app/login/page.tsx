'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/login/LoginForm'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login, usuario } = useAuth()
  const rol = usuario?.rol_actual || null

  useEffect(() => {
    if (usuario) {
      router.push(`/${rol?.toLowerCase()}`)
    }
  }, [usuario, router])

  const handleLoginAttempt = async (
    cuil: string,
    contrasenia: string
  ): Promise<void> => {
    try {
      const loggedInUser = await login(cuil, contrasenia)

      if (loggedInUser && loggedInUser.rol_actual) {
        router.push(`/${loggedInUser.rol_actual.toLowerCase()}`)
      }
    } catch (error) {
      console.error('Fallo el intento de login:', error)
      throw error
    }
  }

  return <LoginForm onLogin={handleLoginAttempt} />
}
