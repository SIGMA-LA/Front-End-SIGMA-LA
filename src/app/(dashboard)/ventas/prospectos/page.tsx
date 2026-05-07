import { getProspectos } from '@/actions/visitas'
import { getProvincias } from '@/actions/localidad'
import SolicitarMedicionModal from '@/components/ventas/prospectos/SolicitarMedicionModal'
import {
  Plus,
  MapPin,
  Calendar,
  Phone,
  ClipboardCheck,
  ClipboardList,
  UserPlus,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import ReSolicitarBtn from '@/components/ventas/prospectos/ReSolicitarBtn'
import type { SearchParams } from '@/types'

export default async function ProspectosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const page = Number(typeof sp.page === 'string' ? sp.page : sp.page?.[0]) || 1
  const provincias = await getProvincias()

  // We want to see both PROGRAMADA (pending measurement) and COMPLETADA (ready to create Obra)
  // Let's get them by status or all.
  const prospectosRes = await getProspectos('ALL', page, 25)
  const prospectos = prospectosRes.data

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Bandeja de Prospectos
              </h1>
              <p className="text-sm text-gray-600">
                Gestione las solicitudes de medición para potenciales clientes
              </p>
            </div>
          </div>
          <SolicitarMedicionModal provincias={provincias} />
        </div>

        <div className="grid gap-6">
          {prospectos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <ClipboardCheck className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No hay prospectos activos
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Las solicitudes de medición aparecerán aquí.
              </p>
            </div>
          ) : (
            prospectos.map((prospecto) => (
              <div
                key={prospecto.cod_visita}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                          {prospecto.nombre_cliente}{' '}
                          {prospecto.apellido_cliente || ''}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            prospecto.estado === 'COMPLETADA'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : prospecto.estado === 'CANCELADA'
                                ? 'border-rose-200 bg-rose-50 text-rose-700'
                                : prospecto.estado === 'SIN AGENDAR' || !prospecto.fecha_hora_visita || new Date(prospecto.fecha_hora_visita).getFullYear() <= 1970
                                  ? 'border-slate-200 bg-slate-50 text-slate-700'
                                  : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          {prospecto.estado === 'COMPLETADA'
                            ? 'Medición Lista'
                            : prospecto.estado === 'CANCELADA'
                              ? 'Cancelada'
                              : prospecto.estado === 'SIN AGENDAR' || !prospecto.fecha_hora_visita || new Date(prospecto.fecha_hora_visita).getFullYear() <= 1970
                                ? 'Pendiente de Agendar'
                                : 'Pendiente de Medición'}
                        </span>
                      </div>
 
                      <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {prospecto.direccion_visita}
                          {prospecto.localidad &&
                            `, ${prospecto.localidad.nombre_localidad}`}
                        </div>
                        {prospecto.telefono_cliente && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {prospecto.telefono_cliente}
                          </div>
                        )}
                        {prospecto.fecha_hora_visita && new Date(prospecto.fecha_hora_visita).getFullYear() > 1970 && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            Agendado para:{' '}
                            {new Date(
                              prospecto.fecha_hora_visita
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {prospecto.estado === 'COMPLETADA' &&
                        prospecto.observaciones && (
                          <div className="mt-3">
                            <details className="group rounded-lg bg-slate-50 p-3 text-sm text-slate-700 transition-all open:bg-white open:ring-1 open:ring-slate-200">
                              <summary className="cursor-pointer font-semibold text-blue-600 select-none hover:text-blue-700">
                                Ver detalles de medición
                              </summary>
                              <div className="mt-3 border-l-2 border-blue-200 pl-1 whitespace-pre-wrap text-slate-600">
                                {prospecto.observaciones}
                              </div>
                            </details>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0 sm:justify-end">
                  {prospecto.estado === 'COMPLETADA' ? (
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/ventas/clientes/crear?nombre=${encodeURIComponent(prospecto.nombre_cliente || '')}&apellido=${encodeURIComponent(prospecto.apellido_cliente || '')}&telefono=${encodeURIComponent(prospecto.telefono_cliente || '')}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        <UserPlus className="h-4 w-4" />
                        Crear cliente
                      </Link>
                      <Link
                        href={`/ventas/obras/crear?prospecto=${prospecto.cod_visita}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <FileText className="h-4 w-4" />
                        Generar obra
                      </Link>
                    </div>
                  ) : prospecto.estado === 'CANCELADA' ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 italic">Solicitud cancelada por Coordinación</span>
                      <ReSolicitarBtn cod_visita={prospecto.cod_visita} />
                    </div>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500">
                      Esperando a Coordinación...
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
