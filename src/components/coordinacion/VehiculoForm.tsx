'use client'

import { AlertTriangle, Car, Save, X } from 'lucide-react'
import { ESTADOS_VEHICULO, TIPOS_VEHICULO } from '@/constants'
import { Vehiculo, VehiculoFormData } from '@/types'
import { useVehiculoForm } from '@/hooks/useVehiculoForm'

interface VehiculoFormProps {
  vehiculo?: Vehiculo
  onSubmit: (data: VehiculoFormData) => void
  onCancel: () => void
  isPending: boolean
  error: string | null
  isEdit?: boolean
}

/**
 * Form for creating and editing vehicles.
 * Logic is decoupled via useVehiculoForm hook.
 */
export default function VehiculoForm({
  vehiculo,
  onSubmit,
  onCancel,
  isPending,
  error,
  isEdit = false,
}: VehiculoFormProps) {
  const {
    tipoVehiculo,
    setTipoVehiculo,
    estado,
    setEstado,
    patente,
    handlePatenteChange,
    anio,
    handleAnioChange,
    marca,
    setMarca,
    modelo,
    setModelo,
    errors,
    validateForm,
    prepareSubmitData,
  } = useVehiculoForm(vehiculo, isEdit)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(prepareSubmitData())
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onCancel}
          disabled={isPending}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <X className="h-5 w-5" />
          <span>Volver</span>
        </button>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center gap-3 border-b pb-4">
            <Car className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h1>
              <p className="text-sm text-gray-600">
                {isEdit
                  ? `Modificar información del vehículo ${vehiculo?.patente}`
                  : 'Complete los datos del nuevo vehículo'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Patente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patente}
                  onChange={handlePatenteChange}
                  disabled={isEdit}
                  placeholder="ABC123 / AB123CD"
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    errors.patente
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  } ${isEdit ? 'cursor-not-allowed bg-gray-100' : ''}`}
                />
                {errors.patente && (
                  <p className="mt-1 text-sm text-red-600">{errors.patente}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tipo de Vehículo <span className="text-red-500">*</span>
                </label>
                <select
                  value={tipoVehiculo}
                  onChange={(e) => setTipoVehiculo(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    errors.tipoVehiculo
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {TIPOS_VEHICULO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipoVehiculo && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tipoVehiculo}
                  </p>
                )}
              </div>

              {isEdit && (
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as typeof estado)}
                    className={`w-full rounded-md border px-3 py-2 text-sm ${
                      errors.estado
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {ESTADOS_VEHICULO.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                  {errors.estado && (
                    <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  placeholder="Ej: Toyota"
                  maxLength={50}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    errors.marca
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {errors.marca && (
                  <p className="mt-1 text-sm text-red-600">{errors.marca}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  placeholder="Ej: Hilux"
                  maxLength={50}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    errors.modelo
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {errors.modelo && (
                  <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Año <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={anio}
                  onChange={handleAnioChange}
                  placeholder="2024"
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    errors.anio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.anio && (
                  <p className="mt-1 text-sm text-red-600">{errors.anio}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 border-t pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEdit ? 'Guardar' : 'Registrar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
