import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { getUsuarioFromCookies } from '@/lib/auth-server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const usuario = await getUsuarioFromCookies()
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar usuario={usuario} />
      <div className="flex flex-1">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar user={usuario} />
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
