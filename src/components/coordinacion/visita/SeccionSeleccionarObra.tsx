'use client'

import { Obra } from '@/types'
import ObraSearchSelect from '@/components/shared/ObraSearchSelect'
import { Building2, CheckCircle2 } from 'lucide-react'

interface SeccionSeleccionObraProps {
  isVisitaInicial: boolean
  onVisitaInicialToggle: () => void
  obraSeleccionada: string
  onSelectObra: (obra: Obra) => void
  buscarObras: (filtro: string) => Promise<Obra[]>
}

export default function SeccionSeleccionarObra({
  isVisitaInicial,
  onVisitaInicialToggle,
  obraSeleccionada,
  onSelectObra,
  buscarObras,
}: SeccionSeleccionObraProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-blue-800">
        Tipo de visita
      </h2>

      {/* Botón de visita inicial */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onVisitaInicialToggle}
          className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all ${
            isVisitaInicial
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isVisitaInicial ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Building2
                className={`h-5 w-5 ${isVisitaInicial ? 'text-white' : 'text-gray-500'}`}
              />
            </div>
            <div className="text-left">
              <p
                className={`font-semibold ${isVisitaInicial ? 'text-blue-900' : 'text-gray-700'}`}
              >
                Visita inicial
              </p>
              <p className="text-sm text-gray-500">Sin obra previa asignada</p>
            </div>
          </div>
          {isVisitaInicial && (
            <CheckCircle2 className="h-6 w-6 text-blue-500" />
          )}
        </button>
      </div>

      {/* Buscador fijo si NO es visita inicial */}
      {!isVisitaInicial && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Buscar obra existente
          </label>
          <ObraSearchSelect
            buscarObras={buscarObras}
            onSelectObra={onSelectObra}
          />

          {obraSeleccionada && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <span className="font-semibold text-green-800">
                  Obra seleccionada:
                </span>{' '}
                <span className="text-green-700">{obraSeleccionada}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
