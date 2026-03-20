export type TipoCliente = 'PERSONA' | 'EMPRESA'

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
