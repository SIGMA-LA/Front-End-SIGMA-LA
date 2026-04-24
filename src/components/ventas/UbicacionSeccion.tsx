'use client'

import { MapPin, Calendar } from 'lucide-react'
import type { Provincia } from '@/types'

interface UbicacionSeccionProps {
  provincias: Provincia[]
  provinciaSeleccionada: number | ''
  onProvinciaChange: (cod: number | '') => void
  localidades: { cod_localidad: number; nombre_localidad: string }[]
  codLocalidad: number
  onLocalidadChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  direccion: string
  onDireccionChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fechaIni: string
  onFechaIniChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export default function UbicacionSeccion({
  provincias,
  provinciaSeleccionada,
  onProvinciaChange,
  localidades,
  codLocalidad,
  onLocalidadChange,
  direccion,
  onDireccionChange,
  fechaIni,
  onFechaIniChange,
  disabled = false,
}: UbicacionSeccionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-800">Ubicación de la Obra</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Provincia
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 outline-none"
            value={provinciaSeleccionada}
            onChange={(e) => onProvinciaChange(e.target.value ? Number(e.target.value) : '')}
            required
            disabled={disabled}
          >
            <option value="">Seleccione...</option>
            {provincias.map((prov) => (
              <option key={prov.cod_provincia} value={prov.cod_provincia}>
                {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Localidad
          </label>
          <select
            name="cod_localidad"
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 outline-none"
            value={codLocalidad || ''}
            onChange={onLocalidadChange}
            required
            disabled={disabled || !provinciaSeleccionada}
          >
            <option value="">Seleccione...</option>
            {localidades.map((loc) => (
              <option key={loc.cod_localidad} value={loc.cod_localidad}>
                {loc.nombre_localidad}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Dirección Exacta
          </label>
          <div className="group relative">
            <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <input
              name="direccion"
              type="text"
              placeholder="Calle, Altura, Departamento..."
              className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none"
              value={direccion}
              onChange={onDireccionChange}
              required
              disabled={disabled}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Fecha de Inicio
          </label>
          <div className="group relative">
            <Calendar className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <input
              name="fecha_ini"
              type="date"
              className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none"
              value={fechaIni}
              onChange={onFechaIniChange}
              required
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
