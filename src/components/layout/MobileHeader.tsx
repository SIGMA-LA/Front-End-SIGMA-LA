'use client'

import { useState, useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import { Empleado } from '@/types'
import { useNavigation } from '@/context/NavigationContext'

// Copiá los arrays de menú igual que en Sidebar
const menuItemsVentas = [
  { path: '/ventas', label: 'Dashboard' },
  { path: '/ventas/obras', label: 'Obras' },
  { path: '/ventas/clientes', label: 'Clientes' },
  { path: '/ventas/visitas', label: 'Visitas' },
  { path: '/ventas/entregas', label: 'Entregas' },
  { path: '/ventas/pagos', label: 'Pagos' },
  { path: '/ventas/configuraciones', label: 'Configuraciones' },
]
const menuItemsCoordinacion = [
  { path: '/coordinacion', label: 'Dashboard' },
  { path: '/coordinacion/obras', label: 'Obras' },
  { path: '/coordinacion/clientes', label: 'Clientes' },
  { path: '/coordinacion/visitas', label: 'Visitas' },
  { path: '/coordinacion/ordenes-produccion', label: 'Órdenes de Producción' },
  { path: '/coordinacion/entregas', label: 'Entregas' },
  { path: '/coordinacion/pedidos', label: 'Pedidos' },
  { path: '/coordinacion/maquinarias', label: 'Maquinarias' },
  { path: '/coordinacion/vehiculos', label: 'Vehículos' },
  { path: '/coordinacion/configuraciones', label: 'Configuraciones' },
]
const menuItemsAdmin = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/empleados', label: 'Empleados' },
  { path: '/admin/reportes', label: 'Reportes' },
  { path: '/admin/obras', label: 'Obras' },
]

export default function MobileHeader({ user }: { user: Empleado | null }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { optimisticPath } = useNavigation()

  // Elegí el menú según el rol
  const menuItems =
    user?.rol_actual === 'ADMIN'
      ? menuItemsAdmin
      : user?.rol_actual === 'COORDINACION'
        ? menuItemsCoordinacion
        : menuItemsVentas

  // Lógica para el label actual
  const getCurrentLabel = () => {
    // Usar optimisticPath si existe
    const currentPath = optimisticPath || pathname
    if (!currentPath) return 'Dashboard'

    const found = menuItems.find(
      (item) =>
        item.path === currentPath ||
        (item.path !== '/admin' &&
          item.path !== '/ventas' &&
          item.path !== '/coordinacion' &&
          currentPath.startsWith(item.path + '/'))
    )
    return found?.label || 'Dashboard'
  }

  const currentLabel = getCurrentLabel()

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {currentLabel}
          </h1>
          <div className="w-6"></div>
        </div>
      </header>
      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
      >
        <div
          className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex h-full w-64 max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <Sidebar user={user} />
        </div>
      </div>
    </>
  )
}
