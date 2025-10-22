'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  Calendar,
  Package,
  Settings,
  Menu,
  X,
  Home,
  Wrench,
  Car,
  PackageOpen,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Empleado } from '@/types'
import { obtenerEmpleadoActual } from '@/actions/empleado'
import Navbar from '@/components/layout/Navbar'

export default function CoordinacionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [usuarioActual, setUsuarioActual] = useState<Empleado | null>(null)

  useEffect(() => {
    async function fetchUsuario() {
      const empleado = await obtenerEmpleadoActual()
      setUsuarioActual(empleado)
    }
    fetchUsuario()
  }, [])

  const menuItems = [
    { path: '/coordinacion', label: 'Dashboard', icon: Home },
    { path: '/coordinacion/obras', label: 'Obras', icon: Building2 },
    { path: '/coordinacion/clientes', label: 'Clientes', icon: Users },
    { path: '/coordinacion/visitas', label: 'Visitas', icon: Calendar },
    {
      path: '/coordinacion/ordenes-produccion',
      label: 'Órdenes de Producción',
      icon: Package,
    },
    { path: '/coordinacion/entregas', label: 'Entregas', icon: PackageOpen },
    { path: '/coordinacion/pedidos', label: 'Pedidos', icon: ClipboardList },
    { path: '/coordinacion/maquinarias', label: 'Maquinarias', icon: Wrench },
    { path: '/coordinacion/vehiculos', label: 'Vehículos', icon: Car },
    {
      path: '/coordinacion/configuraciones',
      label: 'Configuraciones',
      icon: Settings,
    },
  ]
  const isActive = (path: string) => {
    if (path === '/coordinacion') {
      return pathname === '/coordinacion'
    }
    return pathname === path || pathname.startsWith(path + '/')
  }
  const currentLabel =
    menuItems.find((item) => isActive(item.path))?.label || ''

  return (
    <>
      {/* Navbar superior SIEMPRE arriba */}
      <Navbar usuario={usuarioActual} />

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex flex-grow flex-col border-r border-gray-200 bg-white shadow-lg">
              <nav className="flex-1 space-y-2 px-4 py-4">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'border border-blue-200 bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
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
            <div className="flex-1 overflow-y-auto pt-5 pb-4">
              <div className="mb-6 flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-blue-600">SIGMA - LA</h1>
              </div>
              <nav className="space-y-1 px-4">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                        active
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Mobile Header */}
          <header className="border-b border-gray-200 bg-white shadow-sm lg:hidden">
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
          {/* Main Content Area */}
          <main className="min-h-0 flex-1 bg-gray-50">{children}</main>
        </div>
      </div>
    </>
  )
}
