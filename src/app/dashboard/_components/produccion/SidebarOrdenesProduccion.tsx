import { Package } from 'lucide-react'

interface SidebarOrdenesProduccionProps {
  // Por ahora sin props, pero más adelante tendremos:
  // ordenesAprobadas: OrdenProduccion[]
  // ordenesEnProduccion: OrdenProduccion[]
  // selectedOrden: OrdenProduccion | null
  // onSelectOrden: (orden: OrdenProduccion) => void
}

export default function SidebarOrdenesProduccion({}: SidebarOrdenesProduccionProps) {
  return (
    <aside className="h-full w-full flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:space-y-8 lg:p-6">
      {/* Órdenes Aprobadas (Por Iniciar) */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2 sm:mb-4 sm:space-x-3 sm:pt-3 lg:mb-5">
          <div className="h-3 w-3 rounded-full bg-blue-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            Órdenes Aprobadas (0)
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="py-6 text-center sm:py-8 lg:py-12">
            <div className="mb-3 text-gray-400 sm:mb-4">
              <Package className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
            </div>
            <p className="text-sm text-gray-600 font-medium sm:text-base lg:text-lg mb-2">
              Funcionalidad en desarrollo
            </p>
            <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
              Aquí se mostrarán las órdenes de producción
              <br />
              aprobadas listas para iniciar
            </p>
          </div>
        </div>
      </div>

      {/* Órdenes En Producción */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 sm:mb-4 sm:space-x-3 lg:mb-5">
          <div className="h-3 w-3 rounded-full bg-green-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            En Producción (0)
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="py-6 text-center sm:py-8 lg:py-12">
            <div className="mb-3 text-gray-400 sm:mb-4">
              <svg
                className="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
              No hay órdenes en producción
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}