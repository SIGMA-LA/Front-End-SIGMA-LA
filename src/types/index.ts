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
  cod_visita: number
  obra?: Obra
  fecha_hora_visita: string
  motivo_visita:
    | 'MEDICION'
    | 'RE-MEDICION'
    | 'REPARACION'
    | 'ASESORAMIENTO'
    | 'VISITA INICIAL'
  estado:
    | 'PROGRAMADA'
    | 'EN CURSO'
    | 'CANCELADA'
    | 'REPROGRAMADA'
    | 'COMPLETADA'
  empleados_asignados: Empleado[]
  observaciones?: string
  direccion_visita?: string
  vehiculos_usados?: UsoVehiculoVisita[]
  fecha_cancelacion?: string
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
  maquinarias_usadas?: UsoMaquinaria[]
  vehiculos_usados?: UsoVehiculoEntrega[]
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
  cod_postal: number
  cuil_cliente: string
  estado:
    | 'ACTIVA'
    | 'EN PRODUCCION'
    | 'FINALIZADA'
    | 'ENTREGADA'
    | 'CANCELADA'
    | 'EN ESPERA DE STOCK'
  direccion: string
  cliente: Cliente
  nota_fabrica: string
  fecha_ini: string
  fecha_cancelacion: string | null
  localidad?: Localidad
  entregas?: Entrega[]
  visitas?: Visita[]
  presupuestos?: Presupuesto[]
  pagos?: Pago[]
}

export interface Localidad {
  cod_postal: number
  nombre_localidad: string
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
  patente: string
  tipo_vehiculo: string
  estado:
    | 'DISPONIBLE'
    | 'EN USO'
    | 'MANTENIMIENTO'
    | 'REPARACION'
    | 'FUERA DE SERVICIO'
    | 'RESERVADO'
}

export interface Maquinaria {
  cod_maquina: number
  descripcion: string
  estado:
    | 'DISPONIBLE'
    | 'EN_USO'
    | 'MANTENIMIENTO'
    | 'REPARACION'
    | 'FUERA_DE_SERVICIO'
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
