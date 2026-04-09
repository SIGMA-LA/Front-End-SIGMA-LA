import { getUsuario } from '@/lib/cache'
import { getClientes } from '@/actions/clientes'
import { filterObras } from '@/actions/obras'
import {
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Package,
  Truck,
} from 'lucide-react'
import Link from 'next/link'

async function getVentasStats() {
  try {
    const [clientesResponse, obrasResponse] = await Promise.all([
      getClientes('', 1, 100),
      filterObras({ pageSize: 100 }),
    ])

    const obras = obrasResponse.data

    const obrasPagadasParcialmente = obras.filter(
      (o) => o.estado === 'PAGADA PARCIALMENTE'
    )
    const obrasEnProduccion = obras.filter((o) => o.estado === 'EN PRODUCCION')
    const obrasEnEsperaPago = obras.filter(
      (o) => o.estado === 'EN ESPERA DE PAGO'
    )
    const obrasEnEsperaStock = obras.filter(
      (o) => o.estado === 'EN ESPERA DE STOCK'
    )
    const obrasProduccionFinalizada = obras.filter(
      (o) => o.estado === 'PRODUCCION FINALIZADA'
    )
    const obrasPagadasTotalmente = obras.filter(
      (o) => o.estado === 'PAGADA TOTALMENTE'
    )
    const obrasEntregadas = obras.filter((o) => o.estado === 'ENTREGADA')
    const obrasCanceladas = obras.filter((o) => o.estado === 'CANCELADA')

    return {
      totalClientes: clientesResponse.total,
      totalObras: obrasResponse.total || obras.length,
      obrasPagadasParcialmente: obrasPagadasParcialmente.length,
      obrasEnProduccion: obrasEnProduccion.length,
      obrasEnEsperaPago: obrasEnEsperaPago.length,
      obrasEnEsperaStock: obrasEnEsperaStock.length,
      obrasProduccionFinalizada: obrasProduccionFinalizada.length,
      obrasPagadasTotalmente: obrasPagadasTotalmente.length,
      obrasEntregadas: obrasEntregadas.length,
      obrasCanceladas: obrasCanceladas.length,
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    return {
      totalClientes: 0,
      totalObras: 0,
      obrasPagadasParcialmente: 0,
      obrasEnProduccion: 0,
      obrasEnEsperaPago: 0,
      obrasEnEsperaStock: 0,
      obrasProduccionFinalizada: 0,
      obrasPagadasTotalmente: 0,
      obrasEntregadas: 0,
      obrasCanceladas: 0,
    }
  }
}

export default async function VentasPage() {
  const [empleadoResponse, stats] = await Promise.all([
    getUsuario(),
    getVentasStats(),
  ])

  const usuario = empleadoResponse

  const statsCards = [
    {
      title: 'Total Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: 'blue',
      href: '/ventas/clientes',
    },
    {
      title: 'Total Obras',
      value: stats.totalObras,
      icon: Building2,
      color: 'purple',
      href: '/ventas/obras',
    },
    {
      title: 'En Producción',
      value: stats.obrasEnProduccion,
      icon: TrendingUp,
      color: 'green',
      href: '/ventas/obras?estado=EN PRODUCCION',
    },
    {
      title: 'Esperando Pago',
      value: stats.obrasEnEsperaPago,
      icon: DollarSign,
      color: 'yellow',
      href: '/ventas/obras?estado=EN ESPERA DE PAGO',
    },
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-50',
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      hover: 'hover:bg-purple-50',
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
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      hover: 'hover:bg-red-50',
    },
  }

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
              Panel de control del área de Ventas
            </p>
          </div>
          <div className="mt-4">
            <p className="leading-relaxed text-gray-700">
              Gestiona clientes, obras y cotizaciones desde esta sección.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Resumen General
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => {
              const colors =
                colorClasses[stat.color as keyof typeof colorClasses]
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
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Link
                href="/ventas/clientes/crear"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Nuevo Cliente</p>
                  <p className="text-sm text-gray-500">
                    Registrar un nuevo cliente o empresa
                  </p>
                </div>
              </Link>
              <Link
                href="/ventas/obras/crear"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <Building2 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Nueva Obra</p>
                  <p className="text-sm text-gray-500">
                    Crear una nueva obra para un cliente
                  </p>
                </div>
              </Link>
              <Link
                href="/ventas/obras"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Ver Todas las Obras
                  </p>
                  <p className="text-sm text-gray-500">
                    Consultar estado y detalles de obras
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Estado de Obras
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Esperando Pago
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {stats.obrasEnEsperaPago}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Pagadas Parcialmente
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {stats.obrasPagadasParcialmente}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Esperando Stock
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {stats.obrasEnEsperaStock}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    En Producción
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {stats.obrasEnProduccion}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Producción Finalizada
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {stats.obrasProduccionFinalizada}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Entregadas
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {stats.obrasEntregadas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
