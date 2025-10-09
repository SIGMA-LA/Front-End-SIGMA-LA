import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import clienteService from '@/services/cliente.service'
import type { Cliente } from '@/types'
import VerDetallesCliente from './VerDetallesCliente'
import { useAuth } from '@/context/AuthContext'

interface ClientesListProps {
  onCreateClick: () => void
}

export default function ClientesList({ onCreateClick }: ClientesListProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClienteCuil, setSelectedClienteCuil] = useState<string | null>(
    null
  )

  const { usuario } = useAuth()

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clienteService.getAllClientes()
      setClientes(data)
    } catch (err: any) {
      console.error('Error al cargar clientes:', err)
      setError(err.response?.data?.message || 'Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCliente = (cuil: string) => {
    setClientes((prev) => prev.filter((c) => c.cuil !== cuil))
  }

  const handleEditCliente = (clienteActualizado: Cliente) => {
    setClientes((prev) =>
      prev.map((c) =>
        c.cuil === clienteActualizado.cuil ? clienteActualizado : c
      )
    )
  }

  const filteredClientes = clientes.filter((cliente) => {
    const search = searchTerm.toLowerCase()
    return (
      cliente.razon_social?.toLowerCase().includes(search) ||
      cliente.nombre?.toLowerCase().includes(search) ||
      cliente.apellido?.toLowerCase().includes(search) ||
      cliente.cuil.includes(search) ||
      cliente.mail.toLowerCase().includes(search) ||
      cliente.telefono.includes(search)
    )
  })

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
                  onClick={loadClientes}
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
              onClick={onCreateClick}
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
            />
          </div>
        </div>

        {filteredClientes.length === 0 ? (
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
                onClick={onCreateClick}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Agregar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.cuil}
                className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {cliente.razon_social
                    ? cliente.razon_social
                    : `${cliente.nombre} ${cliente.apellido}`}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">CUIL:</span>
                    <span>{cliente.cuil}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{cliente.mail}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{cliente.telefono}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClienteCuil(cliente.cuil)}
                  className="mt-4 font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Mostrando {filteredClientes.length} de {clientes.length} clientes
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedClienteCuil && (
        <VerDetallesCliente
          cuil={selectedClienteCuil}
          onClose={() => setSelectedClienteCuil(null)}
          onEdit={handleEditCliente}
          onDelete={handleDeleteCliente}
        />
      )}
    </div>
  )
}
