import { getProspectos } from '@/actions/visitas'
import {
  ClipboardCheck,
  MapPin,
  CalendarPlus,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import type { SearchParams } from '@/types'

export default async function CoordinacionProspectosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const page = Number(typeof sp.page === 'string' ? sp.page : sp.page?.[0]) || 1

  // Get PROGRAMADA (pending measurement assignment) prospectos
  const prospectosRes = await getProspectos('PROGRAMADA', page, 25)
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
                Solicitudes de Medición (Prospectos)
              </h1>
              <p className="text-sm text-gray-600">
                Peticiones de Ventas para tomar medidas a nuevos interesados.
                Asigne fecha, técnico y vehículo.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {prospectos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <ClipboardCheck className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No hay solicitudes pendientes
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Todas las solicitudes de ventas han sido agendadas o no hay
                solicitudes nuevas.
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
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Pendiente de Agendar
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
                            <span className="font-semibold text-slate-600">
                              Tel:
                            </span>{' '}
                            {prospecto.telefono_cliente}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0 sm:justify-end">
                  <Link
                    href={`/coordinacion/visitas/${prospecto.cod_visita}/editar`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Agendar visita
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
