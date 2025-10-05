import api from './api/api'
import type { Empleado } from '@/types'

interface BackendEmpleado {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
}

export interface CreateEmpleadoDTO {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
}

export interface UpdateEmpleadoDTO {
  nombre?: string
  apellido?: string
  rol_actual?: string
  area_trabajo?: string
}

const mapToFrontend = (empleado: BackendEmpleado): Empleado => ({
  cuil: empleado.cuil,
  nombre: empleado.nombre,
  apellido: empleado.apellido,
  rol_actual: empleado.rol_actual,
  area_trabajo: empleado.area_trabajo,
})

const mapToBackend = (
  empleadoData: CreateEmpleadoDTO | UpdateEmpleadoDTO
): any => ({
  ...empleadoData,
})

class EmpleadoService {
  private baseURL = '/empleados'

  /**
   * Obtiene todos los empleados del backend.
   */
  async getAllEmpleados(): Promise<Empleado[]> {
    const { data } = await api.get<BackendEmpleado[]>(this.baseURL)
    return data.map(mapToFrontend)
  }

  /**
   * Obtiene solo los visitadores (empleados con rol_actual = 'visitador').
   */
  async getVisitadores(): Promise<Empleado[]> {
    try {
      const todosLosEmpleados = await this.getAllEmpleados()
      return todosLosEmpleados.filter(
        (emp) => emp.rol_actual.toLowerCase() === 'visitador'
      )
    } catch (error) {
      console.error('Error al obtener visitadores:', error)
      throw error
    }
  }

  /**
   * Obtiene un empleado específico por su CUIL.
   */
  async getEmpleadoByCuil(cuil: string): Promise<Empleado> {
    const { data } = await api.get<BackendEmpleado>(`${this.baseURL}/${cuil}`)
    return mapToFrontend(data)
  }

  /**
   * Crea un nuevo empleado.
   */
  async createEmpleado(empleadoData: CreateEmpleadoDTO): Promise<Empleado> {
    const payload = mapToBackend(empleadoData)
    const { data } = await api.post<BackendEmpleado>(this.baseURL, payload)
    return mapToFrontend(data)
  }

  /**
   * Actualiza un empleado existente.
   */
  async updateEmpleado(
    cuil: string,
    empleadoData: UpdateEmpleadoDTO
  ): Promise<Empleado> {
    const payload = mapToBackend(empleadoData)
    const { data } = await api.put<BackendEmpleado>(
      `${this.baseURL}/${cuil}`,
      payload
    )
    return mapToFrontend(data)
  }

  /**
   * Elimina un empleado por su CUIL.
   */
  async deleteEmpleado(cuil: string): Promise<void> {
    await api.delete(`${this.baseURL}/${cuil}`)
  }
}

export default new EmpleadoService()
