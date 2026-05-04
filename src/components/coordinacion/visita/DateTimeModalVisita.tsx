'use client'

import { useState, useEffect } from 'react'
import { X, CalendarClock } from 'lucide-react'

interface DateTimeModalVisitaProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (
    fecha: string,
    hora: string,
    fechaSalida: string,
    horaSalida: string,
    fechaRegreso: string,
    horaRegreso: string
  ) => void
  initialValues: {
    fecha: string
    hora: string
    fechaSalida: string
    horaSalida: string
    fechaRegreso: string
    horaRegreso: string
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
  const [fechaSalida, setFechaSalida] = useState(initialValues.fechaSalida)
  const [horaSalida, setHoraSalida] = useState(initialValues.horaSalida)
  const [fechaRegreso, setFechaRegreso] = useState(initialValues.fechaRegreso)
  const [horaRegreso, setHoraRegreso] = useState(initialValues.horaRegreso)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFecha(initialValues.fecha)
      setHora(initialValues.hora)
      setFechaSalida(initialValues.fechaSalida)
      setHoraSalida(initialValues.horaSalida)
      setFechaRegreso(initialValues.fechaRegreso)
      setHoraRegreso(initialValues.horaRegreso)
      setError(null)
    }
  }, [isOpen, initialValues])

  // Helper to combine date and time strings into a Date object
  const createDateTime = (d: string, t: string): Date | null => {
    if (!d || !t) return null
    return new Date(`${d}T${t}`)
  }

  const validateSequence = (): boolean => {
    const dtVisita = createDateTime(fecha, hora)
    const dtSalida = createDateTime(fechaSalida, horaSalida)
    const dtRegreso = createDateTime(fechaRegreso, horaRegreso)

    if (!dtVisita || !dtSalida || !dtRegreso) return false

    if (dtSalida > dtVisita) {
      setError('La fecha de salida no puede ser posterior a la fecha de la visita.')
      return false
    }

    if (dtVisita > dtRegreso) {
      setError('La fecha de regreso no puede ser anterior a la fecha de la visita.')
      return false
    }

    setError(null)
    return true
  }

  useEffect(() => {
    if (isOpen) {
      validateSequence()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha, hora, fechaSalida, horaSalida, fechaRegreso, horaRegreso, isOpen])

  const isFormValid =
    fecha !== '' &&
    hora !== '' &&
    fechaSalida !== '' &&
    horaSalida !== '' &&
    fechaRegreso !== '' &&
    horaRegreso !== '' &&
    error === null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onConfirm(fecha, hora, fechaSalida, horaSalida, fechaRegreso, horaRegreso)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <CalendarClock className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Programación de Horarios
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Llegada al cliente (fecha de la visita) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Llegada al Cliente / Obra (Horario Pactado) *
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                  required
                />
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Salida + Regreso en grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Salida Estimada *
                </label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={fechaSalida}
                    onChange={(e) => setFechaSalida(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    required
                  />
                  <input
                    type="time"
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Regreso Estimado *
                </label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={fechaRegreso}
                    onChange={(e) => setFechaRegreso(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    required
                  />
                  <input
                    type="time"
                    value={horaRegreso}
                    onChange={(e) => setHoraRegreso(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    required
                  />
                </div>
              </div>
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
                className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
