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
      await login(cuil, contrasenia)
    } catch (error) {
      console.error('Fallo el intento de login:', error)
      throw false
    }
  }

  return <LoginForm onLogin={handleLoginAttempt} />
}
