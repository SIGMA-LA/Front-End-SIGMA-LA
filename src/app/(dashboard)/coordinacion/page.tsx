import { getUsuario } from '@/lib/cache'
import { getCoordinacionDashboardStats } from '@/actions/dashboards'
import {
  Calendar,
  Truck,
  Building2,
  CheckCircle2,
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
          Progreso de Hoy
        </h2>
        <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-1/4 rounded bg-gray-200 mb-4" />
          <div className="h-4 w-full rounded bg-gray-200" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white p-6" />
        <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white p-6" />
      </div>
    </>
  )
}

async function DashboardStats() {
  const stats = await getCoordinacionDashboardStats()
  const {
    agendaTotalHoy,
    completadosTotalHoy,
    listasParaEntregar,
    agendaHoyVisitas,
    agendaHoyEntregas,
    completadosHoyVisitas,
    completadosHoyEntregas,
  } = stats

  const progressPercentage = agendaTotalHoy > 0 
    ? Math.round((completadosTotalHoy / agendaTotalHoy) * 100) 
    : 100

  const hasActivity = agendaTotalHoy > 0

  return (
    <>
      {/* Progreso del Día */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Progreso de Hoy
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {!hasActivity ? (
             <div className="text-center py-4">
               <span className="text-lg font-bold text-gray-500">No hay actividad agendada para hoy</span>
               <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mt-4">
                 <div className="bg-gray-300 h-4 rounded-full w-full"></div>
               </div>
             </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                   Avance Diario ({completadosTotalHoy} / {agendaTotalHoy} completados)
                </span>
                <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mt-2">
                 <div 
                   className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                   style={{ width: `${progressPercentage}%` }}
                 ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Link
                  href="/coordinacion/visitas?estado=PROGRAMADA"
                  className="flex flex-col rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100 hover:shadow-sm"
                >
                  <span className="text-sm font-medium text-blue-800">Visitas de Hoy</span>
                  {agendaHoyVisitas === 0 ? (
                    <span className="mt-2 text-sm font-medium text-blue-500">
                      No hay visitas para hoy
                    </span>
                  ) : (
                    <span className="mt-1 text-2xl font-bold text-blue-600">
                      {completadosHoyVisitas} <span className="text-sm text-blue-400 font-normal">/ {agendaHoyVisitas}</span>
                    </span>
                  )}
                </Link>
                <Link
                  href="/coordinacion/entregas?estado=PENDIENTE"
                  className="flex flex-col rounded-lg bg-green-50 p-4 transition-colors hover:bg-green-100 hover:shadow-sm"
                >
                  <span className="text-sm font-medium text-green-800">Entregas de Hoy</span>
                  {agendaHoyEntregas === 0 ? (
                    <span className="mt-2 text-sm font-medium text-green-500">
                      No hay entregas para hoy
                    </span>
                  ) : (
                    <span className="mt-1 text-2xl font-bold text-green-600">
                      {completadosHoyEntregas} <span className="text-sm text-green-400 font-normal">/ {agendaHoyEntregas}</span>
                    </span>
                  )}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Acciones Rápidas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
             <Link
               href="/coordinacion/entregas/crear"
               className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-green-300 hover:bg-green-50 group"
             >
               <div className="rounded-lg bg-green-100 p-2 group-hover:bg-white">
                 <Truck className="h-5 w-5 text-green-600" />
               </div>
               <div>
                 <p className="font-medium text-gray-900">Programar Entrega</p>
                 <p className="text-sm text-gray-500">
                   Asignar chofer y vehículo a productos listos
                 </p>
               </div>
             </Link>
             <Link
               href="/coordinacion/visitas/crear"
               className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 group"
             >
               <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-white">
                 <Calendar className="h-5 w-5 text-blue-600" />
               </div>
               <div>
                 <p className="font-medium text-gray-900">Programar Visita</p>
                 <p className="text-sm text-gray-500">
                   Agendar visita a obra o cliente
                 </p>
               </div>
             </Link>
          </div>
        </div>

        {/* Alertas Logísticas */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <AlertCircle className="h-32 w-32 text-red-600" />
          </div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-900">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Alertas Logísticas
          </h3>
          
          <div className="space-y-4 relative z-10">
            <div className="rounded-lg bg-white border border-red-100 p-4 shadow-sm flex items-start gap-4">
               <div className="mt-1 rounded-full bg-red-100 p-2">
                 <Package className="h-5 w-5 text-red-600" />
               </div>
               <div>
                 <p className="text-lg font-bold text-red-600">{listasParaEntregar}</p>
                 <p className="font-medium text-gray-900">Obras Terminadas en Fábrica</p>
                 <p className="text-sm text-gray-500 mt-1">
                   Estas obras terminaron de producirse. Asegúrese de que tengan visita/entrega de cierre planificada prontamente.
                 </p>
                 <Link href="/coordinacion/obras?estado=PRODUCCION FINALIZADA" className="text-sm font-medium text-red-600 hover:underline mt-2 inline-block">
                   Ver obras terminadas &rarr;
                 </Link>
               </div>
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
              Panel de Coordinación Logística
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Usuario activo:{' '}
              <span className="text-blue-600 font-medium">
                {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido'}
              </span>
            </p>
          </div>
          <div className="mt-4">
            <p className="leading-relaxed text-gray-700">
              Gestiona envíos, choferes y libera cuellos de botella de la fábrica mediante programación anticipada.
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
