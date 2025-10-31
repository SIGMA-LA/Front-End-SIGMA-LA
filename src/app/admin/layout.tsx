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
    <>
      <Sidebar />
      <Navbar usuario={usuario} />
      <main>{children}</main>
    </>
  )
}
