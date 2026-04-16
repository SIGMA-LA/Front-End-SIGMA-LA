'use client'

import { User } from 'lucide-react'
import ConfirmacionEmpleadoModal from '@/components/admin/ConfirmacionEmpleadoModal'
import { Button } from '@/components/ui/Button'
import type { Empleado, CreateEmpleadoData, UpdateEmpleadoData } from '@/types'
import useEmpleadoForm from '@/hooks/useEmpleadoForm'
import { InfoPersonal, InfoLaboral, SeguridadAcceso } from './empleado/SeccionesEmpleado'

/**
 * Main form for creating or editing an employee (empleado).
 * Uses useEmpleadoForm for logic and SeccionesEmpleado for modular UI parts.
 */
export default function EmpleadoFormulario({
  empleado,
  onSubmit,
}: {
  empleado?: Empleado | null
  onSubmit: (data: CreateEmpleadoData | UpdateEmpleadoData) => Promise<void>
}) {
  const {
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
  } = useEmpleadoForm(empleado, onSubmit)

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-white text-left">
                {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h2>
              <p className="text-sm text-blue-100 text-left">
                {isEdit ? 'Actualiza la información del empleado' : 'Registra un nuevo empleado en el sistema'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePreSubmit} className="p-8 space-y-10">
          <InfoPersonal 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
            isEdit={isEdit} 
          />
          
          <InfoLaboral 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
          />
          
          <SeguridadAcceso 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isEdit={isEdit}
          />

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-8 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={() => window.history.back()}
              variant="outline"
              className="h-11 w-full text-base sm:w-auto sm:px-8 border-gray-300"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 w-full bg-blue-600 hover:bg-blue-700 text-base font-semibold sm:w-auto sm:px-8 text-white"
              disabled={isPending}
            >
              {isPending ? 'Procesando...' : isEdit ? 'Guardar Cambios' : 'Crear Empleado'}
            </Button>
          </div>
        </form>
      </div>

      <ConfirmacionEmpleadoModal
        isOpen={showConfirmModal}
        isEdit={isEdit}
        isPending={isPending}
        apiError={apiError}
        formData={formData}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  )
}
