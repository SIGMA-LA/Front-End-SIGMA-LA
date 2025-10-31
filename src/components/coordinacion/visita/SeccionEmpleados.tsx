'use client'
import { useState, useEffect } from 'react'
import { Empleado } from '@/types'
import { buscarFiltrados } from '@/actions/empleado'

interface SeccionEmpleadosProps {
  visitadoresDisponibles: Empleado[]
  acompanantesDisponibles: Empleado[]
  visitadorPrincipal: string
  onVisitadorChange: (cuil: string) => void
  acompanantesSeleccionados: string[]
  onAcompanantesChange: (cuils: string[]) => void
}

export default function SeccionEmpleados({
  visitadoresDisponibles,
  acompanantesDisponibles,
  visitadorPrincipal,
  onVisitadorChange,
  acompanantesSeleccionados,
  onAcompanantesChange,
}: SeccionEmpleadosProps) {
  // Solo mantiene el estado local para el query de búsqueda de acompañantes
  const [acompananteQuery, setAcompananteQuery] = useState('')
  const [acompananteResultados, setAcompananteResultados] = useState<
    Empleado[]
  >([])
  const [loadingAcompanantes, setLoadingAcompanantes] = useState(false)

  useEffect(() => {
    let ignore = false
    if (acompananteQuery.length > 1) {
      setLoadingAcompanantes(true)
      buscarFiltrados(acompananteQuery).then((res) => {
        if (!ignore) {
          setAcompananteResultados(
            res.filter(
              (a) =>
                !acompanantesSeleccionados.includes(a.cuil) &&
                a.cuil !== visitadorPrincipal
            )
          )
          setLoadingAcompanantes(false)
        }
      })
    } else {
      setAcompananteResultados([])
    }
    return () => {
      ignore = true
    }
  }, [acompananteQuery, acompanantesSeleccionados, visitadorPrincipal])

  const handleSelectAcompanante = (empleado: Empleado) => {
    if (!acompanantesSeleccionados.includes(empleado.cuil)) {
      onAcompanantesChange([...acompanantesSeleccionados, empleado.cuil])
    }
    setAcompananteQuery('')
    setAcompananteResultados([])
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
          Visitador principal
        </label>
        <select
          value={visitadorPrincipal}
          onChange={(e) => onVisitadorChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Seleccionar visitador...</option>
          {visitadoresDisponibles.map((v) => (
            <option key={v.cuil} value={v.cuil}>
              {v.nombre} {v.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Acompañantes */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Acompañantes
        </label>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={acompananteQuery}
            onChange={(e) => setAcompananteQuery(e.target.value)}
            placeholder="Buscar acompañante..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        {loadingAcompanantes && (
          <div className="mb-2 text-xs text-gray-500">Buscando...</div>
        )}
        {acompananteResultados.length > 0 && (
          <ul className="mb-2">
            {acompananteResultados.map((a) => (
              <li key={a.cuil}>
                <button
                  type="button"
                  onClick={() => handleSelectAcompanante(a)}
                  className="w-full rounded px-2 py-1 text-left hover:bg-blue-50"
                >
                  {a.nombre} {a.apellido}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          {acompanantesDisponibles
            .filter((a) => acompanantesSeleccionados.includes(a.cuil))
            .map((a) => (
              <span
                key={a.cuil}
                className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
              >
                {a.nombre} {a.apellido}
                <button
                  type="button"
                  onClick={() => handleRemoveAcompanante(a.cuil)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
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
