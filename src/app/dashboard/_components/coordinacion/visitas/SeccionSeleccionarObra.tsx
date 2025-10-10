// src/components/Coord/visitas/SeccionSeleccionObra.tsx
'use client'
import { Building2, Info } from 'lucide-react'
import ObraSearchWrapper from '../../shared/ObraSearchWrapper'

interface SeccionSeleccionObraProps {
  isVisitaInicial: boolean
  onVisitaInicialToggle: () => void
  showObraSearch: boolean
  onShowObraSearchToggle: () => void
  obraSeleccionada: string
  onSelectObra: (obra: any) => void
}

export default function SeccionSeleccionObra({
  isVisitaInicial,
  onVisitaInicialToggle,
  showObraSearch,
  onShowObraSearchToggle,
  obraSeleccionada,
  onSelectObra,
}: SeccionSeleccionObraProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onShowObraSearchToggle}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 shadow-sm transition-colors ${
            isVisitaInicial
              ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
              : 'border-gray-300 bg-white text-blue-700 hover:bg-blue-50'
          } `}
          disabled={isVisitaInicial}
        >
          <Building2 className="h-4 w-4" />
          {obraSeleccionada || 'Buscar obra existente...'}
        </button>
        <div className="ml-4 flex items-center">
          <button
            type="button"
            onClick={onVisitaInicialToggle}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold shadow transition-colors ${
              isVisitaInicial
                ? 'bg-blue-600 text-white'
                : 'border border-blue-600 bg-white text-blue-700 hover:bg-blue-50'
            } `}
          >
            <Info className="h-4 w-4" />
            Visita sin obra
          </button>
        </div>
      </div>
      {showObraSearch && !isVisitaInicial && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ObraSearchWrapper onSelectObra={onSelectObra} />
        </div>
      )}
    </section>
  )
}