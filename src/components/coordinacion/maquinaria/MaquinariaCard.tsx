import { Wrench, Eye, Edit, Trash2, Loader2 } from 'lucide-react'
import type { Maquinaria } from '@/types'

interface MaquinariaCardProps {
  maquinaria: Maquinaria
  onViewDetails: (maquinaria: Maquinaria) => void
  onEdit: (maquinaria: Maquinaria) => void
  onDelete: (maquinaria: Maquinaria) => void
  isLoading?: boolean
}

export default function MaquinariaCard({
  maquinaria,
  onViewDetails,
  onEdit,
  onDelete,
  isLoading = false,
}: MaquinariaCardProps) {
  const isDisponible = maquinaria.estado === 'DISPONIBLE'

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
        <div className="flex items-center gap-3">
          <Wrench className="h-5 w-5 text-blue-600" />
          <span className="font-mono text-xs text-gray-600">
            #{maquinaria.cod_maquina}
          </span>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isDisponible
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {isDisponible ? 'Disponible' : 'No Disponible'}
        </span>
      </div>

      <div className="p-6">
        <h3 className="mb-4 line-clamp-2 text-lg font-semibold text-gray-900">
          {maquinaria.descripcion}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(maquinaria)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            Ver
          </button>
          <button
            onClick={() => onEdit(maquinaria)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(maquinaria)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
