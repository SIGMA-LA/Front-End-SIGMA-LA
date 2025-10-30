'use client'

import { useState } from 'react'
import { AlertTriangle, User, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Empleado } from '@/types'

interface CrearEmpleadoProps {
  onCancel: () => void
  onSubmit: (empleadoData: CrearEmpleadoData) => Promise<void>
  editingEmpleado?: Empleado | null
}

export interface CrearEmpleadoData {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
  contrasenia?: string // OPCIONAL
}

interface ModalConfirmacionProps {
  isOpen: boolean
  empleadoData: CrearEmpleadoData
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
  apiError: string | null
  isEdit: boolean
}

const ROLES_VALIDOS = [
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'PLANTA', label: 'Planta' },
  { value: 'COORDINACION', label: 'Coordinación' },
  { value: 'VISITADOR', label: 'Visitador' },
  { value: 'PRODUCCION', label: 'Producción' },
]

const AREAS_VALIDAS = [
  { value: 'COORDINACION', label: 'Coordinación' },
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'PRODUCCION', label: 'Producción' },
  { value: 'CORTE', label: 'Corte' },
  { value: 'MECANIZADO', label: 'Mecanizado' },
  { value: 'ENSAMBLE', label: 'Ensamble' },
  { value: 'ALMACEN', label: 'Almacén' },
  { value: 'ATENCION_CLIENTE', label: 'Atención al Cliente' },
  { value: 'COMPRAS', label: 'Compras' },
  { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
  { value: 'FINANZAS', label: 'Finanzas' },
]

