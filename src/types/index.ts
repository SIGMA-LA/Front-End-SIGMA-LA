export interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
}

export interface Documento {
  id: number
  nombre: string
  url: string
}

export interface Visita {
  id: number
  obra: Obra
  fecha: string
  hora: string
  tipo: 'inspeccion' | 'medicion' | 'seguimiento' | 'entrega'
  estado: 'programada' | 'completada' | 'cancelada'
  visitadorAsignado: string
  observaciones: string
  vehiculo?: string
  documentos?: Documento[]
}

export interface Entrega {
  id: number
  obra: Obra
  fecha: string
  hora: string
  estado: 'programada' | 'en_transito' | 'entregada' | 'cancelada'
  encargadoAsignado: string
  productos: string[]
  direccionEntrega: string
  observaciones: string
  vehiculo?: string
  documentos?: Documento[]
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono?: string
  rol: 'admin' | 'coordinacion' | 'encargado' | 'visitador'
  fechaIngreso?: string
  activo: boolean
  contraseña?: string
}

export interface Obra {
  id: number
  nombre: string
  descripcion: string
  cliente: {
    id: number
    nombre: string
    apellido: string
    telefono: string
    email: string
  }
  ubicacion: string
  presupuesto: number
  fechaInicio: string
  estado: 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada'
}

export interface ReporteVentas {
  id: number
  mes: string
  año: number
  ventasTotales: number
  ingresosBrutos: number
  costosMateriales: number
  gananciaNeeta: number
  obrasCompletadas: number
  clientesNuevos: number
}

export interface ConfiguracionesProps {
  onBack?: () => void
  className?: string
}

export interface CrearClienteProps {
  onCancel: () => void
  onSubmit?: (clienteData: any) => void
}

export interface Vehiculo {
  id: string
  descripcion: string
}

export interface VisitasListProps {
  onCreateClick: () => void
}

export interface VisitaDetailProps {
  visita: Visita
  onClose: () => void
}

export interface ObrasListProps {
  onCreateClick: () => void
  onScheduleVisit?: (obra: any) => void
  onScheduleEntrega?: (obra: any) => void
}

export interface LoginFormProps {
  onLogin: (usuario: string, contrasena: string) => boolean
}

export interface DashboardSwitcherProps {
  user: Usuario
  onLogout: () => void
}

export interface CrearVisitaProps {
  onCancel: () => void
  onSubmit: (visitaData: any) => void
  preloadedObra?: {
    id: string
    nombre: string
    cliente: string
    direccion: string
    contacto: string
  }
}

export interface EntregasListProps {
  onCreateClick: () => void
}

export interface DashboardProps {
  userName: string
  onLogout: () => void
}
