import { AREAS_TRABAJO, ROLES_EMPLEADO } from '@/constants'

export type RolEmpleado = (typeof ROLES_EMPLEADO)[number]

export type AreaTrabajo = (typeof AREAS_TRABAJO)[number]

export interface CreateEmpleadoData {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: RolEmpleado
  area_trabajo: AreaTrabajo
  contrasenia?: string
}

export interface UpdateEmpleadoData {
  nombre?: string
  apellido?: string
  rol_actual?: RolEmpleado
  area_trabajo?: AreaTrabajo
  contrasenia?: string
}

export interface Empleado {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: RolEmpleado
  area_trabajo: AreaTrabajo
  contrasenia?: string
}
