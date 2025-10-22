import { AlertTriangle } from 'lucide-react'

interface EliminarObraModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  direccion: string
}

export default function EliminarObraModal({
  open,
  onClose,
  onConfirm,
  direccion,
}: EliminarObraModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-7 w-7 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900">
            ¿Está seguro que desea eliminar la obra?
          </h2>
        </div>
        <p className="mb-4 text-gray-700">
          La obra <span className="font-semibold">{direccion}</span> pasará a
          estado <span className="font-semibold text-red-600">"CANCELADA"</span>
          . Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Sí, cancelar obra
          </button>
        </div>
      </div>
    </div>
  )
}
