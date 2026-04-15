import type { Obra, Pago, Visita, Entrega } from '@/types'

// ---------------------------------------------------------------------------
// Types for chart data shapes returned by each processing function
// ---------------------------------------------------------------------------

export interface VentaMensualData {
  name: string
  ventas: number
}

export interface ObraPorEstadoData {
  name: string
  value: number
  fullName: string
}

export interface VisitaDelMesData {
  name: string
  cantidad: number
  fullName: string
}

export interface EntregaDelMesData {
  name: string
  cantidad: number
  fullName: string
}

export interface IngresoAcumuladoData {
  name: string
  ingresos: number
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

export const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
] as const

/** Converts an uppercase state string to Title Case for chart labels. */
export function formatEstado(estado: string): string {
  return estado
    .split(' ')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

/** Formats a number as ARS currency without decimal places. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

// ---------------------------------------------------------------------------
// Chart data processors — all pure functions with explicit return types
// ---------------------------------------------------------------------------

/**
 * Aggregates payment amounts by month for the last 6 months.
 * Used for the "Ventas Mensuales" bar chart.
 */
export function processVentasMensuales(pagos: Pago[]): VentaMensualData[] {
  const now = new Date()
  const months: { key: string; label: string; total: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({
      key,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      total: 0,
    })
  }

  for (const pago of pagos) {
    const date = new Date(pago.fecha_pago)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const month = months.find((m) => m.key === key)
    if (month) month.total += pago.monto
  }

  return months.map((m) => ({ name: m.label, ventas: m.total }))
}

/**
 * Groups obras by their current state and counts each group.
 * Used for the "Obras por Estado" pie chart.
 */
export function processObrasPorEstado(obras: Obra[]): ObraPorEstadoData[] {
  const counts: Record<string, number> = {}
  for (const obra of obras) {
    counts[obra.estado] = (counts[obra.estado] ?? 0) + 1
  }
  return Object.entries(counts).map(([estado, cantidad]) => ({
    name: formatEstado(estado),
    value: cantidad,
    fullName: estado,
  }))
}

/**
 * Counts visits in the current calendar month grouped by state.
 * Used for the "Visitas del Mes" horizontal bar chart.
 */
export function processVisitasDelMes(visitas: Visita[]): VisitaDelMesData[] {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthVisitas = visitas.filter((v) => {
    const d = new Date(v.fecha_hora_visita)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const counts: Record<string, number> = {}
  for (const v of thisMonthVisitas) {
    const estado = v.estado ?? 'SIN ESTADO'
    counts[estado] = (counts[estado] ?? 0) + 1
  }

  return Object.entries(counts).map(([estado, cantidad]) => ({
    name: formatEstado(estado),
    cantidad,
    fullName: estado,
  }))
}

/**
 * Counts deliveries in the current calendar month grouped by state.
 * Used for the "Entregas del Mes" horizontal bar chart.
 */
export function processEntregasDelMes(entregas: Entrega[]): EntregaDelMesData[] {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthEntregas = entregas.filter((e) => {
    const d = new Date(e.fecha_hora_entrega)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const counts: Record<string, number> = {}
  for (const e of thisMonthEntregas) {
    counts[e.estado] = (counts[e.estado] ?? 0) + 1
  }

  return Object.entries(counts).map(([estado, cantidad]) => ({
    name: formatEstado(estado),
    cantidad,
    fullName: estado,
  }))
}

/**
 * Builds a cumulative income series for the last 6 months.
 * Used for the "Ingresos Acumulados" area chart.
 */
export function processIngresosAcumulados(pagos: Pago[]): IngresoAcumuladoData[] {
  const now = new Date()
  const months: { key: string; label: string; total: number; acumulado: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({
      key,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      total: 0,
      acumulado: 0,
    })
  }

  for (const pago of pagos) {
    const date = new Date(pago.fecha_pago)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const month = months.find((m) => m.key === key)
    if (month) month.total += pago.monto
  }

  let acc = 0
  for (const m of months) {
    acc += m.total
    m.acumulado = acc
  }

  return months.map((m) => ({ name: m.label, ingresos: m.acumulado }))
}
