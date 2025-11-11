import { getUsuario } from '@/lib/cache'
import { getVisitas } from '@/actions/visitas'
import { getEntregas } from '@/actions/entregas'
import { filterObras } from '@/actions/obras'
import {
  Calendar,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

// Skeleton para las estadísticas
function StatsSkeleton() {
  return (
    <>
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Resumen de Hoy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white p-6" />
        <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white p-6" />
      </div>
    </>
  )
}

async function getCoordinacionStats() {
  try {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const [visitas, entregas, obras] = await Promise.all([
      getVisitas(),
      getEntregas(),
      filterObras({}),
    ])

    const visitasHoy = visitas.filter((v) => {
      const fechaVisita = new Date(v.fecha_hora_visita)
      return fechaVisita >= hoy && fechaVisita < manana
    })

    const visitasPendientes = visitas.filter((v) => {
      const fechaVisita = new Date(v.fecha_hora_visita)
      return fechaVisita >= hoy && v.estado === 'PROGRAMADA'
    })

    const visitasCompletadas = visitas.filter((v) => v.estado === 'COMPLETADA')

    const entregasHoy = entregas.filter((e) => {
      const fechaEntrega = new Date(e.fecha_hora_entrega)
      return fechaEntrega >= hoy && fechaEntrega < manana
    })

    const entregasPendientes = entregas.filter((e) => e.estado === 'PENDIENTE')
    const entregasRealizadas = entregas.filter((e) => e.estado === 'ENTREGADO')

    const obrasProduccionFinalizada = obras.filter(
      (o) => o.estado === 'PRODUCCION FINALIZADA'
    )
    const obrasPagadasTotalmente = obras.filter(
      (o) => o.estado === 'PAGADA TOTALMENTE'
    )

    return {
      totalVisitas: visitas.length,
      visitasHoy: visitasHoy.length,
      visitasPendientes: visitasPendientes.length,
      visitasCompletadas: visitasCompletadas.length,
      totalEntregas: entregas.length,
      entregasHoy: entregasHoy.length,
      entregasPendientes: entregasPendientes.length,
      entregasRealizadas: entregasRealizadas.length,
      obrasListasParaEntrega:
        obrasProduccionFinalizada.length + obrasPagadasTotalmente.length,
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    return {
      totalVisitas: 0,
      visitasHoy: 0,
      visitasPendientes: 0,
      visitasCompletadas: 0,
      totalEntregas: 0,
      entregasHoy: 0,
      entregasPendientes: 0,
      entregasRealizadas: 0,
      obrasListasParaEntrega: 0,
    }
  }
}

// Componente separado para las estadísticas (carga async)
async function DashboardStats() {
  const stats = await getCoordinacionStats()

  const statsCards = [
    {
      title: 'Visitas Hoy',
      value: stats.visitasHoy,
      icon: Calendar,
      color: 'blue',
      href: '/coordinacion/visitas',
    },
    {
      title: 'Entregas Hoy',
      value: stats.entregasHoy,
      icon: Truck,
      color: 'green',
      href: '/coordinacion/entregas',
    },
    {
      title: 'Visitas Pendientes',
      value: stats.visitasPendientes,
      icon: Clock,
      color: 'yellow',
      href: '/coordinacion/visitas',
    },
    {
      title: 'Entregas Pendientes',
      value: stats.entregasPendientes,
      icon: Package,
      color: 'orange',
      href: '/coordinacion/entregas',
    },
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-50',
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      hover: 'hover:bg-green-50',
    },
    yellow: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      hover: 'hover:bg-yellow-50',
    },
    orange: {
      bg: 'bg-orange-100',
      icon: 'text-orange-600',
      hover: 'hover:bg-orange-50',
    },
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Resumen de Hoy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => {
            const colors = colorClasses[stat.color as keyof typeof colorClasses]
            const Icon = stat.icon

            return (
              <Link
                key={stat.title}
                href={stat.href}
                className={`group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md ${colors.hover}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-lg ${colors.bg} p-3`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              href="/coordinacion/visitas/crear"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Nueva Visita</p>
                <p className="text-sm text-gray-500">
                  Agendar visita a obra o cliente
                </p>
              </div>
            </Link>
            <Link
              href="/coordinacion/entregas/crear"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Nueva Entrega</p>
                <p className="text-sm text-gray-500">
                  Programar entrega de productos
                </p>
              </div>
            </Link>
            <Link
              href="/coordinacion/obras"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Ver Obras</p>
                <p className="text-sm text-gray-500">
                  Consultar estado y ubicación de obras
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Resumen General
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Total Visitas
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.totalVisitas}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Visitas Completadas
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.visitasCompletadas}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Total Entregas
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.totalEntregas}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Entregas Realizadas
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.entregasRealizadas}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Listas para Entrega
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats.obrasListasParaEntrega}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default async function CoordinacionPage() {
  const usuario = await getUsuario()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-xl border-2 border-blue-400 bg-blue-100 p-6 sm:p-8">
          <div className="border-b border-blue-300 pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Bienvenido,{' '}
              <span className="text-blue-600">
                {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario'}
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Panel de control del área de Coordinación
            </p>
          </div>
          <div className="mt-4">
            <p className="leading-relaxed text-gray-700">
              Gestiona visitas, entregas y coordinación logística de obras.
            </p>
          </div>
        </div>

        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  )
}
