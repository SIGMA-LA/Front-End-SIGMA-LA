'use client'

import { useState, useEffect } from 'react'
import { X, User, Shield, Users } from 'lucide-react'
import type { Empleado } from '@/types'

interface AsignarPersonalModalProps {
  isOpen: boolean
  empleados: Empleado[]
  encargadoSeleccionado: string | null
  acompanantesSeleccionados: string[]
  onClose: () => void
  onConfirm: (encargadoId: string, acompananteIds: string[]) => void
}

export default function AsignarPersonalModal({
  isOpen,
  empleados,
  encargadoSeleccionado,
  acompanantesSeleccionados,
  onClose,
  onConfirm,
}: AsignarPersonalModalProps) {
  const [internalEncargado, setInternalEncargado] = useState<string | null>(null)
  const [internalAcompanantes, setInternalAcompanantes] = useState<string[]>([])

  useEffect(() => {
    if (internalEncargado && internalAcompanantes.includes(internalEncargado)) {
      setInternalAcompanantes(prev => prev.filter(id => id !== internalEncargado))
    }
  }, [internalEncargado])

  if (!isOpen) return null

  const handleToggleAcompanante = (cuil: string) => {
    setInternalAcompanantes(prev =>
      prev.includes(cuil) ? prev.filter(id => id !== cuil) : [...prev, cuil]
    )
  }

  const handleConfirm = () => {
    if (internalEncargado) {
      onConfirm(internalEncargado, internalAcompanantes)
      onClose()
    } else {
      alert('Debe seleccionar un encargado para la entrega.')
    }
  }

  // Los acompañantes no pueden ser el mismo que el encargado.
  const empleadosParaAcompanantes = empleados.filter(
    emp => emp.cuil !== internalEncargado
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">Asignar Personal a la Entrega</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-8 overflow-y-auto p-6 md:grid-cols-2">
          {/* Encargado */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Seleccionar Encargado (1)</h3>
            </div>
            <div className="space-y-2">
              {empleados.map(emp => (
                <label
                  key={emp.cuil}
                  className={`flex cursor-pointer items-center rounded-lg border p-3 ${
                    internalEncargado === emp.cuil ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="encargado"
                    checked={internalEncargado === emp.cuil}
                    onChange={() => setInternalEncargado(emp.cuil)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm">{emp.nombre} {emp.apellido}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Acompañantes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Seleccionar Acompañantes</h3>
            </div>
            <div className="space-y-2">
              {empleadosParaAcompanantes.map(emp => (
                <label
                  key={emp.cuil}
                  className={`flex cursor-pointer items-center rounded-lg border p-3 ${
                    internalAcompanantes.includes(emp.cuil) ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={internalAcompanantes.includes(emp.cuil)}
                    onChange={() => handleToggleAcompanante(emp.cuil)}
                    className="h-4 w-4 rounded text-green-600"
                  />
                  <span className="ml-3 text-sm">{emp.nombre} {emp.apellido}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!internalEncargado}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar Asignación
          </button>
        </div>
      </div>
    </div>
  )
}