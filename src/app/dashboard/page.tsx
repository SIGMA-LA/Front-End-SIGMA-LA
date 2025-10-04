'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'

const AdminDashboardClient = dynamic(
  () => import('@/app/dashboard/_components/admin/AdminDashboardClient')
)
const CoordDashboardClient = dynamic(
  () => import('@/app/dashboard/_components/coordinacion/CoordDashboardClient')
)
const PlantaDashboardClient = dynamic(
  () => import('@/app/dashboard/_components/planta/PlantaDashboardClient')
)
const VisitadorDashboardClient = dynamic(
  () => import('@/app/dashboard/_components/visitador/VisitadorDashboard')
)

const VentasDashboardClient = dynamic(
  () => import('@/app/dashboard/_components/ventas/VentasDashboard')
)

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
  </div>
)

export default function DashboardPage() {
  const router = useRouter()
  const { usuario, cargando } = useAuth()

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push('/login')
    }
  }, [usuario, cargando, router])

  if (cargando) {
    return <LoadingSpinner />
  }

  if (!usuario) {
    return null
  }

  switch (usuario.rol_actual) {
    case 'ADMIN':
      return <AdminDashboardClient />
    case 'COORDINACION':
      return <CoordDashboardClient />
    case 'PLANTA':
      return <PlantaDashboardClient />
    case 'VISITADOR':
      return <VisitadorDashboardClient />
    case 'VENTAS':
      return <VentasDashboardClient />
    default:
      console.error('Rol de usuario desconocido:', usuario.rol_actual)
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Rol no reconocido
            </h2>
            <p className="text-gray-600">Rol actual: {usuario.rol_actual}</p>
            <p className="mt-2 text-sm text-gray-500">
              Revisa la consola para más detalles
            </p>
          </div>
        </div>
      )
  }
}
