import CrearClienteForm from '@/components/ventas/CrearCliente'
import {
  getCliente,
  updateCliente,
  type ActionResponse,
} from '@/actions/clientes'
import { redirect, notFound } from 'next/navigation'

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ cuil: string }>
}) {
  const { cuil } = await params
  const cliente = await getCliente(cuil)

  if (!cliente) {
    notFound()
  }

  async function handleActualizar(
    prevState: ActionResponse | null,
    formData: FormData
  ) {
    'use server'

    let result: ActionResponse
    try {
      result = await updateCliente(cuil, formData)
    } catch (error: unknown) {
      console.error('Error al actualizar cliente:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al actualizar cliente',
      }
    }

    if (result.success) {
      redirect('/ventas/clientes')
    }

    return result
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <CrearClienteForm
          action={handleActualizar}
          initialData={cliente}
          title="Editar Cliente"
          subtitle={`Actualizando información de ${cliente.nombre || cliente.razon_social}`}
        />
      </div>
    </div>
  )
}
