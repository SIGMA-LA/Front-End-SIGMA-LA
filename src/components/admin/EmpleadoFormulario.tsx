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
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100/50">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                {isEdit ? 'Actualiza la información del empleado seleccionado' : 'Registra un nuevo empleado con sus roles y credenciales'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePreSubmit} className="p-8 space-y-12 bg-gray-50/30">
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
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-200 pt-8 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={() => window.history.back()}
              variant="outline"
              className="h-12 w-full rounded-xl text-base font-medium sm:w-auto sm:px-8 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold sm:w-auto sm:px-8 text-white transition-all shadow-md shadow-blue-500/20"
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
