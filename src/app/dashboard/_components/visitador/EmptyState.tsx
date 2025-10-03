import { User as UserIcon, Package } from 'lucide-react'

interface EmptyStateProps {
  type: 'visitas' | 'entregas'
}

export default function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center text-center text-gray-500">
      <div>
        {type === 'visitas' ? (
          <>
            <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="text-lg">
              Selecciona una visita para ver los detalles
            </p>
          </>
        ) : (
          <>
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="text-lg">
              Selecciona una entrega para ver los detalles
            </p>
          </>
        )}
      </div>
    </div>
  )
}
