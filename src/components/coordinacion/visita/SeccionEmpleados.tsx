'use client'
import { useState } from 'react'
import { Empleado } from '@/types'

interface SeccionEmpleadosProps {
  visitadores: Empleado[]
  empleadosDisponibles: Empleado[]
  todosLosEmpleados: Empleado[]
  visitadorPrincipal: string
  onVisitadorChange: (cuil: string) => void
  acompanantesSeleccionados: string[]
  onAcompanantesChange: (cuils: string[]) => void
}

export default function SeccionEmpleados({
  visitadores,
  empleadosDisponibles,
  todosLosEmpleados,
  visitadorPrincipal,
  onVisitadorChange,
  acompanantesSeleccionados,
  onAcompanantesChange,
}: SeccionEmpleadosProps) {
  const [query, setQuery] = useState('')

  // Filtrar empleados por query
  const resultadosFiltrados =
    query.length > 1
      ? empleadosDisponibles.filter((e) =>
          `${e.nombre} ${e.apellido}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : []

  const handleSelectAcompanante = (cuil: string) => {
    if (!acompanantesSeleccionados.includes(cuil)) {
      onAcompanantesChange([...acompanantesSeleccionados, cuil])
    }
    setQuery('')
  }

  const handleRemoveAcompanante = (cuil: string) => {
    onAcompanantesChange(acompanantesSeleccionados.filter((c) => c !== cuil))
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-blue-800">
        Empleados asignados
      </h2>

      {/* Visitador principal */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Visitador principal *
        </label>
        <select
          value={visitadorPrincipal}
          onChange={(e) => onVisitadorChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Seleccionar visitador...</option>
          {visitadores.map((v) => (
            <option key={v.cuil} value={v.cuil}>
              {v.nombre} {v.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Acompañantes */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Acompañantes (opcional)
        </label>
        <div className="relative mb-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o apellido..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {resultadosFiltrados.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {resultadosFiltrados.map((e) => (
                <li key={e.cuil}>
                  <button
                    type="button"
                    onClick={() => handleSelectAcompanante(e.cuil)}
                    className="w-full px-3 py-2 text-left transition-colors hover:bg-blue-50"
                  >
                    {e.nombre} {e.apellido}
                    <span className="ml-2 text-xs text-gray-500">
                      ({e.rol_actual})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chips de acompañantes seleccionados */}
        <div className="flex flex-wrap gap-2">
          {todosLosEmpleados
            .filter((e) => acompanantesSeleccionados.includes(e.cuil))
            .map((e) => (
              <span
                key={e.cuil}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {e.nombre} {e.apellido}
                <button
                  type="button"
                  onClick={() => handleRemoveAcompanante(e.cuil)}
                  className="text-blue-500 transition-colors hover:text-blue-700"
                  title="Quitar"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      </div>
    </section>
  )
}