function ModalConfirmacion({
  isOpen,
  empleadoData,
  onConfirm,
  onCancel,
  isPending,
  apiError,
  isEdit,
}: ModalConfirmacionProps) {
  if (!isOpen) return null

  const getRolLabel = (rol: string) => {
    return ROLES_VALIDOS.find((r) => r.value === rol)?.label || rol
  }

  const getAreaLabel = (area: string) => {
    return AREAS_VALIDAS.find((a) => a.value === area)?.label || area
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEdit ? 'Confirmar Actualización' : 'Confirmar Registro'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEdit
                ? 'Los datos del empleado serán actualizados'
                : 'El empleado será registrado en el sistema'}
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">CUIL:</span>
            <span className="font-mono text-gray-900">{empleadoData.cuil}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Nombre:</span>
            <span className="text-gray-900">
              {empleadoData.nombre} {empleadoData.apellido}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Rol:</span>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {getRolLabel(empleadoData.rol_actual)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Área:</span>
            <span className="text-gray-900">
              {getAreaLabel(empleadoData.area_trabajo)}
            </span>
          </div>
          {!isEdit && empleadoData.contrasenia && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Contraseña:</span>
              <span className="text-gray-500">
                {'•'.repeat(empleadoData.contrasenia.length)}
              </span>
            </div>
          )}
          {isEdit && empleadoData.contrasenia && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Nueva contraseña:</span>
              <span className="text-gray-500">
                {'•'.repeat(empleadoData.contrasenia.length)}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 rounded-lg bg-green-50 p-3">
          <p className="text-sm text-green-800">
            {isEdit
              ? 'Los cambios se aplicarán inmediatamente.'
              : empleadoData.contrasenia
              ? 'El empleado podrá acceder al sistema con su CUIL y contraseña.'
              : 'El empleado será registrado sin acceso al sistema (solo para información/asignación).'}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">Error al procesar</h4>
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? 'Procesando...' : isEdit ? 'Actualizar' : 'Registrar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CrearEmpleado({
  onCancel,
  onSubmit,
  editingEmpleado,
}: CrearEmpleadoProps) {
  const isEdit = Boolean(editingEmpleado)

  const [formData, setFormData] = useState<CrearEmpleadoData>({
    cuil: editingEmpleado?.cuil || '',
    nombre: editingEmpleado?.nombre || '',
    apellido: editingEmpleado?.apellido || '',
    rol_actual: editingEmpleado?.rol_actual || 'VENTAS',
    area_trabajo: editingEmpleado?.area_trabajo || 'VENTAS',
    contrasenia: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CrearEmpleadoData, string>>>({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const formatCUIL = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
  }

  const handleChange = (field: keyof CrearEmpleadoData, value: string) => {
    if (field === 'cuil') {
      setFormData((prev) => ({ ...prev, cuil: formatCUIL(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setApiError(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CrearEmpleadoData, string>> = {}

    // Validar CUIL
    const cuilNumbers = formData.cuil.replace(/\D/g, '')
    if (!cuilNumbers) {
      newErrors.cuil = 'El CUIL es obligatorio'
    } else if (cuilNumbers.length < 11 || cuilNumbers.length > 13) {
      newErrors.cuil = 'El CUIL debe tener entre 11 y 13 dígitos'
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no debe superar los 50 caracteres'
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio'
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres'
    } else if (formData.apellido.trim().length > 50) {
      newErrors.apellido = 'El apellido no debe superar los 50 caracteres'
    }

    // Validar rol
    if (!formData.rol_actual) {
      newErrors.rol_actual = 'El rol es obligatorio'
    }

    // Validar área de trabajo
    if (!formData.area_trabajo) {
      newErrors.area_trabajo = 'El área de trabajo es obligatoria'
    }

    // Validar contraseña (OPCIONAL tanto en CREATE como UPDATE)
    // Si se proporciona, debe ser válida
    if (formData.contrasenia) {
      if (formData.contrasenia.length < 8) {
        newErrors.contrasenia = 'La contraseña debe tener al menos 8 caracteres'
      } else if (formData.contrasenia.length > 50) {
        newErrors.contrasenia = 'La contraseña no debe superar los 50 caracteres'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    if (validateForm()) {
      setShowConfirmModal(true)
    }
  }

  const handleConfirmSubmit = async () => {
    setIsPending(true)
    setApiError(null)

    try {
      // Limpiar el CUIL (solo números, sin guiones)
      const cuilLimpio = formData.cuil.replace(/\D/g, '')
      
      // Si no se proporcionó contraseña (vacía), no la enviamos
      const dataToSubmit: Partial<CrearEmpleadoData> = { 
        ...formData,
        cuil: cuilLimpio // Enviar CUIL limpio
      }
      
      if (!dataToSubmit.contrasenia || dataToSubmit.contrasenia.trim() === '') {
        const { contrasenia, ...rest } = dataToSubmit
        await onSubmit(rest as CrearEmpleadoData)
      } else {
        await onSubmit(dataToSubmit as CrearEmpleadoData)
      }

      setShowConfirmModal(false)
      onCancel()
    } catch (error: any) {
      console.error('Error al procesar empleado:', error)
      
      let errorMessage = 'Error al procesar el empleado'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        errorMessage = errors
          .flatMap((e: any) => e.issues?.map((i: any) => i.message) || [])
          .join(', ')
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setApiError(errorMessage)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {isEdit ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
                </h2>
                <p className="text-sm text-blue-100">
                  {isEdit
                    ? 'Actualiza los datos del empleado'
                    : 'Completa el formulario para registrar un nuevo empleado'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlePreSubmit} className="p-6">
            <div className="space-y-5">
              {/* CUIL */}
              <div>
                <Label htmlFor="cuil">
                  CUIL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cuil"
                  value={formData.cuil}
                  onChange={(e) => handleChange('cuil', e.target.value)}
                  placeholder="20-12345678-9"
                  className="mt-1"
                  disabled={isEdit}
                  maxLength={13}
                />
                {isEdit && (
                  <p className="mt-1 text-xs text-gray-500">
                    El CUIL no se puede modificar
                  </p>
                )}
                {errors.cuil && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.cuil}
                  </p>
                )}
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nombre">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="Ej: Juan"
                    className="mt-1"
                    maxLength={50}
                  />
                  {errors.nombre && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apellido">
                    Apellido <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    placeholder="Ej: Pérez"
                    className="mt-1"
                    maxLength={50}
                  />
                  {errors.apellido && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.apellido}
                    </p>
                  )}
                </div>
              </div>

              {/* Rol y Área de Trabajo */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="rol_actual">
                    Rol <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="rol_actual"
                    value={formData.rol_actual}
                    onChange={(e) => handleChange('rol_actual', e.target.value)}
                    className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {ROLES_VALIDOS.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </select>
                  {errors.rol_actual && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.rol_actual}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="area_trabajo">
                    Área de Trabajo <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="area_trabajo"
                    value={formData.area_trabajo}
                    onChange={(e) => handleChange('area_trabajo', e.target.value)}
                    className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {AREAS_VALIDAS.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                  {errors.area_trabajo && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.area_trabajo}
                    </p>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <Label htmlFor="contrasenia">
                  Contraseña{' '}
                  <span className="text-sm font-normal text-gray-500">
                    (opcional)
                  </span>
                  {isEdit && (
                    <span className="text-sm font-normal text-gray-500">
                      {' '}- solo si desea cambiarla
                    </span>
                  )}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="contrasenia"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.contrasenia}
                    onChange={(e) => handleChange('contrasenia', e.target.value)}
                    placeholder={isEdit ? 'Dejar vacío para no cambiar' : 'Solo si tendrá acceso al sistema'}
                    className="pr-10"
                    maxLength={50}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.contrasenia && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.contrasenia}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Si proporciona contraseña, debe tener entre 8 y 50 caracteres
                </p>
              </div>

              {/* Información de seguridad */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Información importante:</p>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      <li>La contraseña es <strong>opcional</strong></li>
                      <li><strong>Con contraseña</strong>: El empleado podrá acceder al sistema</li>
                      <li><strong>Sin contraseña</strong>: El empleado solo estará registrado para asignación a tareas</li>
                      {isEdit && (
                        <li>Si no ingresa una nueva contraseña, se mantendrá la actual</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <Button type="button" onClick={onCancel} variant="outline">
                Cancelar
              </Button>
              <Button type="submit">
                {isEdit ? 'Guardar Cambios' : 'Crear Empleado'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        isOpen={showConfirmModal}
        empleadoData={formData}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        isPending={isPending}
        apiError={apiError}
        isEdit={isEdit}
      />
    </>
  )
}
