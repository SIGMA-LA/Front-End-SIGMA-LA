import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

import { createPedidoStock } from '@/actions/pedidoStock'
import { notify } from '@/lib/toast'

interface SolicitarStockModalProps {
  isOpen: boolean
  onClose: () => void
  obraId: number
  onSuccess: () => void
  isCoordinacion?: boolean
}

export default function SolicitarStockModal({
  isOpen,
  onClose,
  obraId,
  onSuccess,
  isCoordinacion = false,
}: SolicitarStockModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = isCoordinacion
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descripcion.trim()) {
      notify.error('La descripción es obligatoria')
      return
    }

    setLoading(true)
    try {
      const result = await createPedidoStock({ obraId, descripcion })
      if (result.success) {
        notify.success('Pedido de stock generado correctamente.')
        setDescripcion('')
        onSuccess()
        onClose()
      } else {
        notify.error(result.error || 'Error al generar pedido de stock.')
      }
    } catch (error) {
      console.error(error)
      notify.error('Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-100 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Solicitar Stock
            </h3>
            <p className="text-sm text-gray-500">
              Obra #{obraId}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Detalle de los materiales necesarios <span className="text-red-500">*</span>
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                placeholder="Ej: Faltan 5 perfiles de aluminio para el marco..."
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !descripcion.trim()}
              className="bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Solicitando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
