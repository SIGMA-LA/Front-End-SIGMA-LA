import { useEffect, useState } from 'react'
import { createPagoForObra, updatePago } from '@/actions/pagos'
import { Obra, PagoFormData, Pago } from '@/types'
import { getObraById } from '@/services/obra.service'

interface PagoModalProps {
  codObra: number
  open: boolean
  onClose: () => void
  onPagoCreado: (pago: Pago) => void
  pagoAEditar?: Pago | null
  onPagoEditado?: (pago: Pago) => void
}

export default function PagoModal({
  codObra,
  open,
  onClose,
  onPagoCreado,
  pagoAEditar = null,
  onPagoEditado,
}: PagoModalProps) {
  const [obra, setObra] = useState<Obra | null>(null)
  const [monto, setMonto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const fetchObra = async () => {
      const obra = await getObraById(codObra)
      setObra(obra)
    }
    fetchObra()
  }, [codObra, open])

  useEffect(() => {
    if (pagoAEditar && open) {
      setMonto(pagoAEditar.monto.toString())
    } else if (open) {
      setMonto('')
    }
  }, [pagoAEditar, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (pagoAEditar) {
        const pagoEditado = await updatePago({
          ...pagoAEditar,
          monto: parseFloat(monto),
          fecha_pago: pagoAEditar.fecha_pago.slice(0, 10),
        })
        onPagoEditado?.(pagoEditado)
      } else {
        const pagoData: PagoFormData = {
          monto: parseFloat(monto),
          fecha_pago: new Date().toISOString().slice(0, 10),
          cod_obra: codObra,
        }
        const pago = await createPagoForObra(pagoData, codObra)
        onPagoCreado(pago)
      }
      setMonto('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el pago')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
          {pagoAEditar ? 'Editar Pago' : 'Nuevo Pago'}
        </h2>
        {obra ? (
          <div className="mb-4 rounded bg-blue-50 p-2 text-sm text-gray-700 sm:p-3">
            <div>
              <span className="font-semibold">Obra:</span> {obra.direccion}
            </div>
            <div>
              <span className="font-semibold">Cliente:</span>{' '}
              {obra.cliente?.razon_social || 'No asignado'}
            </div>
          </div>
        ) : (
          <div className="mb-4 text-gray-500">Cargando obra...</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Monto
            </label>
            <input
              type="number"
              min={0}
              step="any"
              required
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full rounded border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              placeholder="Ingrese el monto"
              disabled={loading}
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              disabled={loading || !obra}
            >
              {loading
                ? 'Guardando...'
                : pagoAEditar
                  ? 'Guardar Cambios'
                  : 'Crear Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
