'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { RolEmpleado, AreaTrabajo } from '@/types'
import { getRolLabel, getAreaLabel } from '@/lib/empleado-utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EmpleadoConfirmData {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: RolEmpleado
  area_trabajo: AreaTrabajo
  contrasenia: string
}

interface ConfirmacionEmpleadoModalProps {
  isOpen: boolean
  isEdit: boolean
  isPending: boolean
  apiError: string | null
  formData: EmpleadoConfirmData
  onConfirm: () => Promise<void>
  onCancel: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Confirmation modal shown before creating/updating an employee.
 * Summarises the form data and provides confirm/cancel actions.
 *
 * Extracted from EmpleadoFormulario.tsx (lines 484–635).
 */
export default function ConfirmacionEmpleadoModal({
  isOpen,
  isEdit,
  isPending,
  apiError,
  formData,
  onConfirm,
  onCancel,
}: ConfirmacionEmpleadoModalProps) {
  if (!isOpen) return null

  return (
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
                  {isEdit ? 'Confirmar Actualización' : 'Confirmar Registro'}
                </h3>
                <p className="mt-0.5 text-sm text-blue-100">
                  Verifica los datos antes de continuar
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Summary rows */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <SummaryRow label="CUIL" value={formData.cuil} mono />
              <Divider />
              <SummaryRow
                label="Nombre completo"
                value={`${formData.nombre} ${formData.apellido}`}
              />
              <Divider />
              <SummaryRow
                label="Rol"
                value={getRolLabel(formData.rol_actual)}
                badge="blue"
              />
              <Divider />
              <SummaryRow
                label="Área"
                value={getAreaLabel(formData.area_trabajo)}
                badge="purple"
              />
              {formData.contrasenia && (
                <>
                  <Divider />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {isEdit ? 'Nueva contraseña' : 'Contraseña'}
                    </span>
                    <span className="font-mono text-sm text-gray-500">
                      {'•'.repeat(Math.min(formData.contrasenia.length, 10))}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Info message */}
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-blue-50 p-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-900">
                {isEdit
                  ? 'Los cambios se aplicarán inmediatamente al confirmar.'
                  : 'El empleado quedará registrado y disponible para asignaciones.'}
              </p>
            </div>

            {/* API error */}
            {apiError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900">Error al procesar</h4>
                  <p className="mt-1 text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-300 font-medium hover:bg-gray-100"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
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
  )
}

// ---------------------------------------------------------------------------
// Local helper subcomponents
// ---------------------------------------------------------------------------

function Divider() {
  return <div className="h-px bg-gray-200" />
}

function SummaryRow({
  label,
  value,
  mono = false,
  badge,
}: {
  label: string
  value: string
  mono?: boolean
  badge?: 'blue' | 'purple'
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      {badge ? (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            badge === 'blue'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {value}
        </span>
      ) : (
        <span
          className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </span>
      )}
    </div>
  )
}
