export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export interface ParametroViatico {
  viatico_dia_persona: number
}

export interface NotificacionItem {
  id: string
  label: string
}

export interface NotificacionConfig {
  canales: NotificacionItem[]
  eventos: NotificacionItem[]
}

export interface NotificacionesData {
  configuracion: NotificacionConfig
  valores: Record<string, boolean>
}

export interface PerfilFormData {
  nombre: string
  apellido: string
  cuil: string
  mail?: string
  notificaciones?: NotificacionesData | Record<string, boolean>
}

export interface ValidationIssue {
  path: string
  message: string
}

export interface ValidationDetail {
  location: string
  issues: ValidationIssue[]
}

export interface BackendErrorData {
  message?: string
  error?: string
  errorCode?: string
  status?: string
  details?: ValidationDetail[] | string[]
}


