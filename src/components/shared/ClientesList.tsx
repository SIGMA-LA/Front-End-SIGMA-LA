'use client'
import { useState, useEffect } from 'react'
import { Users, Plus, Search, Loader2, AlertCircle } from 'lucide-react'
import type { Cliente } from '@/types'
import VerDetallesCliente from './VerDetallesCliente'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import ClienteCard from './ClienteCard'
import useDebounce from '@/hooks/useDebounce'

interface ClientesListProps {
  clientes: Cliente[]
}

export default function ClientesList({
  clientes: initialClientes,
}: ClientesListProps) {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [selectedClienteCuil, setSelectedClienteCuil] = useState<string | null>(
    null
  )
  const router = useRouter()
  const { usuario } = useAuth()

  useEffect(() => {
    setClientes(initialClientes ?? [])
  }, [initialClientes])

  const handleDeleteCliente = (cuil: string) => {
    setClientes((prev) => prev.filter((c) => c.cuil !== cuil))
  }

  useEffect(() => {
    const q = (debouncedSearch ?? '').trim()
    const base = '/ventas/clientes'
    const url = q ? `${base}?q=${encodeURIComponent(q)}` : base
    router.replace(url)
  }, [debouncedSearch, router])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Error al cargar clientes
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => {
                    router.refresh()
                  }}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Clientes
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de clientes y empresas
              </p>
            </div>
          </div>
          {usuario?.rol_actual === 'VENTAS' && (
            <button
              onClick={() => router.push('/ventas/clientes/crear')}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nuevo Cliente
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por razón social, CUIL, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              aria-label="Buscar clientes"
            />
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {searchTerm
                ? 'No se encontraron clientes'
                : 'No hay clientes registrados'}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando tu primer cliente'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/ventas/clientes/crear')}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Agregar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clientes.map((cliente) => (
              <ClienteCard
                key={cliente.cuil}
                cliente={cliente}
                onView={(cuil) => setSelectedClienteCuil(cuil)}
                onEdit={() =>
                  router.push(`/ventas/clientes/${cliente.cuil}/editar`)
                }
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Mostrando {clientes.length} clientes
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedClienteCuil && (
        <VerDetallesCliente
          cuil={selectedClienteCuil}
          onClose={() => setSelectedClienteCuil(null)}
          onDelete={handleDeleteCliente}
        />
      )}
    </div>
  )
}
