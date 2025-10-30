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
  contrasenia?: string // OPCIONAL - Solo para empleados con acceso al sistema
}

export interface UpdateEmpleadoDTO {
  nombre?: string
  apellido?: string
  rol_actual?: string
  area_trabajo?: string
  contrasenia?: string // Opcional en UPDATE
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

  async getDisponiblesParaEntrega(): Promise<Empleado[]> {
    try {
      const { data } = await api.get<BackendEmpleado[]>(`${this.baseURL}/disponibles-entrega`)
      return data.map(mapToFrontend)
    } catch (error) {
      console.error('Error al obtener empleados disponibles para entrega:', error)
      throw error
    }
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
   * La contraseña es OPCIONAL. Si se proporciona, el empleado podrá acceder al sistema.
   * Sin contraseña, el empleado solo estará registrado para información/asignación a tareas.
   */
  async createEmpleado(empleadoData: CreateEmpleadoDTO): Promise<Empleado> {
    // Validación frontend de contraseña (solo si se proporciona)
    if (empleadoData.contrasenia) {
      if (empleadoData.contrasenia.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }
      if (empleadoData.contrasenia.length > 50) {
        throw new Error('La contraseña no debe superar los 50 caracteres')
      }
    }

    const payload = mapToBackend(empleadoData)
    const response = await api.post<any>(this.baseURL, payload)
    
    // El backend retorna { success: true, message: '...', data: empleado }
    const empleado = response.data.data || response.data
    return mapToFrontend(empleado)
  }

  /**
   * Actualiza un empleado existente.
   * La contraseña es OPCIONAL. Si se proporciona, debe tener entre 6 y 50 caracteres.
   */
  async updateEmpleado(
    cuil: string,
    empleadoData: UpdateEmpleadoDTO
  ): Promise<Empleado> {
    // Validación frontend de contraseña (si se proporciona)
    if (empleadoData.contrasenia !== undefined) {
      if (empleadoData.contrasenia.trim() === '') {
        throw new Error('La contraseña no puede estar vacía')
      }
      if (empleadoData.contrasenia.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }
      if (empleadoData.contrasenia.length > 50) {
        throw new Error('La contraseña no debe superar los 50 caracteres')
      }
    }

    const payload = mapToBackend(empleadoData)
    const response = await api.put<any>(`${this.baseURL}/${cuil}`, payload)
    
    // El backend retorna { success: true, message: '...', data: empleado }
    const empleado = response.data.data || response.data
    return mapToFrontend(empleado)
  }

  /**
   * Elimina un empleado por su CUIL.
   */
  async deleteEmpleado(cuil: string): Promise<void> {
    await api.delete(`${this.baseURL}/${cuil}`)
  }
}

export default new EmpleadoService()
