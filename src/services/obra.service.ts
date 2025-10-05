import api from './api/api'
import type { Obra } from '@/types'

interface BackendObra {
  cod_obra: number
  direccion: string
  cliente: {
    cuil: string
    razon_social: string
    telefono: string
    mail: string
  }
  nota_fabrica: string
  fecha_ini: string
  fecha_cancelacion: string | null
  estado:
    | 'ACTIVA'
    | 'EN PRODUCCION'
    | 'FINALIZADA'
    | 'ENTREGADA'
    | 'CANCELADA'
    | 'EN ESPERA DE STOCK'
  localidad?: {
    cod_postal: number
    nombre_localidad: string
  }
}

export interface ObraFormData {
  direccion: string
  nota_fabrica: string
  fecha_ini: string
  fecha_cancelacion: string | null
  estado:
    | 'ACTIVA'
    | 'EN PRODUCCION'
    | 'FINALIZADA'
    | 'ENTREGADA'
    | 'CANCELADA'
    | 'EN ESPERA DE STOCK'
  cuil_cliente: string
  cod_postal: number
}

const mapToFrontend = (obra: BackendObra): Obra => ({
  cod_obra: obra.cod_obra,
  direccion: obra.direccion,
  cliente: {
    cuil: obra.cliente?.cuil ?? '',
    razon_social: obra.cliente?.razon_social ?? 'No disponible',
    telefono: obra.cliente?.telefono ?? '',
    mail: obra.cliente?.mail ?? '',
  },
  nota_fabrica: obra.nota_fabrica,
  fecha_ini: obra.fecha_ini,
  fecha_cancelacion: obra.fecha_cancelacion,
  estado: obra.estado,
  localidad: obra.localidad,
  cod_postal: obra.localidad?.cod_postal ?? 0,
  cuil_cliente: obra.cliente?.cuil ?? '',
})

const mapToBackend = (obraData: ObraFormData): any => {
  const payload: any = {
    direccion: obraData.direccion,
    estado: obraData.estado,
    cod_postal: obraData.cod_postal,
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
  console.log(`ID recibido en findById: ${id}`)
  const { data } = await api.get<BackendObra>(`/obras/${id}`)
  return mapToFrontend(data)
}

export const getObras = async (): Promise<Obra[]> => {
  const { data } = await api.get<BackendObra[]>('/obras')
  return data.map(mapToFrontend)
}

/**
 * Crea una nueva obra.
 * @param obraData - Datos de la obra en formato frontend.
 * @returns La nueva obra creada, formateada para el frontend.
 */
export const createObra = async (obraData: ObraFormData): Promise<Obra> => {
  const payload = mapToBackend(obraData)
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

/**
 * Elimina una obra por su ID.
 * @param id - El ID (cod_obra) de la obra a eliminar.
 */
export const deleteObra = async (id: number): Promise<void> => {
  await api.delete(`/obras/${id}`)
}
