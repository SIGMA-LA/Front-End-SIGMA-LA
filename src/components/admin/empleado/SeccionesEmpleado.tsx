import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ROLES_VALIDOS, AREAS_VALIDAS } from '@/lib/empleado-utils'
import type { RolEmpleado, AreaTrabajo } from '@/types'

interface EmpleadoFormData {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: RolEmpleado
  area_trabajo: AreaTrabajo
  contrasenia: string
}

interface EmpleadoFormErrors {
  cuil?: string
  nombre?: string
  apellido?: string
  rol_actual?: string
  area_trabajo?: string
  contrasenia?: string
}

interface SectionProps {
  formData: EmpleadoFormData
  errors: EmpleadoFormErrors
  handleChange: (field: keyof EmpleadoFormData, value: string) => void
}

export function InfoPersonal({ formData, errors, handleChange, isEdit }: SectionProps & { isEdit: boolean }) {
  return (
    <div>
      <div className="mb-6 border-b border-gray-200 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
        <p className="mt-1 text-sm text-gray-600">Datos de identificación del empleado</p>
      </div>
      <div className="space-y-6">
        <div className="max-w-md">
          <Label htmlFor="cuil" className="block text-sm font-semibold text-gray-700">
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
              <AlertTriangle className="h-3.5 w-3.5" /> No se puede modificar
            </p>
          )}
          {errors.cuil && (
            <p className="mt-2 flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {errors.cuil}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="nombre" className="block text-sm font-semibold text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Juan"
              className="mt-2 h-11 w-full border-gray-300 text-base"
              maxLength={50}
            />
            {errors.nombre && (
              <p className="mt-2 text-sm text-red-700 font-medium">{errors.nombre}</p>
            )}
          </div>
          <div>
            <Label htmlFor="apellido" className="block text-sm font-semibold text-gray-700">
              Apellido <span className="text-red-500">*</span>
            </Label>
            <Input
              id="apellido"
              value={formData.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              placeholder="Ej: Pérez"
              className="mt-2 h-11 w-full border-gray-300 text-base"
              maxLength={50}
            />
            {errors.apellido && (
              <p className="mt-2 text-sm text-red-700 font-medium">{errors.apellido}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function InfoLaboral({ formData, handleChange }: SectionProps) {
  return (
    <div>
      <div className="mb-6 border-b border-gray-200 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Información Laboral</h3>
        <p className="mt-1 text-sm text-gray-600">Rol y área de trabajo asignados</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="rol_actual" className="block text-sm font-semibold text-gray-700">
            Rol <span className="text-red-500">*</span>
          </Label>
          <select
            id="rol_actual"
            value={formData.rol_actual}
            onChange={(e) => handleChange('rol_actual', e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-base focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {ROLES_VALIDOS.map((rol) => (
              <option key={rol.value} value={rol.value}>{rol.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="area_trabajo" className="block text-sm font-semibold text-gray-700">
            Área de Trabajo <span className="text-red-500">*</span>
          </Label>
          <select
            id="area_trabajo"
            value={formData.area_trabajo}
            onChange={(e) => handleChange('area_trabajo', e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-base focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {AREAS_VALIDAS.map((area) => (
              <option key={area.value} value={area.value}>{area.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export function SeguridadAcceso({ formData, errors, handleChange, showPassword, setShowPassword, isEdit }: SectionProps & { showPassword: boolean, setShowPassword: (v: boolean) => void, isEdit: boolean }) {
  return (
    <div>
      <div className="mb-6 border-b border-gray-200 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Seguridad y Acceso</h3>
        <p className="mt-1 text-sm text-gray-600">Credenciales para acceso al sistema (opcional)</p>
      </div>
      <div className="space-y-6">
        <div className="max-w-md">
          <Label htmlFor="contrasenia" className="block text-sm font-semibold text-gray-700">
            Contraseña <span className="font-normal text-gray-500">{isEdit ? '(opcional - dejar vacío para mantener)' : '(opcional)'}</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="contrasenia"
              type={showPassword ? 'text' : 'password'}
              value={formData.contrasenia}
              onChange={(e) => handleChange('contrasenia', e.target.value)}
              className="h-11 w-full border-gray-300 pr-10"
              placeholder={isEdit ? 'Mantener actual' : 'Solo si tendrá acceso'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.contrasenia && (
            <p className="mt-2 text-sm text-red-700 font-medium">{errors.contrasenia}</p>
          )}
        </div>
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-5">
           <div className="flex gap-4">
             <AlertTriangle className="h-5 w-5 text-blue-600 mt-1" />
             <div className="text-sm text-blue-800">
               <p className="font-semibold">Información importante:</p>
               <ul className="mt-2 list-disc list-inside space-y-1">
                 <li>La contraseña habilita el inicio de sesión.</li>
                 <li>Si no se define, el registro será solo para asignación de tareas.</li>
               </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
