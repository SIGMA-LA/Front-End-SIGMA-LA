import { getUsuarioFromCookies } from '@/lib/auth-server'
import Navbar from '@/components/layout/Navbar'
import CoordinacionShell from '@/components/coordinacion/CoordinacionShell'
import { ReactNode } from 'react'

export default async function CoordinacionLayout({
  children,
}: {
  children: ReactNode
}) {
  const usuarioActual = await getUsuarioFromCookies()

  return (
    <>
      <Navbar usuario={usuarioActual} />
      <CoordinacionShell>{children}</CoordinacionShell>
    </>
  )
}
