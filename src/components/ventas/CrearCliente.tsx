'use client'

import { useState, useEffect } from 'react'
import { Save, AlertCircle, Loader2, User, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Cliente } from '@/types'

export default function CrearCliente({
  action,
  cancelUrl = '/ventas/clientes',
  cliente,
}: {
  action: (formData: FormData) => Promise<any>
  cancelUrl?: string
  cliente?: Cliente
}) {
  const [tipoCliente, setTipoCliente] = useState<'PERSONA' | 'EMPRESA'>(
    cliente?.tipo_cliente ?? 'PERSONA'
  )
  const [formState, setFormState] = useState({
    cuil: cliente?.cuil ?? '',
    telefono: cliente?.telefono ?? '',
    mail: cliente?.mail ?? '',
    razon_social: cliente?.razon_social ?? '',
    nombre: cliente?.nombre ?? '',
    apellido: cliente?.apellido ?? '',
    sexo: cliente?.sexo ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (cliente) {
      setTipoCliente(cliente.tipo_cliente ?? 'PERSONA')
      setFormState({
        cuil: cliente.cuil ?? '',
        telefono: cliente.telefono ?? '',
        mail: cliente.mail ?? '',
        razon_social: cliente.razon_social ?? '',
        nombre: cliente.nombre ?? '',
        apellido: cliente.apellido ?? '',
        sexo: cliente.sexo ?? '',
      })
    }
  }, [cliente])

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

  const isEdit = Boolean(cliente)

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar cliente' : 'Crear cliente'}
          </h1>
          <p className="text-sm text-gray-600">
            {isEdit
              ? 'Modifica los datos y guarda para actualizar el cliente.'
              : 'Completa el formulario para crear un cliente.'}
          </p>
        </div>
      </header>

      <form
        action={action}
        onSubmit={() => {
          setLoading(true)
          setError(null)
        }}
        className="space-y-6"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* oculto: original_cuil para que el server action identifique el registro si el CUIL se edita */}
        {isEdit && (
          <input
            type="hidden"
            name="original_cuil"
            value={cliente!.cuil ?? ''}
          />
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Tipo de Cliente <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTipoClienteChange('PERSONA')}
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                tipoCliente === 'PERSONA'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Persona</span>
            </button>
            <button
              type="button"
              onClick={() => handleTipoClienteChange('EMPRESA')}
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                tipoCliente === 'EMPRESA'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <Building className="h-5 w-5" />
              <span className="font-medium">Empresa</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4">
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
                maxLength={100}
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(cancelUrl)}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="ml-auto flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Actualizar cliente' : 'Crear cliente'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
