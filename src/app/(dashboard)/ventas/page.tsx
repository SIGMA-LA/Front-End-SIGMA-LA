import { getUsuario } from '@/lib/cache'
import { getVentasDashboardStats } from '@/actions/dashboards'
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  Wallet,
  PackageX,
  Target
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

    const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function VentasPage() {
  const [usuario, stats] = await Promise.all([
    getUsuario(),
    getVentasDashboardStats(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-xl border-2 border-indigo-400 bg-indigo-100 p-6 sm:p-8">
          <div className="border-b border-indigo-300 pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Panel de Ventas y Cobranzas
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Usuario activo:{' '}
              <span className="text-indigo-600 font-medium">
                {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido'}
              </span>
            </p>
          </div>
          <div className="mt-4">
            <p className="leading-relaxed text-gray-700">
              Foco principal: Cerrar tratos activos y gestionar cobranzas pendientes. 
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Indicadores Clave
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total por Cobrar</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalPorCobrar)}</p>
                  <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                     Prioridad Máxima
                  </p>
                </div>
                <div className="rounded-lg bg-red-100 p-3">
                  <Wallet className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Nuevas Obras (Mes)</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.obrasGanadasMes}</p>
                  <p className="mt-2 text-sm text-green-600 font-medium">
                     Nuevos cierres
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <Link
              href="/ventas/obras?estado=EN ESPERA DE STOCK"
              className="group rounded-xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm transition-all hover:border-yellow-400 hover:shadow-md block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Retenidas por Stock</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.obrasFaltaStock}</p>
                  <p className="mt-2 text-sm text-yellow-700">
                     Avisar posibles demoras al cliente
                  </p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-3">
                  <PackageX className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Acciones de Ventas
            </h3>
            <div className="space-y-3">
              <Link
                href="/ventas/clientes/crear"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 group"
              >
                <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-white">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nuevo Cliente</p>
                  <p className="text-sm text-gray-500">
                    Registrar un nuevo cliente o empresa
                  </p>
                </div>
              </Link>
              <Link
                href="/ventas/obras/crear"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300 hover:bg-purple-50 group"
              >
                <div className="rounded-lg bg-purple-100 p-2 group-hover:bg-white">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nueva Obra</p>
                  <p className="text-sm text-gray-500">
                    Crear un nuevo proyecto para un cliente
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5">
               <Wallet className="h-32 w-32 text-red-600" />
             </div>
             
             <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 relative z-10">
               <AlertCircle className="h-5 w-5 text-red-600" />
               Cobranzas y Prioridades
             </h3>
             <div className="relative z-10">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  El foco principal debe estar en reducir el <strong>Total por Cobrar</strong> persiguiendo deudores y asegurando los pagos correspondientes antes de soltar stock (Estado recomendado para seguimiento: <em>EN ESPERA DE PAGO</em>).
                </p>
                <div className="bg-red-50 p-4 rounded-lg flex items-start gap-4">
                  <Wallet className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">Seguimiento de Recaudación</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Recuerda asentar los pagos desde la ficha de la obra lo antes posible para liberar el stock a producción.
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
