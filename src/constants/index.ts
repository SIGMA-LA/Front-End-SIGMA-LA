export const ROLES_EMPLEADO = [
  'ADMIN',
  'VENTAS',
  'COORDINACION',
  'PRODUCCION',
  'PLANTA',
  'VISITADOR',
] as const

export const AREAS_TRABAJO = [
  'COORDINACION',
  'VENTAS',
  'PRODUCCION',
  'CORTE',
  'MECANIZADO',
  'ENSAMBLE',
  'ALMACEN',
  'ATENCION_CLIENTE',
  'COMPRAS',
  'RECURSOS_HUMANOS',
  'FINANZAS',
  'ADMINISTRACION',
  'PLANTA',
] as const

export const TIPOS_CLIENTE = ['PERSONA', 'EMPRESA'] as const

export const ESTADOS_OBRA = [
  'EN ESPERA DE PAGO',
  'PAGADA PARCIALMENTE',
  'EN ESPERA DE STOCK',
  'EN PRODUCCION',
  'PRODUCCION FINALIZADA',
  'PAGADA TOTALMENTE',
  'ENTREGADA',
  'CANCELADA',
] as const

export const ESTADOS_ENTREGA = [
  'ENTREGADO',
  'EN CURSO',
  'CANCELADO',
  'PENDIENTE',
] as const

export const ROLES_ENTREGA = ['ENCARGADO', 'ACOMPANANTE'] as const

export const ESTADOS_ORDEN_PRODUCCION = [
  'PENDIENTE',
  'APROBADA',
  'EN PRODUCCION',
  'FINALIZADA',
] as const

export const MOTIVOS_VISITA = [
  'MEDICION',
  'RE-MEDICION',
  'REPARACION',
  'ASESORAMIENTO',
  'VISITA INICIAL',
] as const

export const ESTADOS_VISITA = [
  'PENDIENTE',
  'PROGRAMADA',
  'EN CURSO',
  'CANCELADA',
  'REPROGRAMADA',
  'COMPLETADA',
] as const

export const TIPOS_VEHICULO = [
  'CAMION CHICO',
  'CAMIONETA',
  'AUTOMOVIL',
  'CAMION GRANDE',
] as const

export const ESTADOS_VEHICULO = [
  'DISPONIBLE',
  'FUERA DE SERVICIO',
  'ELIMINADO',
] as const

export const ESTADOS_DISPONIBILIDAD = [
  'DISPONIBLE',
  'ADVERTENCIA',
  'NO_DISPONIBLE',
] as const

export const ESTADOS_MAQUINARIA = ['DISPONIBLE', 'NO DISPONIBLE', 'ELIMINADO'] as const

// ---------------------------------------------------------------------------
// Numeric constants previously hardcoded across multiple components
// ---------------------------------------------------------------------------

/** Default page size used across paginated sidebars (PlantaClient, VisitadorClient). */
export const PLANTA_PAGE_SIZE = 10

/** Daily travel allowance per person (in ARS), used in entrega forms and calculations. */
export const VIATICO_POR_DIA = 50_000

// ---------------------------------------------------------------------------
// Color maps for charts in ReportesView — keyed by domain state strings
// ---------------------------------------------------------------------------

export const COLORES_ESTADO_OBRA: Record<(typeof ESTADOS_OBRA)[number], string> = {
  'EN ESPERA DE PAGO': '#3b82f6',
  'PAGADA PARCIALMENTE': '#8b5cf6',
  'EN ESPERA DE STOCK': '#f59e0b',
  'EN PRODUCCION': '#06b6d4',
  'PRODUCCION FINALIZADA': '#10b981',
  'PAGADA TOTALMENTE': '#22c55e',
  ENTREGADA: '#6366f1',
  CANCELADA: '#ef4444',
}

export const COLORES_ESTADO_VISITA: Record<(typeof ESTADOS_VISITA)[number], string> = {
  PENDIENTE: '#94a3b8',
  PROGRAMADA: '#3b82f6',
  'EN CURSO': '#f59e0b',
  CANCELADA: '#ef4444',
  REPROGRAMADA: '#8b5cf6',
  COMPLETADA: '#10b981',
}

export const COLORES_ESTADO_ENTREGA: Record<(typeof ESTADOS_ENTREGA)[number], string> = {
  PENDIENTE: '#3b82f6',
  'EN CURSO': '#f59e0b',
  CANCELADO: '#ef4444',
  ENTREGADO: '#10b981',
}

// ---------------------------------------------------------------------------
// Motivo visita select options — used in CrearVisita dropdown
// ---------------------------------------------------------------------------

export const MOTIVOS_VISITA_OPTIONS: ReadonlyArray<{ readonly value: string; readonly label: string }> = [
  { value: 'VISITA INICIAL', label: 'Visita inicial' },
  { value: 'TOMA DE MEDIDAS', label: 'Toma de medidas' },
  { value: 'REPLANTEO', label: 'Replanteo / Remediata' },
  { value: 'REPARACION', label: 'Reparación (Garantía / Mto)' },
  { value: 'VISITA DE ASESORAMIENTO', label: 'Asesoramiento' },
  { value: 'OTRO', label: 'Otro propósito' },
] as const
