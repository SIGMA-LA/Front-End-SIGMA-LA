'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './_components/LoginForm'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login, usuario } = useAuth()

  useEffect(() => {
    if (usuario) {
      router.push('/dashboard')
    }
  }, [usuario, router])

  const handleLoginAttempt = async (
    cuil: number,
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
