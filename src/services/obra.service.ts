import api from './api/api'
import type { Obra } from '@/types'

interface BackendObra {
  cod_obra: number;
  direccion: string;
  cliente: {
    cuil: string;
    razon_social: string;
    telefono: string;
    mail: string;
  };
  nota_fabrica: string;
  fecha_ini: string;
  fecha_cancelacion: string | null;
  estado: 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada';
  localidad?: {
    cod_postal: number;
    nombre_localidad: string;
  };
}

export interface ObraFormData {
  direccion: string;
  nota_fabrica: string;
  fechaInicio: string;
  fechaFin: string | null;
  estado: 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada';
  cuil_cliente: string;
  cod_postal: number;
}

const mapToFrontend = (obra: BackendObra): Obra => ({
  id: obra.cod_obra,
  direccion: obra.direccion,
  cliente: {
    cuil: obra.cliente.cuil,
    razon_social: obra.cliente.razon_social,
    telefono: obra.cliente.telefono,
    mail: obra.cliente.mail,
  },
  nota_fabrica: obra.nota_fabrica,
  fechaInicio: obra.fecha_ini,
  fechaFin: obra.fecha_cancelacion,
  estado: obra.estado,
  localidad: obra.localidad,
});

const mapToBackend = (obraData: ObraFormData): any => ({
  direccion: obraData.direccion,
  fecha_ini: obraData.fechaInicio,
  fecha_cancelacion: obraData.fechaFin || null,
  estado: obraData.estado,
  cod_postal: obraData.cod_postal,
  cuil: obraData.cuil_cliente,
  nota_fabrica: obraData.nota_fabrica,
});

/**
 * Obtiene todas las obras del backend y las formatea para el frontend.
 */
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
  const { data: nuevaObraBackend } = await api.post<BackendObra>('/obras', payload)
  return mapToFrontend(nuevaObraBackend)
}

/**
 * Actualiza una obra existente.
 * @param id - El ID (cod_obra) de la obra a actualizar.
 * @param obraData - Los datos a actualizar, en formato frontend.
 * @returns La obra actualizada, formateada para el frontend.
 */
export const updateObra = async (id: number, obraData: ObraFormData): Promise<Obra> => {
  const payload = mapToBackend(obraData)
  const { data: obraActualizadaBackend } = await api.put<BackendObra>(`/obras/${id}`, payload)
  return mapToFrontend(obraActualizadaBackend)
}

/**
 * Elimina una obra por su ID.
 * @param id - El ID (cod_obra) de la obra a eliminar.
 */
export const deleteObra = async (id: number): Promise<void> => {
  await api.delete(`/obras/${id}`)
}