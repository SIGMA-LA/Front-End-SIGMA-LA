import { number } from 'valibot'

export interface Cliente {
  cuil: string
  razon_social?: string
  telefono: string
  mail: string
  apellido?: string
  nombre?: string
  sexo?: string
  tipo_cliente: 'PERSONA' | 'EMPRESA'
}

export interface Documento {
  id: number
  nombre: string
  url: string
}
export type VisitaFormData = {
  fecha_hora_visita: string
  motivo_visita: string
  observaciones: string
  direccion_visita: string
  cod_obra: number | null
  cod_localidad: number | null
  dias_viatico: number
  empleados_visita: string[]
  vehiculo: string
  nombre_cliente?: string | null
  apellido_cliente?: string | null
  telefono_cliente?: string | null
}

export interface EmpleadoVisita {
  cuil: string
  cod_visita: number
  empleado: Empleado
  visita: Visita
}

export interface Visita {
  cod_visita: number
  obra?: Obra
  fecha_hora_visita: string
  motivo_visita:
    | 'MEDICION'
    | 'RE-MEDICION'
    | 'REPARACION'
    | 'ASESORAMIENTO'
    | 'VISITA INICIAL'
  estado?:
    | 'PROGRAMADA'
    | 'EN CURSO'
    | 'CANCELADA'
    | 'REPROGRAMADA'
    | 'COMPLETADA'
  empleado_visita: EmpleadoVisita[]
  observaciones?: string
  direccion_visita?: string
  uso_vehiculo_visita: UsoVehiculoVisita
  fecha_cancelacion?: string
  dias_viaticos?: number
  nombre_cliente?: string
  apellido_cliente?: string
  telefono_cliente?: string
  mail_cliente?: string
  localidad?: Localidad
}

export interface MaquinariaSimple {
  cod_maquina: number
  descripcion: string
}

export interface Entrega {
  cod_entrega: number
  cod_obra: number
  obra: Obra
  fecha_hora_entrega: string
  estado: 'ENTREGADO' | 'EN CURSO' | 'CANCELADO' | 'PENDIENTE'
  observaciones?: string
  detalle: string
  empleados_asignados: EntregaEmpleado[]
  maquinarias_usadas?: MaquinariaSimple[]
  vehiculos_usados?: UsoVehiculoEntrega[]
  dias_viaticos?: number
  orden_de_produccion?: OrdenProduccion
}

export interface EntregaEmpleado {
  cuil: string
  cod_obra: number
  cod_entrega: number
  rol_entrega: string
  empleado: Empleado
  entrega: Entrega
  obra: Obra
}

export interface Empleado {
  cuil: string
  nombre: string
  apellido: string
  rol_actual: string
  area_trabajo: string
  contrasenia?: string
}

export interface Obra {
  cod_obra: number
  cod_localidad: number
  cuil_cliente: string
  estado:
    | 'EN ESPERA DE PAGO'
    | 'PAGADA PARCIALMENTE'
    | 'EN ESPERA DE STOCK'
    | 'EN PRODUCCION'
    | 'PRODUCCION FINALIZADA'
    | 'PAGADA TOTALMENTE'
    | 'ENTREGADA'
    | 'CANCELADA'
  direccion: string
  cliente: Cliente
  nota_fabrica?: string
  nota_fabrica_pid?: string
  fecha_ini: string
  fecha_cancelacion: string | null
  localidad: Localidad
  entregas?: Entrega[]
  visitas?: Visita[]
  presupuesto?: Presupuesto[]
  pagos?: Pago[]
}

export interface Provincia {
  cod_provincia: number
  nombre: string
  localidades?: Localidad[]
}

export interface Localidad {
  cod_localidad: number
  nombre_localidad: string
  cod_provincia: number
  provincia: Provincia
  obras?: Obra[]
  visitas?: Visita[]
}

export interface UsoMaquinaria {
  cod_maquina: number
  cod_entrega: number
  fecha_hora_ini_uso: string
  fecha_hora_fin_est: string
  fecha_hora_fin_real?: string
  estado: string
}

export interface UsoVehiculoEntrega {
  patente: string
  cod_entrega: number
  fecha_hora_ini_uso: string
  fecha_hora_ini_est: string
  fecha_hora_fin_real?: string
  estado: string
}

export interface UsoVehiculoVisita {
  patente: string
  cod_visita: number
  fecha_hora_ini_uso: string
  fecha_hora_ini_est: string
  fecha_hora_fin_real?: string
  estado: string
}

export interface Presupuesto {
  nro_presupuesto: number
  cod_obra: number
  fecha_emision: string
  fecha_aceptacion?: string
  valor: number
}

