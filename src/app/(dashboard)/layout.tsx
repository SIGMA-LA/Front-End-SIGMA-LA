import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import { getUsuario } from '@/lib/cache'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const usuario = await getUsuario()

  if (!usuario) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar usuario={usuario} />
      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar user={usuario} />
        </div>
        {/* Main Content con MobileHeader */}
        <div className="flex flex-1 flex-col">
          <MobileHeader user={usuario} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
