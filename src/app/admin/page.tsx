import { getUsuarioFromCookies } from '@/lib/auth-server'
import DashboardView from '@/components/admin/DashboardView'
import EmpleadosView from '@/components/admin/EmpleadosView'
import ReportesView from '@/components/admin/ReportesView'
import ObrasView from '@/components/admin/ObrasView'
import Navbar from '@/components/layout/Navbar'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'empleados', label: 'Empleados' },
  { id: 'reportes', label: 'Reportes' },
  { id: 'obras', label: 'Obras' },
]

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>
}) {
  const usuario = await getUsuarioFromCookies()
  const params = await searchParams
  const currentSection = params?.section || 'dashboard'

  const renderContent = () => {
    switch (currentSection) {
      case 'empleados':
        return <EmpleadosView />
      case 'reportes':
        return <ReportesView />
      case 'obras':
        return <ObrasView />
      case 'dashboard':
      default:
        return <DashboardView />
    }
  }

  return (
    <>
      <Navbar usuario={usuario} />
      <div className="flex min-h-[calc(100vh-68px)]">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`?section=${item.id}`}
                className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  currentSection === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{renderContent()}</div>
          </main>
        </div>
      </div>
    </>
  )
}
