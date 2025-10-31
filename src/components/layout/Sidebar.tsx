'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Users,
  Calendar,
  Settings,
  Home,
  PackageOpen,
  DollarSign,
} from 'lucide-react'

const menuItems = [
  { path: '/ventas', label: 'Dashboard', icon: Home },
  { path: '/ventas/obras', label: 'Obras', icon: Building2 },
  { path: '/ventas/clientes', label: 'Clientes', icon: Users },
  { path: '/ventas/visitas', label: 'Visitas', icon: Calendar },
  { path: '/ventas/entregas', label: 'Entregas', icon: PackageOpen },
  { path: '/ventas/pagos', label: 'Pagos', icon: DollarSign },
  { path: '/ventas/configuraciones', label: 'Configuraciones', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => {
    if (path === '/ventas') return pathname === '/ventas'
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <nav className="flex flex-1 flex-col space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
