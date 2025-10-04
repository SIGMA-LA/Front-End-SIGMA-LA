import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  observaciones: string
  onObservacionesChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  observaciones,
  onObservacionesChange,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>
        <div className="mb-4">
          <Label htmlFor="observaciones-final">
            Observaciones finales (opcional)
          </Label>
          <Textarea
            id="observaciones-final"
            placeholder="Añade cualquier observación relevante..."
            value={observaciones}
            onChange={(e) => onObservacionesChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="mt-6 flex space-x-4">
          <Button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white hover:bg-green-700"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}
