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

  const handleLoginAttempt = (email: string, contrasena: string): boolean => {
    console.log(`Intentando login con: ${email}`)
    const loginSuccessful = login(email, contrasena)

    if (loginSuccessful) {
      console.log('Login exitoso a través del contexto!')
    } else {
      console.log('Login fallido a través del contexto.')
    }

    return loginSuccessful
  }

  return <LoginForm onLogin={handleLoginAttempt} />
}
