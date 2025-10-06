import api from './api/api'
import type { Maquinaria } from '@/types'

export interface CreateMaquinariaDTO {
  descripcion: string
}

export interface MaquinariaConDisponibilidad extends Maquinaria {
  isDisponibleEnFecha: boolean
}

export interface UpdateMaquinariaDTO {
  descripcion?: string
  estado?: Maquinaria['estado']
}

interface BackendMaquinaria {
  cod_maquina: number
  descripcion: string
  estado: Maquinaria['estado']
}

class MaquinariaService {
  private baseURL = '/maquinarias'

  async getAllMaquinarias(): Promise<Maquinaria[]> {
    const { data } = await api.get<BackendMaquinaria[]>(this.baseURL)
    return data.map(this.mapToFrontend)
  }

  async getMaquinariasDisponibles(): Promise<Maquinaria[]> {
    const { data } = await api.get<BackendMaquinaria[]>(
      `${this.baseURL}/disponibles`
    )
    return data.map(this.mapToFrontend)
  }

  async getDisponibilidadPorFecha(fechaInicioISO: string, fechaFinISO: string): Promise<MaquinariaConDisponibilidad[]> {
    const { data } = await api.get<MaquinariaConDisponibilidad[]>(`${this.baseURL}/disponibilidad`, {
      params: {
        fecha_hora_inicio: fechaInicioISO,
        fecha_hora_fin: fechaFinISO,
      }
    })
    return data
  }

  async getMaquinariaById(id: number): Promise<Maquinaria> {
    const { data } = await api.get<BackendMaquinaria>(`${this.baseURL}/${id}`)
    return this.mapToFrontend(data)
  }

  async createMaquinaria(
    maquinariaData: CreateMaquinariaDTO
  ): Promise<Maquinaria> {
    const { data } = await api.post<BackendMaquinaria>(this.baseURL, {
      descripcion: maquinariaData.descripcion,
      estado: 'DISPONIBLE',
    })
    return this.mapToFrontend(data)
  }

  async updateMaquinaria(
    id: number,
    maquinariaData: UpdateMaquinariaDTO
  ): Promise<Maquinaria> {
    const { data } = await api.put<BackendMaquinaria>(
      `${this.baseURL}/${id}`,
      maquinariaData
    )
    return this.mapToFrontend(data)
  }

  async updateEstadoMaquinaria(
    id: number,
    estado: Maquinaria['estado']
  ): Promise<Maquinaria> {
    const { data } = await api.patch<BackendMaquinaria>(
      `${this.baseURL}/${id}/estado`,
      { estado }
    )
    return this.mapToFrontend(data)
  }

  async deleteMaquinaria(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`)
  }

  private mapToFrontend(maquinaria: BackendMaquinaria): Maquinaria {
    return {
      cod_maquina: maquinaria.cod_maquina,
      descripcion: maquinaria.descripcion,
      estado: maquinaria.estado,
    }
  }
}

const maquinariaService = new MaquinariaService()
export default maquinariaService
