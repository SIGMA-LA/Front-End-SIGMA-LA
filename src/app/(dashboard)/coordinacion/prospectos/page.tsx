import { getProspectos } from '@/actions/visitas'
import { ClipboardCheck, MapPin, CalendarPlus } from 'lucide-react'
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Solicitudes de Medición (Prospectos)</h1>
          <p className="mt-1 text-sm text-slate-500">
            Peticiones de Ventas para tomar medidas a nuevos interesados. Asigne fecha, técnico y vehículo.
          </p>
        </div>

        <div className="grid gap-6">
          {prospectos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <ClipboardCheck className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">No hay solicitudes pendientes</h3>
              <p className="mt-1 text-sm text-slate-500">
                Todas las solicitudes de ventas han sido agendadas o no hay solicitudes nuevas.
              </p>
            </div>
          ) : (
            prospectos.map((prospecto) => (
              <div
                key={prospecto.cod_visita}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                      Pendiente de Agendar
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {prospecto.nombre_cliente} {prospecto.apellido_cliente || ''}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {prospecto.direccion_visita}
                      {prospecto.localidad && `, ${prospecto.localidad.nombre_localidad}`}
                    </div>
                    {prospecto.telefono_cliente && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600">Tel:</span> {prospecto.telefono_cliente}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-3">
                  <Link
                    href={`/coordinacion/visitas/${prospecto.cod_visita}/editar`}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    AGENDAR VISITA
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
