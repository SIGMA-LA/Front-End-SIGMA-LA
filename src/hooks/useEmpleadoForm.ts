'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type {
  Empleado,
  CreateEmpleadoData,
  UpdateEmpleadoData,
  RolEmpleado,
  AreaTrabajo,
} from '@/types'
import { notify } from '@/lib/toast'

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

export default function useEmpleadoForm(
  empleado: Empleado | null | undefined,
  onSubmit: (data: CreateEmpleadoData | UpdateEmpleadoData) => Promise<void>
) {
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

  useEffect(() => {
    if (empleado) {
      setFormData({
        cuil: empleado.cuil ? formatCUIL(empleado.cuil) : '',
        nombre: empleado.nombre || '',
        apellido: empleado.apellido || '',
        rol_actual: (empleado.rol_actual as RolEmpleado) || 'VENTAS',
        area_trabajo: (empleado.area_trabajo as AreaTrabajo) || 'VENTAS',
        contrasenia: '',
      })
    }
  }, [empleado])

  const handleChange = (field: keyof typeof formData, value: string) => {
    if (field === 'cuil') {
      setFormData((prev) => ({ ...prev, cuil: formatCUIL(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setErrors((prev) => ({ ...prev, [field]: '' }))
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
      const { contrasenia, ...rest } = formData
      
      const dataToSubmit = {
        ...rest,
        cuil: cuilLimpio,
        ...(contrasenia.trim() !== '' ? { contrasenia } : {})
      } as CreateEmpleadoData | UpdateEmpleadoData

      await onSubmit(dataToSubmit)
      
      notify.success(isEdit ? 'Empleado actualizado correctamente.' : 'Empleado creado correctamente.')
      setShowConfirmModal(false)
      router.push('/admin/empleados')
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al procesar el empleado'
      setApiError(message)
      notify.error(message)
    } finally {
      setIsPending(false)
    }
  }

  return {
    formData,
    errors,
    showConfirmModal,
    setShowConfirmModal,
    isPending,
    apiError,
    showPassword,
    setShowPassword,
    isEdit,
    handleChange,
    handlePreSubmit,
    handleConfirmSubmit
  }
}
