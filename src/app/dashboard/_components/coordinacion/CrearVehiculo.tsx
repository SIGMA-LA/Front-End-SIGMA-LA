'use client'

import { useState } from 'react'
import { Car, CheckCircle} from 'lucide-react'

interface CrearVehiculoProps {
  onCancel: () => void
  onSubmit: (vehiculoData: { 
    tipoVehiculo: string
    marca: string
    modelo: string
    anio: number
    patente: string
    estado: string 
  }) => void
}

interface ModalConfirmacionProps {
  isOpen: boolean
  vehiculoData: {
    tipoVehiculo: string
    marca: string
    modelo: string
    anio: number
    patente: string
    estado: string
  }
  onConfirm: () => void
  onCancel: () => void
}

function ModalConfirmacion({
  isOpen,
  vehiculoData,
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
              El vehículo será registrado en el sistema
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Tipo:</span>
            <span className="text-gray-900">{vehiculoData.tipoVehiculo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Marca:</span>
            <span className="text-gray-900">{vehiculoData.marca}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Modelo:</span>
            <span className="text-gray-900">{vehiculoData.modelo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Año:</span>
            <span className="text-gray-900">{vehiculoData.anio}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Patente:</span>
            <span className="font-mono text-gray-900 font-bold text-lg">{vehiculoData.patente}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Estado inicial:</span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              {vehiculoData.estado}
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-green-50 p-3">
          <p className="text-sm text-green-800">
            El vehículo quedará habilitado y disponible para asignar a visitas y entregas.
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

export default function CrearVehiculo({ onCancel, onSubmit }: CrearVehiculoProps) {
  const [tipoVehiculo, setTipoVehiculo] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState('')
  const [patente, setPatente] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState<{ 
    tipoVehiculo?: string
    marca?: string
    modelo?: string
    anio?: string
    patente?: string 
  }>({})

  const tiposVehiculo = [
    'Auto',
    'Camioneta',
    'Camión',
    'Furgón',
    'Utilitario',
    'Moto',
    'Otro'
  ]

  const validatePatente = (patente: string) => {
    // Formato argentino: ABC123, AB123CD, A123BCD
    const patternOld = /^[A-Z]{3}[0-9]{3}$/ // ABC123
    const patternNew = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/ // AB123CD
    const patternMoto = /^[A-Z][0-9]{3}[A-Z]{3}$/ // A123BCD
    
    return patternOld.test(patente) || patternNew.test(patente) || patternMoto.test(patente)
  }

  const formatPatente = (value: string) => {
    // Convertir a mayúsculas y remover espacios
    const cleaned = value.toUpperCase().replace(/\s/g, '')
    return cleaned
  }

  const validateForm = () => {
    const newErrors: { 
      tipoVehiculo?: string
      marca?: string
      modelo?: string
      anio?: string
      patente?: string 
    } = {}

    if (!tipoVehiculo) {
      newErrors.tipoVehiculo = 'El tipo de vehículo es obligatorio'
    }

    if (!marca.trim()) {
      newErrors.marca = 'La marca es obligatoria'
    } else if (marca.trim().length < 2) {
      newErrors.marca = 'La marca debe tener al menos 2 caracteres'
    }

    if (!modelo.trim()) {
      newErrors.modelo = 'El modelo es obligatorio'
    } else if (modelo.trim().length < 2) {
      newErrors.modelo = 'El modelo debe tener al menos 2 caracteres'
    }

    if (!anio.trim()) {
      newErrors.anio = 'El año es obligatorio'
    } else {
      const anioNum = parseInt(anio)
      const currentYear = new Date().getFullYear()
      if (isNaN(anioNum) || anioNum < 1900 || anioNum > currentYear + 1) {
        newErrors.anio = `El año debe estar entre 1900 y ${currentYear + 1}`
      }
    }

    if (!patente.trim()) {
      newErrors.patente = 'La patente es obligatoria'
    } else if (!validatePatente(patente)) {
      newErrors.patente = 'Formato de patente inválido (ej: ABC123, AB123CD, A123BCD)'
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
    const vehiculoData = {
      tipoVehiculo,
      marca: marca.trim(),
      modelo: modelo.trim(),
      anio: parseInt(anio),
      patente: patente.trim(),
      estado: 'disponible'
    }

    setShowModal(false)
    onSubmit(vehiculoData)
  }

  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPatente(e.target.value)
    if (formatted.length <= 7) { // Máximo 7 caracteres
      setPatente(formatted)
    }
  }

  const handleAnioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Solo números
    if (value.length <= 4) { // Máximo 4 dígitos
      setAnio(value)
    }
  }

  const vehiculoPreview = {
    tipoVehiculo,
    marca: marca.trim(),
    modelo: modelo.trim(),
    anio: parseInt(anio) || 0,
    patente: patente.trim(),
    estado: 'Disponible'
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Registrar Nuevo Vehículo
                    </h1>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Vehículo */}
              <div>
                <label
                  htmlFor="tipoVehiculo"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tipo de Vehículo <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoVehiculo"
                  value={tipoVehiculo}
                  onChange={(e) => setTipoVehiculo(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.tipoVehiculo
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Seleccionar tipo de vehículo</option>
                  {tiposVehiculo.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipoVehiculo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipoVehiculo}</p>
                )}
              </div>

              {/* Marca y Modelo en la misma fila */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Marca */}
                <div>
                  <label
                    htmlFor="marca"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Ej: Ford, Toyota, Volkswagen"
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.marca
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.marca && (
                    <p className="mt-1 text-sm text-red-600">{errors.marca}</p>
                  )}
                </div>

                {/* Modelo */}
                <div>
                  <label
                    htmlFor="modelo"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ej: F-150, Corolla, Amarok"
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.modelo
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.modelo && (
                    <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
                  )}
                </div>
              </div>

              {/* Año y Patente en la misma fila */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Año */}
                <div>
                  <label
                    htmlFor="anio"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Año <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="anio"
                    value={anio}
                    onChange={handleAnioChange}
                    placeholder="2020"
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.anio
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.anio && (
                    <p className="mt-1 text-sm text-red-600">{errors.anio}</p>
                  )}
                </div>

                {/* Patente */}
                <div>
                  <label
                    htmlFor="patente"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Patente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="patente"
                    value={patente}
                    onChange={handlePatenteChange}
                    placeholder="ABC123 / AB123CD"
                    className={`w-full rounded-lg border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 ${
                      errors.patente
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.patente && (
                    <p className="mt-1 text-sm text-red-600">{errors.patente}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Formatos válidos: ABC123 (old), AB123CD (new), A123BCD (moto)
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Información importante:</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>La patente será la clave identificadora única del vehículo</li>
                      <li>El vehículo se registrará con estado "Disponible"</li>
                      <li>Podrá ser asignado a visitas, entregas y traslados</li>
                      <li>El estado puede cambiar a "En uso", "Reparación" o "Fuera de servicio"</li>
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
                  disabled={!tipoVehiculo || !marca.trim() || !modelo.trim() || !anio.trim() || !patente.trim()}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Registrar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={showModal}
        vehiculoData={vehiculoPreview}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}