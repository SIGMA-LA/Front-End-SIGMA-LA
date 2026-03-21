'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Users,
  UserStar,
  Calendar,
  Settings,
  Home,
  PackageOpen,
  DollarSign,
  Package,
  ClipboardList,
  Wrench,
  Car,
  BarChart2,
  LucideIcon,
} from 'lucide-react'
import { Empleado } from '@/types'

type MenuItem = { path: string; label: string; icon: LucideIcon }

const menuItemsVentas: MenuItem[] = [
  { path: '/ventas', label: 'Dashboard', icon: Home },
  { path: '/ventas/obras', label: 'Obras', icon: Building2 },
  { path: '/ventas/clientes', label: 'Clientes', icon: Users },
  { path: '/ventas/visitas', label: 'Visitas', icon: Calendar },
  { path: '/ventas/entregas', label: 'Entregas', icon: PackageOpen },
  { path: '/ventas/pagos', label: 'Pagos', icon: DollarSign },
  { path: '/ventas/configuraciones', label: 'Configuraciones', icon: Settings },
]

const menuItemsCoordinacion: MenuItem[] = [
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

const menuItemsAdmin: MenuItem[] = [
  { path: '/admin', label: 'Dashboard', icon: Home },
  { path: '/admin/empleados', label: 'Empleados', icon: Users },
  { path: '/admin/clientes', label: 'Clientes', icon: UserStar },
  { path: '/admin/obras', label: 'Obras', icon: Building2 },
  { path: '/admin/reportes', label: 'Reportes', icon: BarChart2 },
]

export default function Sidebar({ user }: { user: Empleado | null }) {
  const pathname = usePathname()

  const menuItems =
    user?.rol_actual === 'ADMIN'
      ? menuItemsAdmin
      : user?.rol_actual === 'COORDINACION'
        ? menuItemsCoordinacion
        : menuItemsVentas

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/ventas' || path === '/coordinacion') {
      return pathname === path
    }
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
