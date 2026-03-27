import CrearClienteForm from '@/components/ventas/CrearCliente'
import { createCliente, type ActionResponse } from '@/actions/clientes'
import { redirect } from 'next/navigation'

export default function CrearClientePage() {
  async function handleCrear(
    prevState: ActionResponse | null,
    formData: FormData
  ) {
    'use server'

    try {
      const result = await createCliente(formData)

      if (result.success) {
        redirect('/ventas/clientes?toast=cliente-creado')
      }

      return result
    } catch (error: unknown) {
      console.error('Error al crear cliente:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al crear cliente',
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <CrearClienteForm
          action={handleCrear}
          title="Nuevo Cliente"
          subtitle="Registra un nuevo cliente en el sistema"
        />
      </div>
    </div>
  )
}
