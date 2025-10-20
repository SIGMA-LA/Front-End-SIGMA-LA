import Navbar from '@/components/layout/Navbar'
import { AuthProvider } from '@/context/AuthContext'
import { ReactNode } from 'react'
import { getUsuarioFromCookies } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const usuario = await getUsuarioFromCookies()
  if (!usuario) {
    redirect('/login')
  }

  return (
    <div>
      <Navbar usuario={usuario} />
      <AuthProvider>{children}</AuthProvider>
    </div>
  )
}
