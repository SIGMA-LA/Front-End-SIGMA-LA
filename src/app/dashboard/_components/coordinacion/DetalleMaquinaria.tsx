'use client'

import {
  Wrench,
  X,
  Edit,
  Trash2,
  Settings,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { DetalleMaquinariaProps, Maquinaria } from '@/types'

export default function DetalleMaquinaria({
  maquinaria,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onChangeStatus,
}: DetalleMaquinariaProps) {
  if (!isOpen) return null

  const getEstadoIcon = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'MANTENIMIENTO':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'REPARACION':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'FUERA_DE_SERVICIO':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'EN_USO':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getEstadoColor = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'MANTENIMIENTO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REPARACION':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'FUERA_DE_SERVICIO':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'EN_USO':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoText = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible'
      case 'MANTENIMIENTO':
        return 'En Mantenimiento'
      case 'REPARACION':
        return 'En Reparación'
      case 'FUERA_DE_SERVICIO':
        return 'Fuera de Servicio'
      case 'EN_USO':
        return 'En Uso'
      default:
        return estado
    }
  }

  const handleChangeStatus = () => {
    onChangeStatus(maquinaria, maquinaria.estado)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles de Maquinaria
              </h2>
              <p className="text-sm text-gray-600">
                Código: #{maquinaria.cod_maquina}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Información básica */}
          <div className="mb-4">
            <h3 className="mb-2 text-base font-medium text-gray-900">
              Información General
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <p className="rounded-lg border bg-gray-50 p-3 text-gray-900">
                  {maquinaria.descripcion}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Estado Actual
                </label>
                <div className="flex items-center gap-2">
                  {getEstadoIcon(maquinaria.estado)}
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${getEstadoColor(maquinaria.estado)}`}
                  >
                    {getEstadoText(maquinaria.estado)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Código de maquinaria */}
          <div className="mb-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Código de Maquinaria
                </span>
              </div>
              <p className="font-mono text-lg font-bold text-gray-900">
                #{maquinaria.cod_maquina}
              </p>
            </div>
          </div>

          {/* Estado y acciones */}
          <div className="mb-4">
            <h3 className="mb-2 text-base font-medium text-gray-900">
              Estado y Disponibilidad
            </h3>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Estado actual:</p>
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(maquinaria.estado)}
                    <span className="font-medium text-gray-900">
                      {getEstadoText(maquinaria.estado)}
                    </span>
                  </div>
                  {maquinaria.estado === 'DISPONIBLE' && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ Lista para ser asignada a entregas
                    </p>
                  )}
                  {maquinaria.estado === 'EN_USO' && (
                    <p className="mt-1 text-sm text-blue-600">
                      • Actualmente en uso en una obra
                    </p>
                  )}
                  {(maquinaria.estado === 'MANTENIMIENTO' ||
                    maquinaria.estado === 'REPARACION') && (
                    <p className="mt-1 text-sm text-yellow-600">
                      ⚠ No disponible temporalmente
                    </p>
                  )}
                  {maquinaria.estado === 'FUERA_DE_SERVICIO' && (
                    <p className="mt-1 text-sm text-red-600">✗ No operativa</p>
                  )}
                </div>
                <button
                  onClick={handleChangeStatus}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex flex-col gap-2 border-t border-gray-200 p-4 sm:flex-row sm:justify-end">
          <button
            onClick={() => onDelete(maquinaria)}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-red-700 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
          <button
            onClick={() => onEdit(maquinaria)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}
