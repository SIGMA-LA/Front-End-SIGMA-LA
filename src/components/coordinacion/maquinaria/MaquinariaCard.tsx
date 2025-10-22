'use client'

import { Wrench, Eye, Edit, Trash2 } from 'lucide-react'
import { MaquinariaCardProps } from '@/types'

export default function MaquinariaCard({
  maquinaria,
  onViewDetails,
  onEdit,
  onDelete,
}: MaquinariaCardProps) {
  const getEstadoIcon = () => {
    switch (maquinaria.estado) {
      case 'DISPONIBLE':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
        )
      case 'NO DISPONIBLE':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <div className="h-3 w-3 rounded-full bg-red-500" />
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <div className="h-3 w-3 rounded-full bg-gray-500" />
          </div>
        )
    }
  }

  const getEstadoText = () => {
    switch (maquinaria.estado) {
      case 'DISPONIBLE':
        return 'Disponible'
      case 'NO DISPONIBLE':
        return 'No Disponible'
      default:
        return maquinaria.estado
    }
  }

  const getEstadoTextColor = () => {
    switch (maquinaria.estado) {
      case 'DISPONIBLE':
        return 'text-green-700'
      case 'NO DISPONIBLE':
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-2">
              {getEstadoIcon()}
              <span className={`text-sm font-medium ${getEstadoTextColor()}`}>
                {getEstadoText()}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-gray-500">
            #{maquinaria.cod_maquina}
          </span>
        </div>

        {/* Nombre destacado de la maquinaria */}
        <h3 className="mb-2 text-xl leading-tight font-bold text-gray-900">
          {maquinaria.descripcion.length > 60
            ? `${maquinaria.descripcion.substring(0, 60)}...`
            : maquinaria.descripcion}
        </h3>

        {/* Descripción completa si es más larga */}
        {maquinaria.descripcion.length > 60 && (
          <p className="line-clamp-2 text-sm text-gray-600">
            {maquinaria.descripcion}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(maquinaria)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
