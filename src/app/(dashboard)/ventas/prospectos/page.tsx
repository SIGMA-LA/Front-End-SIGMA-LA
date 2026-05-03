import { getProspectos } from '@/actions/visitas'
import { getLocalidadesByProvincia, getProvincias } from '@/actions/localidad'
import SolicitarMedicionModal from '@/components/ventas/prospectos/SolicitarMedicionModal'
import { Plus, CheckCircle2, MapPin, Calendar, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
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
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bandeja de Prospectos</h1>
            <p className="mt-1 text-sm text-slate-500">
              Gestione las solicitudes de medición para potenciales clientes
            </p>
          </div>
          <SolicitarMedicionModal provincias={provincias} />
        </div>

        <div className="grid gap-6">
          {prospectos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <ClipboardCheck className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">No hay prospectos activos</h3>
              <p className="mt-1 text-sm text-slate-500">
                Las solicitudes de medición aparecerán aquí.
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
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      prospecto.estado === 'COMPLETADA' 
                        ? 'bg-green-100 text-green-800'
                        : prospecto.estado === 'PROGRAMADA' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {prospecto.estado === 'COMPLETADA' ? 'Medición Lista' : 'Pendiente de Medición'}
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
                    {prospecto.fecha_hora_visita && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Agendado para: {new Date(prospecto.fecha_hora_visita).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {prospecto.estado === 'COMPLETADA' && prospecto.observaciones && (
                    <details className="group rounded-lg bg-slate-50 p-3 text-sm text-slate-700 open:bg-white open:ring-1 open:ring-slate-200 transition-all">
                      <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700 select-none">Ver Detalles de Medición</summary>
                      <div className="mt-3 whitespace-pre-wrap text-slate-600 pl-1 border-l-2 border-blue-200">
                        {prospecto.observaciones}
                      </div>
                    </details>
                  )}
                </div>

                <div className="flex shrink-0 gap-3">
                  {prospecto.estado === 'COMPLETADA' ? (
                    <div className="flex gap-2">
                      <Link
                        href={`/ventas/clientes/crear?nombre=${encodeURIComponent((prospecto.nombre_cliente || '') + ' ' + (prospecto.apellido_cliente || ''))}&telefono=${encodeURIComponent(prospecto.telefono_cliente || '')}`}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                        CREAR CLIENTE
                      </Link>
                      <Link
                        href={`/ventas/obras/crear?prospecto=${prospecto.cod_visita}`}
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4" />
                        GENERAR OBRA
                      </Link>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">
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
