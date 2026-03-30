import { TIPOS_CLIENTE } from '@/constants'

export type TipoCliente = (typeof TIPOS_CLIENTE)[number]

export interface Cliente {
  cuil: string
  razon_social?: string
  telefono: string
  mail: string
  apellido?: string
  nombre?: string
  sexo?: string
  tipo_cliente: TipoCliente
}
