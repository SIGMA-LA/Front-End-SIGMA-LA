export type RolEmpleado = 'ADMIN' | 'VENTAS' | 'COORDINACION' | 'PRODUCCION' | 'PLANTA' | 'VISITADOR'

export type AreaTrabajo = 
  | 'COORDINACION' 
  | 'VENTAS' 
  | 'PRODUCCION' 
  | 'CORTE' 
  | 'MECANIZADO' 
  | 'ENSAMBLE' 
  | 'ALMACEN' 
  | 'ATENCION_CLIENTE' 
  | 'COMPRAS' 
  | 'RECURSOS_HUMANOS' 
  | 'FINANZAS'
  | 'ADMINISTRACION'
  | 'PLANTA'

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

