'use client'

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
        Personal Asignado
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className={`flex flex-col gap-4 sm:flex-row sm:justify-between ${(encargado || acompanantes.length > 0) ? 'sm:items-start' : 'sm:items-center'}`}>
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Encargado:</span>
              {encargado ? (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  {getEmpleadoNombre(encargado)}
                </span>
              ) : (
                <span className="text-gray-500">No seleccionado</span>
              )}
            </div>
            
            <div className="mt-4">
              <span className="font-medium text-gray-700">
                Acompañantes ({acompanantes.length})
              </span>
              {acompanantes.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {acompanantes.map((cuil) => (
                    <span key={cuil} className="inline-flex items-center rounded-full bg-gray-200 border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-800 shadow-sm">
                      {getEmpleadoNombre(cuil)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="ml-2 text-gray-500">Ninguno</span>
              )}
            </div>
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
