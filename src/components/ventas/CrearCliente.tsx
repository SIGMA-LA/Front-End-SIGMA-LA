'use client'

import { useState } from 'react'
import { X, Save, AlertCircle, Loader2, User, Building } from 'lucide-react'
import type { Cliente } from '@/types'
import { useRouter } from 'next/navigation'

export default function CrearCliente({
  action,
  initialOpen = true,
}: {
  action: (formData: FormData) => Promise<Cliente | null>
  initialOpen?: boolean
}) {
  const [open, setOpen] = useState<boolean>(initialOpen)
  const [tipoCliente, setTipoCliente] = useState<'PERSONA' | 'EMPRESA'>(
    'PERSONA'
  )
  const [formState, setFormState] = useState({
    cuil: '',
    telefono: '',
    mail: '',
    razon_social: '',
    nombre: '',
    apellido: '',
    sexo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleTipoClienteChange = (tipo: 'PERSONA' | 'EMPRESA') => {
    setTipoCliente(tipo)
    setFormState((prev) => ({
      ...prev,
      razon_social: tipo === 'EMPRESA' ? prev.razon_social : '',
      nombre: tipo === 'PERSONA' ? prev.nombre : '',
      apellido: tipo === 'PERSONA' ? prev.apellido : '',
      sexo: tipo === 'PERSONA' ? prev.sexo : '',
    }))
    setError(null)
  }

  const formatCUIL = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 10)
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
  }

  const handleChange = (field: keyof typeof formState, value: string) => {
    if (field === 'cuil') {
      setFormState((prev) => ({ ...prev, cuil: formatCUIL(value) }))
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }))
    }
    setError(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h2>
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          method="post"
          action={action as any}
          className="p-6"
          onSubmit={async () => {
            // UX: mostrar loading breve. El server action se ejecuta en el servidor.
            setLoading(true)
            setError(null)
            router.refresh()
          }}
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

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
                name="cuil"
                type="text"
                value={formState.cuil}
                onChange={(e) => handleChange('cuil', e.target.value)}
                placeholder="20-12345678-9"
                maxLength={13}
                disabled={loading}
                required
                pattern="^\d{2}-?\d{8}-?\d{1}$"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            {tipoCliente === 'EMPRESA' ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Razón Social <span className="text-red-500">*</span>
                </label>
                <input
                  name="razon_social"
                  type="text"
                  value={formState.razon_social}
                  onChange={(e) => handleChange('razon_social', e.target.value)}
                  placeholder="Empresa S.A."
                  maxLength={50}
                  disabled={loading}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nombre"
                      type="text"
                      value={formState.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      placeholder="Juan"
                      maxLength={50}
                      disabled={loading}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="apellido"
                      type="text"
                      value={formState.apellido}
                      onChange={(e) => handleChange('apellido', e.target.value)}
                      placeholder="Pérez"
                      maxLength={50}
                      disabled={loading}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sexo"
                    value={formState.sexo}
                    onChange={(e) => handleChange('sexo', e.target.value)}
                    disabled={loading}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                name="telefono"
                type="tel"
                value={formState.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="+54 341 1234567"
                maxLength={20}
                disabled={loading}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="mail"
                type="email"
                value={formState.mail}
                onChange={(e) => handleChange('mail', e.target.value)}
                placeholder="contacto@empresa.com"
                maxLength={100}
                disabled={loading}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <input type="hidden" name="tipo_cliente" value={tipoCliente} />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
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
