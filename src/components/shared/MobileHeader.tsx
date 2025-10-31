'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'

const labelMap: Record<string, string> = {
  '/ventas': 'Dashboard',
  '/ventas/obras': 'Obras',
  '/ventas/clientes': 'Clientes',
  '/ventas/visitas': 'Visitas',
  '/ventas/entregas': 'Entregas',
  '/ventas/pagos': 'Pagos',
  '/ventas/configuraciones': 'Configuraciones',
}

function getCurrentLabel(pathname: string) {
  // Busca el label exacto o el que empieza igual
  return (
    labelMap[pathname] ||
    Object.entries(labelMap).find(([key]) => pathname.startsWith(key))?.[1] ||
    'Dashboard'
  )
}

export default function MobileHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const currentLabel = getCurrentLabel(pathname)

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
          <Sidebar />
        </div>
      </div>
    </>
  )
}
