// src/components/Coord/visitas/SeccionEmpleados.tsx
'use client'

import { useState, useEffect } from 'react'
import { Empleado } from '@/types'
import { User, Users, X } from 'lucide-react'
import { buscarFiltrados } from '@/actions/empleado' // Asegúrate que la ruta sea correcta

interface SeccionEmpleadosProps {
  visitadoresDisponibles: Empleado[]
  acompanantesDisponibles: Empleado[] // Necesitamos la lista completa inicial
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
  // 1. Lógica de búsqueda de acompañantes, ahora encapsulada aquí
  const [acompananteQuery, setAcompananteQuery] = useState('')
  const [acompananteResultados, setAcompananteResultados] = useState<Empleado[]>([])
  const [loadingAcompanantes, setLoadingAcompanantes] = useState(false)
  
  // Mantenemos una lista interna de los acompañantes seleccionados para mostrar sus nombres
  const [acompanantesData, setAcompanantesData] = useState<Empleado[]>(() => 
    acompanantesDisponibles.filter(a => acompanantesSeleccionados.includes(a.cuil))
  );


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
      onAcompanantesChange([...acompanantesSeleccionados, empleado.cuil]);
      if(!acompanantesData.some(a => a.cuil === empleado.cuil)){
         setAcompanantesData(prev => [...prev, empleado]);
      }
    }
    setAcompananteQuery('');
    setAcompananteResultados([]);
  };

  const handleRemoveAcompanante = (cuil: string) => {
    onAcompanantesChange(acompanantesSeleccionados.filter((c) => c !== cuil));
  };


  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
        <Users className="h-5 w-5" /> Empleados asignados
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Columna Visitador Principal */}
        <div>
          <label className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-700">
            <User className="inline h-4 w-4" />
            Visitador <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {visitadoresDisponibles.length === 0 && (
              <span className="text-sm text-gray-400">
                No hay visitadores disponibles.
              </span>
            )}
            {visitadoresDisponibles.map((visitador) => (
              <label
                key={visitador.cuil}
                className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                  visitadorPrincipal === visitador.cuil
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="visitadorPrincipal"
                  value={visitador.cuil}
                  checked={visitadorPrincipal === visitador.cuil}
                  onChange={() => onVisitadorChange(visitador.cuil)}
                  className="mr-2"
                  required
                />
                <span className="text-sm">
                  {visitador.nombre} {visitador.apellido}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Columna Acompañantes */}
        <div>
          <label className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-700">
            <Users className="inline h-4 w-4" />
            Acompañantes
          </label>
          <input
            type="text"
            value={acompananteQuery}
            onChange={(e) => setAcompananteQuery(e.target.value)}
            placeholder="Buscar por nombre, apellido o CUIL..."
            className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {loadingAcompanantes && (
            <div className="text-sm text-gray-400">Buscando...</div>
          )}
          {acompananteResultados.length > 0 && (
            <div className="mb-2 max-h-40 overflow-y-auto rounded-md border bg-gray-50 p-2">
              {acompananteResultados.map((a) => (
                <div
                  key={a.cuil}
                  className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-blue-50"
                  onClick={() => handleSelectAcompanante(a)}
                >
                  <span>
                    {a.nombre} {a.apellido}{' '}
                    <span className="text-xs text-gray-500">
                      ({a.cuil})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {acompanantesData
              .filter(a => acompanantesSeleccionados.includes(a.cuil) && a.cuil !== visitadorPrincipal)
              .map((a) => (
                <div
                  key={a.cuil}
                  className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 shadow"
                >
                  <span>
                    {a.nombre} {a.apellido}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-blue-500 hover:text-red-500"
                    onClick={() => handleRemoveAcompanante(a.cuil)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}