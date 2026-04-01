export type { Cliente, TipoCliente } from './cliente'

export type {
  Empleado,
  RolEmpleado,
  AreaTrabajo,
  CreateEmpleadoData,
  UpdateEmpleadoData,
} from './auth'

export type { Provincia, Localidad } from './geo'

export type {
  Obra,
  EstadoObra,
  EstadoNotaFabricaProduccion,
  Presupuesto,
  CreateObraInput,
  UpdateObraInput,
  PresupuestoInput,
} from './obra'

export type {
  Pago,
  PagoFormData,
  PagosFilter,
  ObraConPresupuesto,
} from './pago'

export type {
  Visita,
  VisitaFormData,
  EmpleadoVisita,
  MotivoVisita,
  EstadoVisita,
} from './visita'

export type {
  Entrega,
  EntregaEmpleado,
  OrdenProduccion,
  EstadoEntrega,
  EstadoOrdenProduccion,
  RolEntrega,
} from './entrega'

export type {
  Vehiculo,
  VehiculoFormData,
  VehiculoTipo,
  VehiculoEstado,
  VehiculoConDisponibilidad,
  AvailabilityStatus,
  UsoVehiculoEntrega,
  UsoVehiculoVisita,
} from './vehiculo'

export type {
  Maquinaria,
  MaquinariaSimple,
  UsoMaquinaria,
  EstadoMaquinaria,
  MaquinariaConDisponibilidad,
} from './maquinaria'

export type {
  ApiResponse,
  SearchParams,
  ParametroViatico,
  PerfilFormData,
} from './common'

export type {
  PagosPageContentProps,
  ObraCardProps,
  VerDetallesClienteProps,
  CrearPagoButtonProps,
  ObraSelectProps,
  ObraSearchResultsProps,
  PagoModalProps,
  PagoModalStep,
} from './componentProps'
