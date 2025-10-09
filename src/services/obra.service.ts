import api from './api/api'
import type { Obra, Presupuesto } from '@/types'

interface BackendObra {
  cod_obra: number
  direccion: string
  cliente: {
    cuil: string
    razon_social?: string
    telefono: string
    mail: string
    nombre?: string
    apellido?: string
    tipo_cliente: 'PERSONA' | 'EMPRESA'
    sexo?: string
  }
  nota_fabrica?: string
  fecha_ini: string
  fecha_cancelacion: string | null
  estado:
    | 'EN ESPERA DE PAGO'
    | 'PAGADA PARCIALMENTE'
    | 'EN ESPERA DE STOCK'
    | 'EN PRODUCCION'
    | 'PRODUCCION FINALIZADA'
    | 'PAGADA TOTALMENTE'
    | 'ENTREGADA'
    | 'CANCELADA'
  localidad?: {
    cod_localidad: number
    nombre_localidad: string
    cod_provincia: number
  }
  presupuesto?: Presupuesto[]
}

export interface ObraFormData {
  direccion: string
  nota_fabrica?: string
  fecha_ini: string
  fecha_cancelacion?: string | null
  estado:
    | 'EN ESPERA DE PAGO'
    | 'PAGADA PARCIALMENTE'
    | 'EN ESPERA DE STOCK'
    | 'EN PRODUCCION'
    | 'PRODUCCION FINALIZADA'
    | 'PAGADA TOTALMENTE'
    | 'ENTREGADA'
    | 'CANCELADA'
  cuil_cliente: string
  cod_localidad: number
}

const mapToFrontend = (obra: BackendObra): Obra => ({
  cod_obra: obra.cod_obra,
  direccion: obra.direccion,
  cliente: {
    cuil: obra.cliente?.cuil ?? '',
    razon_social: obra.cliente?.razon_social ?? 'No disponible',
    telefono: obra.cliente?.telefono ?? '',
    mail: obra.cliente?.mail ?? '',
    nombre: obra.cliente?.nombre ?? '',
    apellido: obra.cliente?.apellido ?? '',
    sexo: obra.cliente?.sexo ?? '',
    tipo_cliente: obra.cliente?.tipo_cliente ?? '',
  },
  nota_fabrica: obra.nota_fabrica,
  fecha_ini: obra.fecha_ini,
  fecha_cancelacion: obra.fecha_cancelacion,
  estado: obra.estado,
  localidad: obra.localidad,
  cod_localidad: obra.localidad?.cod_localidad ?? 0,
  cuil_cliente: obra.cliente?.cuil ?? '',
  presupuesto: obra.presupuesto || [],
})

const mapToBackend = (obraData: ObraFormData): any => {
  const payload: any = {
    direccion: obraData.direccion,
    estado: obraData.estado,
    cod_localidad: obraData.cod_localidad,
    cuil: obraData.cuil_cliente,
    fecha_ini: obraData.fecha_ini,
  }

  if (obraData.nota_fabrica && obraData.nota_fabrica.trim() !== '') {
    payload.nota_fabrica = obraData.nota_fabrica
  }

  if (obraData.fecha_cancelacion) {
    payload.fecha_cancelacion = obraData.fecha_cancelacion
  }

  return payload
}

/**
 * Obtiene todas las obras del backend y las formatea para el frontend.
 */
export const getObraById = async (id: number): Promise<Obra> => {
  const { data } = await api.get<BackendObra>(`/obras/${id}`)
  return mapToFrontend(data)
}

export const getObras = async (): Promise<Obra[]> => {
  const { data } = await api.get<BackendObra[]>('/obras')
  return data.map(mapToFrontend)
}

/**
 * Obtiene obras que tienen nota de fábrica pero NO tienen órdenes APROBADAS o EN PRODUCCION
 */
export const getNotasSinOrdenAprobada = async (): Promise<Obra[]> => {
  const { data } = await api.get<BackendObra[]>(
    '/obras/notas-sin-orden-aprobada'
  )
  return data.map(mapToFrontend)
}

/**
 * Obtiene obras EN PRODUCCION con nota de fábrica que tienen órdenes en proceso
 */
export const getNotasConOrdenEnProceso = async (): Promise<Obra[]> => {
  const { data } = await api.get<BackendObra[]>(
    '/obras/notas-con-orden-proceso'
  )
  return data.map(mapToFrontend)
}

/**
 * Crea una nueva obra.
 * @param obraData - Datos de la obra en formato frontend.
 * @returns La nueva obra creada, formateada para el frontend.
 */
export const createObra = async (obraData: ObraFormData): Promise<Obra> => {
  const payload = mapToBackend(obraData)
  if (obraData.nota_fabrica && obraData.nota_fabrica.trim() !== '') {
    payload.nota_fabrica = obraData.nota_fabrica
  }
  const { data: nuevaObraBackend } = await api.post<BackendObra>(
    '/obras',
    payload
  )
  return mapToFrontend(nuevaObraBackend)
}

/**
 * Actualiza una obra existente.
 * @param id - El ID (cod_obra) de la obra a actualizar.
 * @param obraData - Los datos a actualizar, en formato frontend.
 * @returns La obra actualizada, formateada para el frontend.
 */
export const updateObra = async (
  id: number,
  obraData: ObraFormData
): Promise<Obra> => {
  const payload = mapToBackend(obraData)
  const { data: obraActualizadaBackend } = await api.put<BackendObra>(
    `/obras/${id}`,
    payload
  )
  return mapToFrontend(obraActualizadaBackend)
}
