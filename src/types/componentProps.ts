import type { Obra } from './obra'
import type { Provincia } from './geo'
import type { RolEmpleado } from './auth'
import type { ObraConPresupuesto, Pago } from './pago'

export interface PagosPageContentProps {
  searchQuery?: string
  direccionObra?: string
  fechaDesde?: string
  fechaHasta?: string
  montoMin?: number
  montoMax?: number
  canCreate?: boolean
  usuarioRol?: string
  title?: string
  subtitle?: string
}

export interface ObraCardProps {
  obra: Obra
  usuarioRol: RolEmpleado | undefined
  provincias: Provincia[]
}

export interface VerDetallesClienteProps {
  cuil: string
  onClose: () => void
}

export interface CrearPagoButtonProps {
  direccionObra?: string
}

export interface ObraSelectProps {
  selectedObra: ObraConPresupuesto | null
  onObraSelect: (obra: ObraConPresupuesto | null) => void
  placeholder?: string
  required?: boolean
  showResults?: boolean
  searchResults?: ObraConPresupuesto[]
  loading?: boolean
  error?: string | null
  onSearchChange?: (searchTerm: string) => void
  initialSearchTerm?: string
}

export interface ObraSearchResultsProps {
  obras: ObraConPresupuesto[]
  loading: boolean
  error: string | null
  searchTerm: string
  onObraSelect: (obra: ObraConPresupuesto) => void
}

export interface PagoModalProps {
  open: boolean
  onClose: () => void
  onPagoCreado: (pago: Pago) => void
  obraPreseleccionada?: ObraConPresupuesto
  direccionObra?: string
}

export type PagoModalStep = 'obra' | 'pago'
