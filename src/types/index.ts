import { number } from "valibot"

export interface Cliente {
  cuil: string
  razon_social: string
  telefono: string
  mail: string
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

export interface Empleado {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: 'VENTAS' | 'ADMIN' | 'ENCARGADO' | 'COORDINACION' | 'VISITADOR'
  area_trabajo: string
  contrasenia?: string
}

export interface Obra {
  id: number
  direccion: string
  cliente: Cliente
  nota_fabrica: string
  fechaInicio: string
  fechaFin: string | null
  estado: 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada'
  localidad?: Localidad
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
  onSubmit?: (clienteData: Cliente) => void
}

export interface Vehiculo {
  tipoVehiculo: string
  marca: string
  modelo: string
  anio: number
  patente: string
  estado: 'disponible' | 'en-uso' | 'reparacion' 
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
  onScheduleVisit?: (obra: Obra) => void
  onScheduleEntrega?: (obra: Obra) => void
  onEditClick: (obra: Obra) => void
}

export interface PedidosListProps {
  onCreateClick: () => void
  onSchedulePedido?: (obra: Obra) => void
}

export interface RegistrarPedidoProps {
  onCancel: () => void
  onSubmit: (pedidoData: any) => void
  preloadedObra?: Obra | null
}

export interface LoginFormProps {
  onLogin: (cuil: string, contrasenia: string) => Promise<void>
}

export interface DashboardSwitcherProps {
  user: Empleado
  onLogout: () => void
}

export interface CrearVisitaProps {
  onCancel: () => void
  onSubmit: (visitaData: any) => void
  preloadedObra?: Obra | null
}

export interface EntregasListProps {
  onCreateClick: () => void
}

export interface DashboardProps {
  userName: string
  onLogout: () => void
}

export interface CrearEntregaProps {
  onCancel: () => void
  onSubmit: (entregaData: Entrega) => void
  preloadedObra?: Obra | null
}

export interface ModalEncargadoProps {
  isOpen: boolean
  empleados: Empleado[]
  selectedEmpleados: string[]
  onSelectEncargado: (encargadoId: string) => void
  onCancel: () => void
}

export interface Maquinaria {
  id: string
  descripcion: string
  estado: 'disponible' | 'inhabilitada'
}

export interface MaquinariaListProps {
  onCreateClick: () => void
}

export interface VehiculosListProps {
  onCreateClick: () => void
}

export interface Localidad {
  cod_postal: number
  nombre_localidad: string
}