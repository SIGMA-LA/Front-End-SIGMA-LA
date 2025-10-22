'use client'

import { useState } from 'react'
import ClientesList from '@/components/shared/ClientesList'
import type { Cliente } from '@/types'
import CrearCliente from '@/components/ventas/CrearCliente'
import EditarCliente from '@/components/ventas/EditarCliente'

export default function ClientesPage() {
  const [showCrear, setShowCrear] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null)

  const handleCreate = () => setShowCrear(true)
  const handleEdit = (cliente: Cliente) => setClienteSeleccionado(cliente)

  return (
    <>
      <ClientesList onCreateClick={handleCreate} onEditClick={handleEdit} />
      {showCrear && (
        <CrearCliente
          onCancel={() => setShowCrear(false)}
          onSubmit={async (clienteData) => {
            setShowCrear(false)
            // refrescar lista si lo necesitás
          }}
        />
      )}
      {clienteSeleccionado && (
        <EditarCliente
          cliente={clienteSeleccionado}
          onCancel={() => setClienteSeleccionado(null)}
          onSuccess={() => setClienteSeleccionado(null)}
        />
      )}
    </>
  )
}
