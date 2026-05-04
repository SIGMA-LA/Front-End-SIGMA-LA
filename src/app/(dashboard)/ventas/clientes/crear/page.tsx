import CrearClienteForm from '@/components/ventas/CrearCliente'
import { createCliente, type ActionResponse } from '@/actions/clientes'
import { redirect } from 'next/navigation'

import type { SearchParams, Cliente } from '@/types'

export default async function CrearClientePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const nombreRaw = typeof sp.nombre === 'string' ? sp.nombre : undefined
  const telefonoRaw = typeof sp.telefono === 'string' ? sp.telefono : undefined
  
  let nombre = ''
  let apellido = ''
  if (nombreRaw) {
    const parts = nombreRaw.split(' ')
    if (parts.length > 1) {
      apellido = parts.pop() || ''
      nombre = parts.join(' ')
    } else {
      nombre = nombreRaw
    }
  }

  const prefillData = (nombre || telefonoRaw) ? {
    cuil: '',
    tipo_cliente: 'PERSONA_FISICA',
    nombre: nombre,
    apellido: apellido,
    telefono: telefonoRaw || '',
    mail: '',
  } : undefined

  async function handleCrear(
    prevState: ActionResponse | null,
    formData: FormData
  ) {
    'use server'

    const result = await createCliente(formData)

    if (result.success) {
      redirect('/ventas/clientes?toast=cliente-creado')
    }

    return result
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <CrearClienteForm
          action={handleCrear}
          title="Nuevo Cliente"
          subtitle="Registra un nuevo cliente en el sistema"
          prefillData={prefillData as Partial<Cliente>}
        />
      </div>
    </div>
  )
}
