import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/shared/MobileHeader'
import { ReactNode } from 'react'
import { getUsuarioFromCookies } from '@/lib/auth-server'

const menuItems = [
  { path: '/ventas', label: 'Dashboard' },
  { path: '/ventas/obras', label: 'Obras' },
  { path: '/ventas/clientes', label: 'Clientes' },
  { path: '/ventas/visitas', label: 'Visitas' },
  { path: '/ventas/entregas', label: 'Entregas' },
  { path: '/ventas/pagos', label: 'Pagos' },
  { path: '/ventas/configuraciones', label: 'Configuraciones' },
]

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
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <MobileHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  )
}
