import api from './api/api'

interface ParametroViatico {
  viatico_dia_persona: number
}

class ParametroService {
  private baseURL = '/parametros'

  async getActualViatico(): Promise<ParametroViatico> {
    try {
      const { data } = await api.get<ParametroViatico>(`${this.baseURL}/actual/viatico`)
      return data
    } catch (error) {
      console.error('Error al obtener el parámetro de viático:', error)
      return { viatico_dia_persona: 0 }
    }
  }
}

export default new ParametroService()