import { useState } from 'react'
import { X, Save, AlertCircle, Loader2 } from 'lucide-react'
import clienteService from '@/services/cliente.service'
import type { Cliente } from '@/types'

interface EditarClienteProps {
  cliente: Cliente
  onCancel: () => void
  onSuccess?: (clienteActualizado: Cliente) => void
}

interface UpdateClienteDTO {
  razon_social?: string
  telefono?: string
  mail?: string
  nombre?: string
  apellido?: string
  sexo?: string
}

export default function EditarCliente({ cliente, onCancel, onSuccess }: EditarClienteProps) {
  const esEmpresa = cliente.tipo_cliente === 'EMPRESA'
  
  const [formData, setFormData] = useState<UpdateClienteDTO>({
    ...(esEmpresa 
      ? { razon_social: cliente.razon_social || '' }
      : { 
          nombre: cliente.nombre || '', 
          apellido: cliente.apellido || '', 
          sexo: cliente.sexo || '' 
        }
    ),
    telefono: cliente.telefono,
    mail: cliente.mail,
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateClienteDTO, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateClienteDTO, string>> = {}

    if (esEmpresa) {
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

    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio'
    } else if (formData.telefono.length > 20) {
      newErrors.telefono = 'El teléfono no puede exceder 20 caracteres'
    }

    if (!formData.mail?.trim()) {
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

      const clienteActualizado = await clienteService.updateCliente(
        cliente.cuil,
        formData
      )

      if (onSuccess) {
        onSuccess(clienteActualizado)
      }
      
      onCancel()
    } catch (err: any) {
      console.error('Error al actualizar cliente:', err)
      setError(
        err.response?.data?.message || 
        'Error al actualizar el cliente. Por favor, intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof UpdateClienteDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const hasChanges = () => {
    if (esEmpresa) {
      return (
        formData.razon_social !== cliente.razon_social ||
        formData.telefono !== cliente.telefono ||
        formData.mail !== cliente.mail
      )
    } else {
      return (
        formData.nombre !== cliente.nombre ||
        formData.apellido !== cliente.apellido ||
        formData.sexo !== cliente.sexo ||
        formData.telefono !== cliente.telefono ||
        formData.mail !== cliente.mail
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Cliente</h2>
            <p className="mt-1 text-sm text-gray-600">
              CUIL: <span className="font-semibold">{cliente.cuil}</span>
              <span className="ml-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {esEmpresa ? 'Empresa' : 'Persona'}
              </span>
            </p>
          </div>
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

          <div className="space-y-4">
            {esEmpresa ? (
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
                  className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                    errors.razon_social
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.razon_social && (
                  <p className="mt-1 text-sm text-red-600">{errors.razon_social}</p>
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
                      className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
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
                      className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
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
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
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
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
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
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                  errors.mail
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.mail && (
                <p className="mt-1 text-sm text-red-600">{errors.mail}</p>
              )}
            </div>

            {/* Información no editable */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nota:</span> El CUIL y el tipo de cliente no pueden ser modificados. 
                Si necesitas cambiarlos, deberás crear un nuevo cliente.
              </p>
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
              disabled={loading || !hasChanges()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>

          {!hasChanges() && !loading && (
            <p className="mt-2 text-center text-sm text-gray-500">
              No hay cambios para guardar
            </p>
          )}
        </form>
      </div>
    </div>
  )
}