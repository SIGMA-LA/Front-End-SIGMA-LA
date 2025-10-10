import api from './api/api'
import type { OrdenProduccion } from '@/types'

/* Obtiene órdenes de producción activas (aprobadas por coordinación)*/
export const getOrdenesValidadas = async (): Promise<OrdenProduccion[]> => {
  const { data } = await api.get<OrdenProduccion[]>(
    '/ordenes-produccion/validadas'
  )
  return data
}

/* Obtiene órdenes de producción en produccion*/
export const getOrdenesEnProduccion = async (): Promise<OrdenProduccion[]> => {
  const { data } = await api.get<OrdenProduccion[]>(
    '/ordenes-produccion/en-produccion'
  )
  return data
}

/*Obtiene todas las órdenes de producción de una obra*/
export const getOrdenesByObra = async (
  cod_obra: number
): Promise<OrdenProduccion[]> => {
  const { data } = await api.get<OrdenProduccion[]>(
    `/ordenes-produccion/obra/${cod_obra}`
  )
  return data
}

export const getOrdenesByObraAndFinalizada = async (
  cod_obra: number
): Promise<OrdenProduccion[]> => {
  const { data } = await api.get<OrdenProduccion[]>(
    `/ordenes-produccion/obra/${cod_obra}/finalizada`
  )
  return data
}

/*Inicia la producción de una orden (cambia el estado de la OP y obra a EN PRODUCCION)*/
export const iniciarProduccion = async (cod_op: number): Promise<void> => {
  await api.post(`/ordenes-produccion/${cod_op}/iniciar`)
}

/*Finaliza la producción de una orden (cambia el estado de la OP a FINALIZADA)*/
export const finalizarProduccion = async (cod_op: number): Promise<void> => {
  await api.post(`/ordenes-produccion/${cod_op}/finalizar`)
}

export default {
  getOrdenesValidadas,
  getOrdenesEnProduccion,
  getOrdenesByObra,
  getOrdenesByObraAndFinalizada,
  iniciarProduccion,
  finalizarProduccion,
}
