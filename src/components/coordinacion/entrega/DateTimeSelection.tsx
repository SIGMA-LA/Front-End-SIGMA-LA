'use client'

interface DateTimeSelectionProps {
  fecha: string
  hora: string
  fechaSalida: string
  horaSalida: string
  fechaRegreso: string
  horaRegreso: string
  onAsignarClick: () => void
}

export default function DateTimeSelection({
  fecha,
  hora,
  fechaSalida,
  horaSalida,
  fechaRegreso,
  horaRegreso,
  onAsignarClick,
}: DateTimeSelectionProps) {
  const isComplete =
    fecha !== '' &&
    hora !== '' &&
    fechaSalida !== '' &&
    horaSalida !== '' &&
    fechaRegreso !== '' &&
    horaRegreso !== ''

  const formatDateLabel = (d: string, t: string) => {
    try {
      if (!d || !t) return 'No seleccionado'
      const date = new Date(`${d}T${t}:00`)
      return new Intl.DateTimeFormat('es-AR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch {
      return 'No seleccionado'
    }
  }

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        Programación de Fechas
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div
          className={`flex flex-col gap-4 sm:flex-row sm:justify-between ${
            isComplete ? 'sm:items-start' : 'sm:items-center'
          }`}
        >
          <div className="text-sm w-full">
            <div className="flex flex-col gap-1 mb-3">
              <span className="font-semibold text-indigo-900 text-sm">Llegada Cliente al Destino:</span>
              <span className="text-indigo-700 text-xs font-medium bg-indigo-100/50 inline-block w-fit px-2.5 py-1 rounded-md border border-indigo-200">
                {formatDateLabel(fecha, hora)}
              </span>
            </div>

            <div className="flex items-center gap-6 border-t border-gray-200 pt-3">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700 text-sm">Salida Planta:</span>
                <span className="text-gray-600 text-xs font-medium bg-white inline-block w-fit px-2 py-0.5 rounded border border-gray-200">
                  {formatDateLabel(fechaSalida, horaSalida)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700 text-sm">Regreso Planta:</span>
                <span className="text-gray-600 text-xs font-medium bg-white inline-block w-fit px-2 py-0.5 rounded border border-gray-200">
                  {formatDateLabel(fechaRegreso, horaRegreso)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onAsignarClick}
            className="flex-shrink-0 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 self-start sm:self-center mt-4 sm:mt-0"
          >
            {isComplete ? 'Modificar' : 'Asignar Horarios'}
          </button>
        </div>
      </div>
    </div>
  )
}
