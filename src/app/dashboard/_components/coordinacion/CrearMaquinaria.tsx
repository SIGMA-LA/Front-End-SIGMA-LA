'use client'

import { useState } from 'react'
import { Wrench, CheckCircle, X, ArrowLeft } from 'lucide-react'

interface CrearMaquinaProps {
  onCancel: () => void
  onSubmit: (maquinaData: { descripcion: string }) => void
}

interface ModalConfirmacionProps {
  isOpen: boolean
  maquinaData: {
    id: number
    descripcion: string
    estado: string
  }
  onConfirm: () => void
  onCancel: () => void
}

function ModalConfirmacion({
  isOpen,
  maquinaData,
  onConfirm,
  onCancel,
}: ModalConfirmacionProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Registro
            </h3>
            <p className="text-sm text-gray-600">
              La máquina será registrada en el sistema
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Código generado:</span>
            <span className="font-mono text-gray-900">{maquinaData.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Descripción:</span>
            <span className="text-gray-900">{maquinaData.descripcion}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Estado inicial:</span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              {maquinaData.estado}
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-green-50 p-3">
          <p className="text-sm text-green-800">
            La máquina quedará habilitada y disponible para asignar a entregas de obras.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
          >
            Confirmar Registro
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CrearMaquinaria({ onCancel, onSubmit }: CrearMaquinaProps) {
  const [descripcion, setDescripcion] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState<{ descripcion?: string }>({})


  const validateForm = () => {
    const newErrors: { descripcion?: string } = {}

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria'
    } else if (descripcion.trim().length < 3) {
      newErrors.descripcion = 'La descripción debe tener al menos 3 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setShowModal(true)
  }

  const handleConfirm = () => {
    const maquinaData = {
      descripcion: descripcion.trim()
    }

    setShowModal(false)
    onSubmit(maquinaData)
  }

  const maquinaPreview = {
    id: 3,
    descripcion: descripcion.trim(),
    estado: 'Habilitada'
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <button
                  onClick={onCancel}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <Wrench className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Registrar Nueva Máquina
                    </h1>
                    <p className="text-sm text-gray-600">
                      El sistema generará automáticamente el código y estado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Descripción de la Máquina <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descripcion"
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Cortadora de perfiles de aluminio Modelo XYZ-2000, con capacidad para perfiles de hasta 150mm de ancho..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.descripcion
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-orange-500'
                  }`}
                />
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                )}
              </div>


              {/* Información adicional */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Información importante:</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>El código de máquina se genera automáticamente</li>
                      <li>La máquina se registrará con estado "Habilitada"</li>
                      <li>Podrá ser asignada inmediatamente a entregas de obras</li>
                      <li>El estado puede modificarse posteriormente si requiere mantenimiento</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!descripcion.trim()}
                  className="rounded-lg bg-orange-600 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Registrar Máquina
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={showModal}
        maquinaData={maquinaPreview}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}