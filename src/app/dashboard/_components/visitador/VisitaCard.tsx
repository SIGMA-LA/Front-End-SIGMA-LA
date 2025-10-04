import type { Visita } from '@/types'

interface VisitaCardProps {
  visita: Visita
  isSelected: boolean
  onClick: () => void
  isPendiente: boolean
}

const getTipoText = (tipo: string) =>
  ({
    inspeccion: 'Inspección',
    medicion: 'Medición',
    seguimiento: 'Seguimiento',
    entrega: 'Entrega',
  })[tipo] || tipo

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function VisitaCard({
  visita,
  isSelected,
  onClick,
  isPendiente,
}: VisitaCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
        isSelected
          ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow text-sm">
          <p className="font-semibold text-gray-800">
            {formatDate(visita.fecha_hora_visita)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {getTipoText(visita.motivo_visita)}
          </p>
        </div>
        <span
          className={`rounded-md px-3 py-1 text-xs text-white ${
            isPendiente ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        >
          Info
        </span>
      </div>
    </button>
  )
}
