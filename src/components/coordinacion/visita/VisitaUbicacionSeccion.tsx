'use client'

import { MapPin, Building2, CheckCircle2 } from 'lucide-react'
import type { Obra, Provincia, Localidad, Visita } from '@/types'
import ObraSearchSelect from '@/components/shared/ObraSearchSelect'
import type { VisitaFormFields } from '@/hooks/useVisitaForm'

interface VisitaUbicacionSeccionProps {
  isFromObra: boolean
  preloadedObra?: Obra | null
  visitaEditar?: Visita | null
  isVisitaInicial: boolean
  setIsVisitaInicial: (v: boolean) => void
  formData: VisitaFormFields
  setFormData: React.Dispatch<React.SetStateAction<VisitaFormFields>>
  provincias: Provincia[]
  selectedProvincia: number | undefined
  localidades: Localidad[]
  loadingLocalidades: boolean
  handleLoadLocalidades: (cod: number) => Promise<void>
  buscarObras: (query: string) => Promise<Obra[] | { data: Obra[] }>
}

/**
 * Modular section for location and work details in the visit creation form.
 * Handles the "Initial Visit" toggle and associated prospect/location fields.
 */
export default function VisitaUbicacionSeccion({
  isFromObra,
  visitaEditar,
  isVisitaInicial,
  setIsVisitaInicial,
  formData,
  setFormData,
  provincias,
  selectedProvincia,
  localidades,
  loadingLocalidades,
  handleLoadLocalidades,
  buscarObras,
}: VisitaUbicacionSeccionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl px-5 py-4">
        <div className="rounded-lg bg-pink-100/80 p-2 shadow-inner">
          <MapPin className="h-5 w-5 text-pink-600" />
        </div>
        <h3 className="font-semibold text-slate-800">Ubicación y Detalle de Obra</h3>
      </div>

      <div className="p-5">
        {/* Visita inicial toggle */}
        <div className="mb-4">
          <button
            type="button"
            disabled={!!visitaEditar || isFromObra}
            onClick={() => {
              const newValue = !isVisitaInicial
              setIsVisitaInicial(newValue)
              if (!newValue) {
                setFormData((prev) => ({ ...prev, obraId: undefined, direccion: '', localidad: '' }))
              }
            }}
            className={`flex flex-col sm:flex-row w-full sm:items-center justify-between rounded-xl border-2 p-4 transition-all gap-4 ${
              isVisitaInicial
                ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-100 shadow-sm'
                : 'border-slate-200 bg-white hover:border-pink-300 hover:bg-pink-50/50 shadow-sm'
            } ${visitaEditar || isFromObra ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                  isVisitaInicial ? 'bg-pink-500 shadow-inner' : 'bg-slate-100'
                }`}
              >
                <Building2 className={`h-6 w-6 ${isVisitaInicial ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <div className="text-left">
                <p className={`font-semibold ${isVisitaInicial ? 'text-pink-900' : 'text-slate-700'}`}>
                  Visita Inicial (Prospección)
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Crear un registro independiente sin enlazar a una obra existente
                </p>
              </div>
            </div>
            {isVisitaInicial && <CheckCircle2 className="h-6 w-6 text-pink-500 hidden sm:block" />}
          </button>
        </div>

        {/* Prospecto data (visita inicial only) */}
        {isVisitaInicial && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">Datos del Prospecto</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: 'Nombre *', field: 'nombre_cliente', placeholder: 'Ej. Juan', required: true },
                { label: 'Apellido', field: 'apellido_cliente', placeholder: 'Ej. Pérez', required: false },
                { label: 'Teléfono de Contacto', field: 'telefono_cliente', placeholder: 'Ej. +54 9 11 1234-5678', required: false },
              ].map(({ label, field, placeholder, required }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    {label}
                  </label>
                  <input
                    type="text"
                    required={required}
                    value={(formData[field as keyof typeof formData] as string) ?? ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ubicacion a visitar (visita inicial only) */}
        {isVisitaInicial && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">Ubicación a Visitar</h4>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Dirección Específica *
              </label>
              <input
                type="text"
                required
                value={formData.direccion}
                onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Ej. Av. Siempreviva 742"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Provincia *
                </label>
                <select
                  value={selectedProvincia ?? ''}
                  onChange={async (e) => {
                    const cod = Number(e.target.value)
                    setFormData((prev) => ({ ...prev, cod_localidad: undefined, localidad: '' }))
                    if (cod) await handleLoadLocalidades(cod)
                  }}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">Seleccionar provincia...</option>
                  {provincias.map((p) => (
                    <option key={p.cod_provincia} value={p.cod_provincia}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Localidad *
                </label>
                <select
                  value={formData.cod_localidad ?? ''}
                  onChange={(e) => {
                    const cod = Number(e.target.value)
                    const loc = localidades.find((l) => l.cod_localidad === cod)
                    setFormData((prev) => ({ ...prev, cod_localidad: cod, localidad: loc?.nombre_localidad ?? '' }))
                  }}
                  required
                  disabled={!selectedProvincia || loadingLocalidades}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">{loadingLocalidades ? 'Cargando...' : 'Seleccionar localidad...'}</option>
                  {localidades.map((l) => (
                    <option key={l.cod_localidad} value={l.cod_localidad}>
                      {l.nombre_localidad}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Obra selector (non-initial visit) */}
        {!isVisitaInicial && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Obra programada *
            </label>
            {formData.direccion ? (
              <div className="flex items-center justify-between rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 shadow-inner">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="font-bold text-indigo-900 block">{formData.direccion}</span>
                    <span className="text-xs text-indigo-600 font-medium">Obra Seleccionada</span>
                  </div>
                </div>
                {!visitaEditar && !isFromObra && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, obraId: undefined, direccion: '' }))}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                  >
                    Cambiar
                  </button>
                )}
              </div>
            ) : (
              <ObraSearchSelect
                buscarObras={buscarObras}
                onSelectObra={(obra) => {
                  setFormData((prev) => ({
                    ...prev,
                    obraId: obra.cod_obra,
                    direccion: obra.direccion,
                    localidad: obra.localidad?.nombre_localidad ?? '',
                  }))
                  setIsVisitaInicial(false)
                }}
                placeholder="Buscar obra por dirección o identificador..."
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
