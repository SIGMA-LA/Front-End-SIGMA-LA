'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, User, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type {
  Empleado,
  CreateEmpleadoData,
  UpdateEmpleadoData,
  RolEmpleado,
  AreaTrabajo,
} from '@/types'
import {
  ROLES_VALIDOS,
  AREAS_VALIDAS,
  getRolLabel,
  getAreaLabel,
} from '@/lib/empleado-utils'
import { notify } from '@/lib/toast'

interface EmpleadoFormularioProps {
  empleado?: Empleado | null
  onSubmit: (data: CreateEmpleadoData | UpdateEmpleadoData) => Promise<void>
}

interface FormErrors {
  cuil?: string
  nombre?: string
  apellido?: string
  rol_actual?: string
  area_trabajo?: string
  contrasenia?: string
}

const formatCUIL = (value: string): string => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
}

export default function EmpleadoFormulario({
  empleado,
  onSubmit,
}: EmpleadoFormularioProps) {
  const router = useRouter()
  const isEdit = Boolean(empleado)

  const [formData, setFormData] = useState<{
    cuil: string
    nombre: string
    apellido: string
    rol_actual: RolEmpleado
    area_trabajo: AreaTrabajo
    contrasenia: string
  }>({
    cuil: '',
    nombre: '',
    apellido: '',
    rol_actual: 'VENTAS',
    area_trabajo: 'VENTAS',
    contrasenia: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Cargar datos del empleado cuando cambie
  useEffect(() => {
    console.log('Empleado recibido:', empleado)
    if (empleado) {
      // Manejar si empleado viene como objeto con data o directo
      const empleadoData = empleado

      const newFormData = {
        cuil: empleadoData.cuil ? formatCUIL(empleadoData.cuil) : '',
        nombre: empleadoData.nombre || '',
        apellido: empleadoData.apellido || '',
        rol_actual: (empleadoData.rol_actual as RolEmpleado) || 'VENTAS',
        area_trabajo: (empleadoData.area_trabajo as AreaTrabajo) || 'VENTAS',
        contrasenia: '',
      }
      console.log('Form data a setear:', newFormData)
      setFormData(newFormData)
    }
  }, [empleado])

  const handleChange = (field: string, value: string) => {
    if (field === 'cuil') {
      setFormData((prev) => ({ ...prev, cuil: formatCUIL(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setErrors((prev: FormErrors) => ({ ...prev, [field]: '' }))
    setApiError(null)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const cuilNumbers = formData.cuil.replace(/\D/g, '')
    if (!cuilNumbers) {
      newErrors.cuil = 'El CUIL es obligatorio'
    } else if (cuilNumbers.length < 11 || cuilNumbers.length > 13) {
      newErrors.cuil = 'El CUIL debe tener entre 11 y 13 dígitos'
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio'
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres'
    }

    if (formData.contrasenia && formData.contrasenia.length < 8) {
      newErrors.contrasenia = 'La contraseña debe tener al menos 8 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowConfirmModal(true)
    }
  }

  const handleConfirmSubmit = async () => {
    setIsPending(true)
    setApiError(null)

    try {
      const cuilLimpio = formData.cuil.replace(/\D/g, '')
      const dataToSubmit: CreateEmpleadoData | UpdateEmpleadoData = {
        ...formData,
        cuil: cuilLimpio,
      } as CreateEmpleadoData | UpdateEmpleadoData

      if (!dataToSubmit.contrasenia || dataToSubmit.contrasenia.trim() === '') {
        const { contrasenia: _contrasenia, ...dataWithoutPass } = dataToSubmit
        await onSubmit(dataWithoutPass)
      } else {
        await onSubmit(dataToSubmit)
      }
      notify.success(
        isEdit
          ? 'Empleado actualizado correctamente.'
          : 'Empleado creado correctamente.'
      )
      setShowConfirmModal(false)
      router.push('/admin/empleados')
      router.refresh()
    } catch (error: unknown) {
      console.error('Error:', error)
      const message =
        error instanceof Error ? error.message : 'Error al procesar el empleado'
      setApiError(message)
      notify.error(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h2>
              <p className="text-sm text-blue-100">
                {isEdit
                  ? 'Actualiza la información del empleado en el sistema'
                  : 'Completa los datos para registrar un nuevo empleado'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePreSubmit} className="p-8">
          <div className="space-y-8">
            {/* Sección: Información Personal */}
            <div>
              <div className="mb-6 border-b border-gray-200 pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Información Personal
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Datos de identificación del empleado
                </p>
              </div>

              <div className="space-y-6">
                {/* CUIL */}
                <div className="max-w-md">
                  <Label
                    htmlFor="cuil"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    CUIL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cuil"
                    value={formData.cuil}
                    onChange={(e) => handleChange('cuil', e.target.value)}
                    placeholder="20-12345678-9"
                    className="mt-2 h-11 w-full border-gray-300 text-base focus:border-blue-500 focus:ring-blue-500"
                    disabled={isEdit}
                    maxLength={13}
                  />
                  {isEdit && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      No se puede modificar
                    </p>
                  )}
                  {errors.cuil && (
                    <p className="mt-2 flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {errors.cuil}
                    </p>
                  )}
                </div>

                {/* Nombre y Apellido en Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Nombre */}
                  <div>
                    <Label
                      htmlFor="nombre"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      placeholder="Ej: Juan"
                      className="mt-2 h-11 w-full border-gray-300 text-base focus:border-blue-500 focus:ring-blue-500"
                      maxLength={50}
                    />
                    {errors.nombre && (
                      <p className="mt-2 flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <Label
                      htmlFor="apellido"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => handleChange('apellido', e.target.value)}
                      placeholder="Ej: Pérez"
                      className="mt-2 h-11 w-full border-gray-300 text-base focus:border-blue-500 focus:ring-blue-500"
                      maxLength={50}
                    />
                    {errors.apellido && (
                      <p className="mt-2 flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        {errors.apellido}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Información Laboral */}
            <div>
              <div className="mb-6 border-b border-gray-200 pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Información Laboral
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Rol y área de trabajo asignados
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Rol */}
                <div>
                  <Label
                    htmlFor="rol_actual"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Rol <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="rol_actual"
                    value={formData.rol_actual}
                    onChange={(e) => handleChange('rol_actual', e.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {ROLES_VALIDOS.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Área de Trabajo */}
                <div>
                  <Label
                    htmlFor="area_trabajo"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Área de Trabajo <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="area_trabajo"
                    value={formData.area_trabajo}
                    onChange={(e) =>
                      handleChange('area_trabajo', e.target.value)
                    }
                    className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {AREAS_VALIDAS.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Seguridad y Acceso */}
            <div>
              <div className="mb-6 border-b border-gray-200 pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Seguridad y Acceso
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Credenciales para acceso al sistema (opcional)
                </p>
              </div>

              <div className="space-y-6">
                {/* Contraseña */}
                <div className="max-w-md">
                  <Label
                    htmlFor="contrasenia"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Contraseña{' '}
                    <span className="font-normal text-gray-500">
                      {isEdit
                        ? '(opcional - solo si desea cambiarla)'
                        : '(opcional)'}
                    </span>
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="contrasenia"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.contrasenia}
                      onChange={(e) =>
                        handleChange('contrasenia', e.target.value)
                      }
                      placeholder={
                        isEdit
                          ? 'Dejar vacío para mantener la actual'
                          : 'Solo si tendrá acceso al sistema'
                      }
                      className="h-11 w-full border-gray-300 pr-10 text-base focus:border-blue-500 focus:ring-blue-500 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                      maxLength={50}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.contrasenia && (
                    <p className="mt-2 flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {errors.contrasenia}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {isEdit
                      ? 'Dejar vacío para mantener la contraseña actual'
                      : 'Mínimo 8 caracteres si se proporciona contraseña'}
                  </p>
                </div>

                {/* Info Box */}
                <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900">
                        Información sobre la contraseña
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                          <span>
                            La contraseña es <strong>opcional</strong> al crear
                            o editar un empleado
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                          <span>
                            <strong>Con contraseña:</strong> El empleado podrá
                            iniciar sesión en el sistema
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                          <span>
                            <strong>Sin contraseña:</strong> Solo registro
                            interno para asignación a tareas
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-8 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="h-11 w-full border-gray-300 text-base font-medium sm:w-auto sm:px-8"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-base font-semibold shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 sm:w-auto sm:px-8"
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Empleado'}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            className="animate-in fade-in zoom-in w-full max-w-md duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {isEdit
                        ? 'Confirmar Actualización'
                        : 'Confirmar Registro'}
                    </h3>
                    <p className="mt-0.5 text-sm text-blue-100">
                      Verifica los datos antes de continuar
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Datos del empleado */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      CUIL
                    </span>
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {formData.cuil}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Nombre completo
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formData.nombre} {formData.apellido}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Rol
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {getRolLabel(formData.rol_actual)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Área
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      {getAreaLabel(formData.area_trabajo)}
                    </span>
                  </div>
                  {formData.contrasenia && (
                    <>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {isEdit ? 'Nueva contraseña' : 'Contraseña'}
                        </span>
                        <span className="font-mono text-sm text-gray-500">
                          {'•'.repeat(
                            Math.min(formData.contrasenia.length, 10)
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Mensaje de información */}
                <div className="mt-4 flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <p className="text-sm text-blue-900">
                    {isEdit
                      ? 'Los cambios se aplicarán inmediatamente al confirmar.'
                      : 'El empleado quedará registrado y disponible para asignaciones.'}
                  </p>
                </div>

                {/* Error */}
                {apiError && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-900">
                        Error al procesar
                      </h4>
                      <p className="mt-1 text-sm text-red-700">{apiError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 font-medium hover:bg-gray-100"
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 font-semibold shadow-md hover:from-blue-700 hover:to-blue-800"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Procesando...
                    </span>
                  ) : isEdit ? (
                    'Actualizar'
                  ) : (
                    'Registrar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