export interface Pago {
  cod_pago: number
  cod_obra: number
  fecha_pago: string
  monto: number
  obra: Obra
}

export interface PagoFormData {
  cod_obra: number
  fecha_pago: string
  monto: number
}

// Filtros para búsqueda de pagos (nombres de la API)
export interface PagosFilter {
  cliente?: string
  fechaDesde?: string
  fechaHasta?: string
  obra?: string
  montoMin?: number
  montoMax?: number
}

// Obra con información de presupuesto y pagos para selección
export interface ObraConPresupuesto {
  cod_obra: number
  direccion: string
  estado: string
  cliente: Cliente
  presupuesto: {
    nro_presupuesto: number
    valor: number
    fecha_aceptacion: string
  }
  totalPagado: number
  saldoPendiente: number
  porcentajePagado: number
  cantidad_pagos: number
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

export type VehiculoTipo =
  | 'CAMION CHICO'
  | 'CAMIONETA'
  | 'AUTOMOVIL'
  | 'CAMION GRANDE'
export type VehiculoEstado =
  | 'DISPONIBLE'
  | 'EN USO'
  | 'MANTENIMIENTO'
  | 'REPARACION'
  | 'FUERA DE SERVICIO'
  | 'RESERVADO'

// Este es el tipo que usará el formulario y la Server Action
export interface VehiculoFormData {
  patente: string
  tipo_vehiculo: VehiculoTipo
  estado: VehiculoEstado
}

export type AvailabilityStatus = 'DISPONIBLE' | 'ADVERTENCIA' | 'NO_DISPONIBLE'
export interface VehiculoConDisponibilidad extends Vehiculo {
  availabilityStatus: AvailabilityStatus
  warningMessage?: string
}

// El tipo Vehiculo puede seguir teniendo más campos si la API GET los devuelve
export interface Vehiculo {
  patente: string
  tipo_vehiculo: VehiculoTipo
  estado: VehiculoEstado
  // Puede que el GET sí devuelva más datos, como una fecha de creación, etc.
}

export interface BackendVehiculo {
  patente: string
  tipo_vehiculo: string
  estado: string
}

export interface Maquinaria {
  cod_maquina: number
  descripcion: string
  estado: 'DISPONIBLE' | 'NO DISPONIBLE'
  uso_maquinaria?: any[] // Para futuro uso
}

export interface VisitasListProps {
  empleadosMap: Map<string, Empleado>
  visitas: Visita[]
}

export interface VisitaDetailProps {
  visita: Visita
  onClose: () => void
  onCancel?: () => void
}

export interface ObrasListProps {
  onCreateClick: () => void
  onScheduleVisit?: (obra: Obra) => void
  onScheduleEntrega?: (obra: Obra) => void
  onEditClick: (obra: Obra) => void
  onNotaFabricaClick?: (obra: Obra) => void
}

export interface PedidosListProps {
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
  preloadedObra?: Obra | null
  empleados: Empleado[]
  provincias: Provincia[]
  vehiculos: Vehiculo[]
  buscarObras: (query: string) => Promise<Obra[]>
  buscarLocalidades: (provinciaCod: number) => Promise<Localidad[]>
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

export interface MaquinariaCardProps {
  maquinaria: Maquinaria
  onViewDetails: (maquinaria: Maquinaria) => void
  onEdit: (maquinaria: Maquinaria) => void
  onDelete: (maquinaria: Maquinaria) => void
}

export interface CrearMaquinariaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export interface VerDetallesMaquinariaModalProps {
  isOpen: boolean
  maquinaria: Maquinaria | null
  onClose: () => void
}

export interface EditarMaquinariaModalProps {
  isOpen: boolean
  maquinaria: Maquinaria | null
  onClose: () => void
  onSuccess: () => void
}

export interface VehiculosListProps {
  onCreateClick: () => void
  onEditClick: (vehiculo: Vehiculo) => void
}

export interface Localidad {
  cod_localidad: number
  nombre_localidad: string
  cod_provincia: number
  provincia: Provincia
}

export interface TabNavigationProduccionProps {
  activeTab: 'notas' | 'ordenes'
  onTabChange: (tab: 'notas' | 'ordenes') => void
}

export interface OrdenProduccion {
  cod_op: number
  cod_obra: number
  estado: 'PENDIENTE' | 'APROBADA' | 'EN PRODUCCION' | 'FINALIZADA'
  fecha_confeccion: string
  fecha_validacion: string | null
  url: string
  public_id: string | null
  obra: Obra
}
