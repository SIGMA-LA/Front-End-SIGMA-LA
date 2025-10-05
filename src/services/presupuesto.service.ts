import api from './api/api'
import type { Presupuesto } from '@/types'

export interface PresupuestoFormData {
  nro_presupuesto?: number
  valor: number
  fecha_emision: string
  fecha_aceptacion?: string
}

interface CreatePresupuestoDTO {
  valor: number
  cod_obra: number
  fecha_emision: string
  fecha_aceptacion?: string
}

const mapToFrontend = (presupuesto: any): Presupuesto => ({
  nro_presupuesto: presupuesto.nro_presupuesto,
  cod_obra: presupuesto.cod_obra,
  fecha_emision: presupuesto.fecha_emision,
  fecha_aceptacion: presupuesto.fecha_aceptacion,
  valor: presupuesto.valor,
})

class PresupuestoService {
  private baseURL = '/presupuestos'

  async createPresupuesto(
    presupuestoData: PresupuestoFormData,
    cod_obra: number
  ): Promise<Presupuesto> {
    const payload: CreatePresupuestoDTO = {
      valor: presupuestoData.valor,
      cod_obra,
      fecha_emision: presupuestoData.fecha_emision,
    }

    if (presupuestoData.fecha_aceptacion) {
      payload.fecha_aceptacion = presupuestoData.fecha_aceptacion
    }

    const { data } = await api.post<any>(this.baseURL, payload)
    return mapToFrontend(data)
  }

  async updatePresupuesto(
    nro_presupuesto: number,
    presupuestoData: Partial<PresupuestoFormData>
  ): Promise<Presupuesto> {
    // Construir payload solo con campos que tienen valores válidos
    const payload: any = {}

    // Valor es requerido
    if (presupuestoData.valor !== undefined && presupuestoData.valor !== null) {
      payload.valor = presupuestoData.valor
    }

    // Fecha emisión - solo agregar si existe y es válida
    if (
      presupuestoData.fecha_emision &&
      presupuestoData.fecha_emision.trim() !== ''
    ) {
      payload.fecha_emision = presupuestoData.fecha_emision
    }

    // Fecha aceptación - puede ser null o undefined para indicar que no hay fecha
    if (presupuestoData.fecha_aceptacion !== undefined) {
      if (
        presupuestoData.fecha_aceptacion &&
        presupuestoData.fecha_aceptacion.trim() !== ''
      ) {
        payload.fecha_aceptacion = presupuestoData.fecha_aceptacion
      } else {
        // Si viene vacío, explícitamente establecer como null
        payload.fecha_aceptacion = null
      }
    }

    console.log('Payload a enviar:', payload) // Para debugging
    console.log('nro_presupuesto:', nro_presupuesto) // Para debugging

    try {
      const { data } = await api.put<any>(
        `${this.baseURL}/${nro_presupuesto}`,
        payload
      )
      return mapToFrontend(data)
    } catch (error: any) {
      console.error(
        'Error al actualizar presupuesto:',
        error.response?.data || error
      )

      // Mostrar detalles específicos del error de validación
      if (error.response?.data?.errors) {
        console.error(
          'Errores de validación detallados:',
          JSON.stringify(error.response.data.errors, null, 2)
        )
      }

      throw error
    }
  }
}

export default new PresupuestoService()
