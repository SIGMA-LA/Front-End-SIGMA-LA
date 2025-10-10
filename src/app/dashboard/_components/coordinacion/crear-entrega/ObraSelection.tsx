'use client'

import { Search } from 'lucide-react'
import type { Obra } from '@/types'

interface ObraSelectionProps {
  isFromObra: boolean
  direccion: string | null
  showObraSearch: boolean
  setShowObraSearch: (show: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredObras: Obra[]
  handleObraSelect: (obra: Obra) => void
}

export default function ObraSelection({
  isFromObra,
  direccion,
  showObraSearch,
  setShowObraSearch,
  searchTerm,
  setSearchTerm,
  filteredObras,
  handleObraSelect,
}: ObraSelectionProps) {
  if (isFromObra) return null

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Obra
      </label>
      <button
        type="button"
        onClick={() => setShowObraSearch(!showObraSearch)}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
      >
        <Search className="h-4 w-4" />
        {direccion || 'Buscar obra...'}
      </button>

      {showObraSearch && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <input
            type="text"
            placeholder="Buscar por dirección o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {filteredObras.length > 0 ? (
              filteredObras.map((obra) => (
                <button
                  key={obra.cod_obra}
                  type="button"
                  onClick={() => handleObraSelect(obra)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left hover:bg-blue-50"
                >
                  <p className="font-medium">{obra.direccion}</p>
                  <p className="text-sm text-gray-600">
                    {obra.cliente.razon_social}
                  </p>
                </button>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">
                No se encontraron obras
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
