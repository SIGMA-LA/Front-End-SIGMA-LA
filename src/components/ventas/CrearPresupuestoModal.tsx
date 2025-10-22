'use client'

import { useState, useEffect } from 'react'
import { X, Save, DollarSign, Calendar } from 'lucide-react'
import type { PresupuestoFormData } from '@/services/presupuesto.service'

interface CrearPresupuestoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (presupuestoData: PresupuestoFormData) => void
  presupuestoExistente?: PresupuestoFormData | null
}

const initialState: PresupuestoFormData = {
  valor: 0,
  fecha_emision: '',
  fecha_aceptacion: '',
}

export default function CrearPresupuestoModal({
  isOpen,
  onClose,
  onSubmit,
  presupuestoExistente,
}: CrearPresupuestoModalProps) {
  const [formData, setFormData] = useState<PresupuestoFormData>(initialState)
  const esModoEdicion = !!presupuestoExistente

  useEffect(() => {
    if (isOpen && presupuestoExistente) {
      setFormData({
        ...presupuestoExistente,
        fecha_emision: presupuestoExistente.fecha_emision
          ? new Date(presupuestoExistente.fecha_emision)
              .toISOString()
              .split('T')[0]
          : '',
        fecha_aceptacion: presupuestoExistente.fecha_aceptacion
          ? new Date(presupuestoExistente.fecha_aceptacion)
              .toISOString()
              .split('T')[0]
          : '',
      })
    } else {
      setFormData(initialState)
    }
  }, [isOpen, presupuestoExistente])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const presupuestoData: PresupuestoFormData = {
      valor: formData.valor,
      fecha_emision: formData.fecha_emision,
      fecha_aceptacion: formData.fecha_aceptacion || undefined,
    }

    if (presupuestoExistente?.nro_presupuesto) {
      presupuestoData.nro_presupuesto = presupuestoExistente.nro_presupuesto
    }

    onSubmit(presupuestoData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {esModoEdicion ? 'Editar Presupuesto' : 'Agregar Presupuesto'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Valor del Presupuesto *
            </label>
            <div className="relative">
              <DollarSign className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valor: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="50000"
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fecha de Emisión *
              </label>
              <input
                type="date"
                value={formData.fecha_emision}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fecha_emision: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fecha de Aceptación
              </label>
              <input
                type="date"
                value={formData.fecha_aceptacion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fecha_aceptacion: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Save className="h-5 w-5" />
              {esModoEdicion ? 'Guardar Cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
