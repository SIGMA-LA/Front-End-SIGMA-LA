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

export interface PerfilFormData {
  nombre: string
  apellido: string
  cuil: string
}
