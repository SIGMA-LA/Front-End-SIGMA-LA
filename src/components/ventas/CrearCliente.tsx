'use client'

import { useState, useActionState } from 'react'
import {
  Save,
  AlertCircle,
  Loader2,
  User,
  Building,
  ArrowLeft,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Cliente } from '@/types'
import { type ActionResponse } from '@/actions/clientes'
import Link from 'next/link'

interface CrearClienteProps {
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>
  initialData?: Cliente
  cancelUrl?: string
  title?: string
  subtitle?: string
}

export default function CrearCliente({
  action,
  initialData,
  cancelUrl = '/ventas/clientes',
  title,
  subtitle,
}: CrearClienteProps) {
  const router = useRouter()
  const [tipoCliente, setTipoCliente] = useState<'PERSONA' | 'EMPRESA'>(
    initialData?.tipo_cliente ?? 'PERSONA'
  )
  const [formState, setFormState] = useState({
    cuil: initialData?.cuil ?? '',
    telefono: initialData?.telefono ?? '',
    mail: initialData?.mail ?? '',
    razon_social: initialData?.razon_social ?? '',
    nombre: initialData?.nombre ?? '',
    apellido: initialData?.apellido ?? '',
    sexo: initialData?.sexo ?? '',
  })

  const [state, formAction, isPending] = useActionState(action, {
    success: true,
    error: undefined,
  })

  const isEdit = Boolean(initialData)

  const handleTipoClienteChange = (tipo: 'PERSONA' | 'EMPRESA') => {
    setTipoCliente(tipo)
    setFormState((prev) => ({
      ...prev,
      razon_social: tipo === 'EMPRESA' ? prev.razon_social : '',
      nombre: tipo === 'PERSONA' ? prev.nombre : '',
      apellido: tipo === 'PERSONA' ? prev.apellido : '',
      sexo: tipo === 'PERSONA' ? prev.sexo : '',
    }))
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
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={cancelUrl}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            {tipoCliente === 'EMPRESA' ? (
              <Building className="h-6 w-6 text-blue-600" />
            ) : (
              <User className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {title || (isEdit ? 'Editar Cliente' : 'Crear Cliente')}
            </h1>
            <p className="text-sm text-gray-600">
              {subtitle || (isEdit
                ? 'Modifica los datos del cliente'
                : 'Completa el formulario para registrar un nuevo cliente')}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form action={formAction} className="space-y-6">
        {/* Error Alert */}
        {state?.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Error al {isEdit ? 'actualizar' : 'crear'} el cliente
                </p>
                <p className="mt-1 text-sm text-red-700">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden fields para edición */}
        {isEdit && (
          <input type="hidden" name="original_cuil" value={initialData!.cuil} />
        )}

        {/* Tipo de Cliente */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Tipo de Cliente <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTipoClienteChange('PERSONA')}
              disabled={isPending}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                tipoCliente === 'PERSONA'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              } disabled:opacity-50`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Persona</span>
            </button>
            <button
              type="button"
              onClick={() => handleTipoClienteChange('EMPRESA')}
              disabled={isPending}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                tipoCliente === 'EMPRESA'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              } disabled:opacity-50`}
            >
              <Building className="h-5 w-5" />
              <span className="font-medium">Empresa</span>
            </button>
          </div>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-4">
          {/* CUIL */}
          <div>
            <label
              htmlFor="cuil"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              CUIL/CUIT <span className="text-red-500">*</span>
            </label>
            <input
              id="cuil"
              name="cuil"
              type="text"
              value={formState.cuil}
              onChange={(e) => handleChange('cuil', e.target.value)}
              placeholder="20-12345678-9"
              maxLength={13}
              disabled={isPending || isEdit}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
            />
            {isEdit && (
              <p className="mt-1 text-xs text-gray-500">
                El CUIL/CUIT no puede modificarse
              </p>
            )}
          </div>

          {/* Campos según tipo */}
          {tipoCliente === 'EMPRESA' ? (
            <div>
              <label
                htmlFor="razon_social"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                id="razon_social"
                name="razon_social"
                type="text"
                value={formState.razon_social}
                onChange={(e) => handleChange('razon_social', e.target.value)}
                placeholder="Empresa S.A."
                maxLength={100}
                disabled={isPending}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
              />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formState.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="Juan"
                    maxLength={50}
                    disabled={isPending}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apellido"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={formState.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    placeholder="Pérez"
                    maxLength={50}
                    disabled={isPending}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="sexo"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formState.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                  disabled={isPending}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="">Seleccione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </>
          )}

          {/* Teléfono */}
          <div>
            <label
              htmlFor="telefono"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={formState.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="+54 341 1234567"
              maxLength={20}
              disabled={isPending}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="mail"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="mail"
              name="mail"
              type="email"
              value={formState.mail}
              onChange={(e) => handleChange('mail', e.target.value)}
              placeholder="contacto@empresa.com"
              maxLength={100}
              disabled={isPending}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          <input type="hidden" name="tipo_cliente" value={tipoCliente} />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Link
            href={cancelUrl}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
