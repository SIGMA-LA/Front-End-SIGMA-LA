'use client'

import { User } from 'lucide-react'

interface PersonalSelectionProps {
  encargado: string | null
  acompanantes: string[]
  getEmpleadoNombre: (cuil: string) => string
  onAsignarClick: () => void
}

export default function PersonalSelection({
  encargado,
  acompanantes,
  getEmpleadoNombre,
  onAsignarClick,
}: PersonalSelectionProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        <User className="mr-1 inline h-4 w-4" />
        Personal Asignado
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start justify-between">
          <div className="text-sm">
            <p className="font-semibold text-gray-800">
              <span className="font-bold">Encargado:</span>{' '}
              {encargado ? getEmpleadoNombre(encargado) : 'No seleccionado'}
            </p>
            <p className="mt-2 font-semibold text-gray-800">
              <span className="font-bold">
                Acompañantes ({acompanantes.length}):
              </span>
            </p>
            {acompanantes.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-600">
                {acompanantes.map((cuil) => (
                  <li key={cuil}>{getEmpleadoNombre(cuil)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Ninguno</p>
            )}
          </div>
          <button
            type="button"
            onClick={onAsignarClick}
            className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Asignar
          </button>
        </div>
      </div>
    </div>
  )
}
