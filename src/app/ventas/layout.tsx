import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import { ReactNode } from 'react'
import { getUsuarioFromCookies } from '@/lib/auth-server'

export default async function VentasLayout({
  children,
}: {
  children: ReactNode
}) {
  const usuario = await getUsuarioFromCookies()

  return (
    <>
      <Navbar usuario={usuario} />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar user={usuario} />
        </div>
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <MobileHeader user={usuario} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  )
}
