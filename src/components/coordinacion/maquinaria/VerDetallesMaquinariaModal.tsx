'use client'

import { X, Wrench, CheckCircle, XCircle } from 'lucide-react'
import type { Maquinaria } from '@/types'

interface VerDetallesMaquinariaModalProps {
  isOpen: boolean
  maquinaria: Maquinaria | null
  onClose: () => void
}

export default function VerDetallesMaquinariaModal({
  isOpen,
  maquinaria,
  onClose,
}: VerDetallesMaquinariaModalProps) {
  if (!isOpen || !maquinaria) return null

  const getEstadoInfo = () => {
    switch (maquinaria.estado) {
      case 'DISPONIBLE':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: 'Disponible',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          description:
            'Esta maquinaria está disponible para ser asignada a entregas.',
        }
      case 'NO DISPONIBLE':
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          text: 'No Disponible',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          description: 'Esta maquinaria no está disponible actualmente.',
        }
      default:
        return {
          icon: <XCircle className="h-5 w-5 text-gray-600" />,
          text: maquinaria.estado,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          description: 'Estado desconocido.',
        }
    }
  }

  const estadoInfo = getEstadoInfo()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
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
                Código #{maquinaria.cod_maquina}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Código de Maquinaria */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Código de Maquinaria
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="font-mono text-lg font-semibold text-gray-900">
                  #{maquinaria.cod_maquina}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="leading-relaxed text-gray-900">
                  {maquinaria.descripcion}
                </p>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Estado Actual
              </label>
              <div
                className={`rounded-lg border p-4 ${estadoInfo.borderColor} ${estadoInfo.bgColor}`}
              >
                <div className="mb-2 flex items-center gap-3">
                  {estadoInfo.icon}
                  <span className={`font-medium ${estadoInfo.textColor}`}>
                    {estadoInfo.text}
                  </span>
                </div>
                <p
                  className={`text-sm ${estadoInfo.textColor.replace('700', '600')}`}
                >
                  {estadoInfo.description}
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-blue-800">
                <Wrench className="h-4 w-4" />
                Información del Sistema
              </h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• El código de maquinaria es único e inmutable</li>
                <li>
                  • El estado puede ser modificado según las necesidades
                  operativas
                </li>
                <li>
                  • Solo las maquinarias disponibles pueden ser asignadas a
                  entregas
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
