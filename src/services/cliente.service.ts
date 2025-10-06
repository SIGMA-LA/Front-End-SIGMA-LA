//cliente.service.ts
import api from './api/api'
import type { Cliente } from '@/types'

interface BackendCliente {
  cuil: string
  razon_social: string
  telefono: string
  mail: string
}

export interface CreateClienteDTO {
  cuil: string
  razon_social: string
  telefono: string
  mail: string
}

export interface UpdateClienteDTO {
  razon_social?: string
  telefono?: string
  mail?: string
}

const mapToFrontend = (cliente: BackendCliente): Cliente => ({
  cuil: cliente.cuil,
  razon_social: cliente.razon_social,
  telefono: cliente.telefono,
  mail: cliente.mail,
})

const mapToBackend = (
  clienteData: CreateClienteDTO | UpdateClienteDTO
): any => ({
  cuil: 'cuil' in clienteData ? clienteData.cuil : undefined,
  razon_social: clienteData.razon_social,
  telefono: clienteData.telefono,
  mail: clienteData.mail,
})

class ClienteService {
  private baseURL = '/clientes'

  /**
   * Obtiene todos los clientes del backend y los formatea para el frontend.
   * @returns Lista de clientes formateados.
   */
  async getAllClientes(): Promise<Cliente[]> {
    const { data } = await api.get<BackendCliente[]>(this.baseURL)
    return data.map(mapToFrontend)
  }

  /**
   * Obtiene un cliente específico por su CUIL.
   * @param cuil - CUIL del cliente a buscar.
   * @returns Cliente formateado para el frontend.
   */
  async getClienteByCuil(cuil: string): Promise<Cliente> {
    const { data } = await api.get<BackendCliente>(`${this.baseURL}/${cuil}`)
    return mapToFrontend(data)
  }

  /**
   * Crea un nuevo cliente.
   * @param clienteData - Datos del cliente en formato de formulario.
   * @returns El nuevo cliente creado, formateado para el frontend.
   */
  async createCliente(clienteData: CreateClienteDTO): Promise<Cliente> {
    const payload = mapToBackend(clienteData)
    console.log('Payload enviado al backend:', payload)
    const { data } = await api.post<BackendCliente>(this.baseURL, payload)
    return mapToFrontend(data)
  }

  /**
   * Actualiza un cliente existente.
   * @param cuil - CUIL del cliente a actualizar.
   * @param clienteData - Los datos a actualizar, en formato de formulario.
   * @returns El cliente actualizado, formateado para el frontend.
   */
  async updateCliente(
    cuil: string,
    clienteData: UpdateClienteDTO
  ): Promise<Cliente> {
    const payload = mapToBackend(clienteData)
    const { data } = await api.put<BackendCliente>(
      `${this.baseURL}/${cuil}`,
      payload
    )
    return mapToFrontend(data)
  }

  /**
   * Elimina un cliente por su CUIL.
   * @param cuil - CUIL del cliente a eliminar.
   */
  async deleteCliente(cuil: string): Promise<void> {
    await api.delete(`${this.baseURL}/${cuil}`)
  }

  /**
   * Obtiene todas las obras asociadas a un cliente.
   * @param cuil - CUIL del cliente.
   * @returns Lista de obras del cliente.
   */
  async getClienteObras(cuil: string): Promise<any[]> {
    const { data } = await api.get(`${this.baseURL}/${cuil}/obras`)
    return data
  }
}

export default new ClienteService()
