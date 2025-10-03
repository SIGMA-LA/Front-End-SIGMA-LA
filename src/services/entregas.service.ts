import api from './api/api'
import { Entrega } from '../types'

interface BackendEntrega {
  id: number
  obraId: number
  encargadoId: number
  fechaEntrega: string
  estado: 'PENDIENTE' | 'ENTREGADA' | 'EN CURSO' | 'CANCELADA'
  observaciones?: string
}

// Función para mapear datos del backend al frontend
const mapToFrontend = (backendEntrega: BackendEntrega): Entrega => {
  return {
    id: backendEntrega.id,
    obra: {
      id: backendEntrega.obraId,
      direccion: `Obra ${backendEntrega.obraId}`, // Placeholder hasta obtener datos reales
      cliente: {
        id: 0,
        nombre: 'Cliente',
        apellido: `${backendEntrega.obraId}`,
        telefono: '123-456-789',
        email: 'cliente@ejemplo.com',
      },
      descripcion: `Descripción de obra ${backendEntrega.obraId}`,
      presupuesto: 0,
      fechaInicio: backendEntrega.fechaEntrega,
      estado: 'en_progreso',
    },
    fecha: backendEntrega.fechaEntrega,
    hora: '09:00', // Placeholder - debería venir del backend
    estado: backendEntrega.estado,
    encargadoAsignado: `Encargado ${backendEntrega.encargadoId}`,
    productos: ['Producto 1', 'Producto 2'], // Placeholder - debería venir del backend
    direccionEntrega: `Dirección de obra ${backendEntrega.obraId}`,
    observaciones: backendEntrega.observaciones || 'Sin observaciones',
    vehiculo: undefined,
    documentos: [],
  }
}

class EntregasService {
  private baseURL = '/entregas'

  async getEntregasByEstado(
    cuilEmpleado: string,
    estado: 'PENDIENTE' | 'ENTREGADA' | 'EN CURSO' | 'CANCELADA'
  ): Promise<Entrega[]> {
    try {
      // Usar la ruta específica del backend: /:cuil_empleado/:estado
      const url = `${this.baseURL}/${cuilEmpleado}/${estado}`

      const { data } = await api.get<BackendEntrega[]>(url)

      const mappedData = data.map(mapToFrontend)

      return mappedData
    } catch (error) {
      console.error(
        `Error al obtener entregas con estado ${estado} del empleado ${cuilEmpleado}:`,
        error
      )

      // Modo fallback: devolver datos mock si el backend no está disponible
      return this.getMockData(cuilEmpleado, estado)
    }
  }

  // Método temporal para datos mock
  private getMockData(cuilEmpleado: string, estado: string): Entrega[] {
    const mockBackendData: BackendEntrega[] = [
      {
        id: 1,
        obraId: 101,
        encargadoId: parseInt(cuilEmpleado),
        fechaEntrega: '2024-10-15',
        estado: estado as any,
        observaciones: 'Entrega de materiales de construcción',
      },
      {
        id: 2,
        obraId: 102,
        encargadoId: parseInt(cuilEmpleado),
        fechaEntrega: '2024-10-16',
        estado: estado as any,
        observaciones: 'Entrega de herramientas',
      },
    ]

    return mockBackendData.map(mapToFrontend)
  }

  async getEntregasPendientes(cuilEmpleado: string): Promise<Entrega[]> {
    return this.getEntregasByEstado(cuilEmpleado, 'PENDIENTE')
  }

  async getEntregasEntregadas(cuilEmpleado: string): Promise<Entrega[]> {
    return this.getEntregasByEstado(cuilEmpleado, 'ENTREGADA')
  }

  async finalizarEntrega(id: number, observaciones: string): Promise<void> {
    try {
      await api.post(`${this.baseURL}/${id}/finalizar`, { observaciones })
    } catch (error) {
      console.error(`Error al finalizar entrega ${id}:`, error)
      throw error
    }
  }
}

export const entregasService = new EntregasService()

// Exportar también las funciones individuales para compatibilidad
export const finalizarEntrega = (id: number, observaciones: string) =>
  entregasService.finalizarEntrega(id, observaciones)

export const obtenerEntregasDeEncargado = async (cuil: string) => {
  // Devolver tanto pendientes como entregadas
  const [pendientes, entregadas] = await Promise.all([
    entregasService.getEntregasPendientes(cuil),
    entregasService.getEntregasEntregadas(cuil),
  ])
  return { pendientes, entregadas }
}
