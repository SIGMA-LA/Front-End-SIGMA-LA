import { AlertCircle, ArchiveX, X, Trash2 } from 'lucide-react'

interface EliminarObraModalProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  onCancel: () => void
  direccion: string
  isEliminacion?: boolean
}

export default function EliminarObraModal({
  open,
  onClose,
  onDelete,
  onCancel,
  direccion,
  isEliminacion = false,
}: EliminarObraModalProps) {
  if (!open) return null

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 relative w-full max-w-lg rounded-3xl bg-white shadow-2xl duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-inner ring-4 ring-red-50/50">
            {isEliminacion ? (
              <Trash2 className="h-8 w-8" />
            ) : (
              <ArchiveX className="h-8 w-8" />
            )}
          </div>

          <div className="mb-6 space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {isEliminacion
                ? '¿Eliminar esta obra permanentemente?'
                : '¿Cancelar esta obra?'}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Estás a punto de {isEliminacion ? 'eliminar' : 'cancelar'} la obra
              ubicada en{' '}
              <span className="font-bold text-slate-700">"{direccion}"</span>.
            </p>
          </div>

          {/* Info Box */}
          <div
            className={`mb-8 rounded-2xl border p-5 ${isEliminacion ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}
          >
            <div className="flex gap-4">
              <AlertCircle
                className={`h-6 w-6 shrink-0 ${isEliminacion ? 'text-red-500' : 'text-amber-500'}`}
              />
              <div className="space-y-1">
                <p
                  className={`text-[11px] font-bold tracking-wide uppercase ${isEliminacion ? 'text-red-900' : 'text-amber-900'}`}
                >
                  Aclaración Importante
                </p>
                <p
                  className={`text-sm leading-relaxed font-medium ${isEliminacion ? 'text-red-700/80' : 'text-amber-700/80'}`}
                >
                  {isEliminacion ? (
                    'El registro será borrado físicamente del sistema ya que la obra se encuentra en espera de pago y no tiene registros asociados.'
                  ) : (
                    <>
                      El registro no será borrado del sistema. En su lugar, el
                      estado pasará a ser{' '}
                      <span className="rounded bg-amber-200/50 px-1.5 py-0.5 font-bold text-amber-900">
                        CANCELADA
                      </span>{' '}
                      y la obra quedará archivada.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            >
              MANTENER OBRA
            </button>
            <button
              onClick={isEliminacion ? onDelete : onCancel}
              className="w-full rounded-2xl bg-red-600 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/40 active:scale-95"
            >
              {isEliminacion ? 'SÍ, ELIMINAR OBRA' : 'SÍ, CANCELAR OBRA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
