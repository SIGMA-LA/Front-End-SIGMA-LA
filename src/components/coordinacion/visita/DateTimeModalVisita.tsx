'use client'

import { useState, useEffect } from 'react'
import { X, CalendarClock } from 'lucide-react'

interface DateTimeModalVisitaProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (
    fecha: string,
    hora: string,
    fechaHasta: string
  ) => void
  initialValues: {
    fecha: string
    hora: string
    fechaHasta: string
  }
}

export default function DateTimeModalVisita({
  isOpen,
  onClose,
  onConfirm,
  initialValues,
}: DateTimeModalVisitaProps) {
  const [fecha, setFecha] = useState(initialValues.fecha)
  const [hora, setHora] = useState(initialValues.hora)
  const [fechaHasta, setFechaHasta] = useState(initialValues.fechaHasta)

  useEffect(() => {
    if (isOpen) {
      setFecha(initialValues.fecha)
      setHora(initialValues.hora)
      setFechaHasta(initialValues.fechaHasta || initialValues.fecha) // Defaults to start date
    }
  }, [isOpen, initialValues])

  if (!isOpen) return null

  const isFormValid =
    fecha !== '' &&
    hora !== '' &&
    fechaHasta !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onConfirm(fecha, hora, fechaHasta)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <CalendarClock className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Horario de la Visita
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Inicio de la Visita (Pactado) *
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => {
                    setFecha(e.target.value)
                    if (!fechaHasta || new Date(e.target.value) > new Date(fechaHasta)) {
                      setFechaHasta(e.target.value)
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  required
                />
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Fecha de Finalización Estimada *
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={fechaHasta}
                  min={fecha}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Se utiliza para calcular los viáticos y la disponibilidad del vehículo asignado.
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirmar Horarios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
