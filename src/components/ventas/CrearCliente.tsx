import { useState } from 'react'
import { X, Save, AlertCircle, Loader2, User, Building } from 'lucide-react'
import clienteService, { CreateClienteDTO } from '@/services/cliente.service'
import type { CrearClienteProps } from '@/types'

export default function CrearCliente({
  onCancel,
  onSubmit,
}: CrearClienteProps) {
  const [tipoCliente, setTipoCliente] = useState<'PERSONA' | 'EMPRESA'>('PERSONA')
  const [formData, setFormData] = useState<CreateClienteDTO>({
    cuil: '',
    tipo_cliente: 'PERSONA',
    telefono: '',
    mail: '',
    nombre: '',
    apellido: '',
    sexo: '',
    razon_social: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateClienteDTO, string>>
  >({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateClienteDTO, string>> = {}

    if (!formData.cuil.trim()) {
      newErrors.cuil = 'El CUIL es obligatorio'
    } else if (!/^\d{11}$/.test(formData.cuil.replace(/-/g, ''))) {
      newErrors.cuil = 'El CUIL debe tener 11 dígitos'
    }

    if (tipoCliente === 'EMPRESA') {
      if (!formData.razon_social?.trim()) {
        newErrors.razon_social = 'La razón social es obligatoria'
      } else if (formData.razon_social.length > 50) {
        newErrors.razon_social = 'La razón social no puede exceder 50 caracteres'
      }
    } else {
      if (!formData.nombre?.trim()) {
        newErrors.nombre = 'El nombre es obligatorio'
      } else if (formData.nombre.length > 50) {
        newErrors.nombre = 'El nombre no puede exceder 50 caracteres'
      }

      if (!formData.apellido?.trim()) {
        newErrors.apellido = 'El apellido es obligatorio'
      } else if (formData.apellido.length > 50) {
        newErrors.apellido = 'El apellido no puede exceder 50 caracteres'
      }

      if (!formData.sexo?.trim()) {
        newErrors.sexo = 'El sexo es obligatorio'
      }
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio'
    } else if (formData.telefono.length > 20) {
      newErrors.telefono = 'El teléfono no puede exceder 20 caracteres'
    }

    if (!formData.mail.trim()) {
      newErrors.mail = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      newErrors.mail = 'El email no es válido'
    } else if (formData.mail.length > 100) {
      newErrors.mail = 'El email no puede exceder 100 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const dataToSend: CreateClienteDTO = {
        cuil: formData.cuil.replace(/-/g, ''),
        tipo_cliente: tipoCliente,
        telefono: formData.telefono,
        mail: formData.mail,
      }

      if (tipoCliente === 'EMPRESA') {
        dataToSend.razon_social = formData.razon_social
      } else {
        dataToSend.nombre = formData.nombre
        dataToSend.apellido = formData.apellido
        dataToSend.sexo = formData.sexo
      }

      const clienteCreado = await clienteService.createCliente(dataToSend)

      if (onSubmit) {
        onSubmit(clienteCreado as any)
      }

      onCancel()
    } catch (err: any) {
      console.error('Error al crear cliente:', err)
      setError(
        err.response?.data?.message ||
          'Error al crear el cliente. Por favor, intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateClienteDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTipoClienteChange = (tipo: 'PERSONA' | 'EMPRESA') => {
    setTipoCliente(tipo)
    setFormData(prev => ({ ...prev, tipo_cliente: tipo }))
    setErrors({})
  }

  const formatCUIL = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 10)
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Selector de Tipo de Cliente */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipo de Cliente <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTipoClienteChange('PERSONA')}
                disabled={loading}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  tipoCliente === 'PERSONA'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                } disabled:opacity-50`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Persona</span>
              </button>
              <button
                type="button"
                onClick={() => handleTipoClienteChange('EMPRESA')}
                disabled={loading}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  tipoCliente === 'EMPRESA'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                } disabled:opacity-50`}
              >
                <Building className="h-5 w-5" />
                <span className="font-medium">Empresa</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                CUIL/CUIT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formatCUIL(formData.cuil)}
                onChange={(e) =>
                  handleChange('cuil', e.target.value.replace(/\D/g, ''))
                }
                placeholder="20-12345678-9"
                maxLength={13}
                disabled={loading}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                  errors.cuil
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.cuil && (
                <p className="mt-1 text-sm text-red-600">{errors.cuil}</p>
              )}
            </div>

            {tipoCliente === 'EMPRESA' ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Razón Social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.razon_social}
                  onChange={(e) => handleChange('razon_social', e.target.value)}
                  placeholder="Empresa S.A."
                  maxLength={50}
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                    errors.razon_social
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.razon_social && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.razon_social}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      placeholder="Juan"
                      maxLength={50}
                      disabled={loading}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                        errors.nombre
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => handleChange('apellido', e.target.value)}
                      placeholder="Pérez"
                      maxLength={50}
                      disabled={loading}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                        errors.apellido
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                    />
                    {errors.apellido && (
                      <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => handleChange('sexo', e.target.value)}
                    disabled={loading}
                    className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                      errors.sexo
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.sexo && (
                    <p className="mt-1 text-sm text-red-600">{errors.sexo}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="+54 341 1234567"
                maxLength={20}
                disabled={loading}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                  errors.telefono
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.mail}
                onChange={(e) => handleChange('mail', e.target.value)}
                placeholder="contacto@empresa.com"
                maxLength={100}
                disabled={loading}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                  errors.mail
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.mail && (
                <p className="mt-1 text-sm text-red-600">{errors.mail}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Guardar Cliente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}