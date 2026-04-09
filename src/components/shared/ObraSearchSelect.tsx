'use client'
// Componente de selección de obras con autocompletado

import { useState, useEffect } from 'react'
import { Obra } from '@/types'
import useDebounce from '@/hooks/useDebounce'
import { Building2, User, Search, Building } from 'lucide-react'

export default function ObraSearchSelect({
  onSelectObra,
  buscarObras,
  placeholder = 'Buscar obra por nombre, cliente o dirección...',
}: {
  onSelectObra: (obra: Obra) => void
  buscarObras: (filtro: string) => Promise<Obra[] | { data: Obra[] }>
  placeholder?: string
}) {
  const [filtro, setFiltro] = useState('')
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedFiltro = useDebounce(filtro, 400)

  useEffect(() => {
    const fetchObras = async () => {
      setLoading(true)
      try {
        const resultados = await buscarObras(debouncedFiltro.trim())
        const obrasArray = Array.isArray(resultados) ? resultados : resultados?.data || []
        setObras(obrasArray)
        if (debouncedFiltro.trim()) {
          setShowResults(true)
        }
      } catch (error) {
        console.error('Error al buscar obras:', error)
        setObras([])
      } finally {
        setLoading(false)
      }
    }

    fetchObras()
  }, [debouncedFiltro, buscarObras])

  const handleSelectObra = (obra: Obra) => {
    onSelectObra(obra)
    setFiltro('')
    setObras([])
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {loading && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500">
            Buscando...
          </div>
        )}
      </div>

      {showResults && obras.length > 0 && (
        <div className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          {obras.map((obra) => (
            <button
              key={obra.cod_obra}
              type="button"
              onClick={() => handleSelectObra(obra)}
              className="flex w-full flex-col gap-2 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Building2 className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <span className="truncate">{obra.direccion}</span>
              </div>
              {obra.cliente?.tipo_cliente !== 'EMPRESA' ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {obra.cliente.nombre} {obra.cliente.apellido}
                  </span>
                </div>
              ) : obra.cliente?.tipo_cliente === 'EMPRESA' ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{obra.cliente.razon_social}</span>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {showResults && !loading && obras.length === 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm text-gray-500 shadow-lg">
          {filtro ? `No se encontraron obras con "${filtro}"` : 'No hay obras disponibles para seleccionar'}
        </div>
      )}
    </div>
  )
}
