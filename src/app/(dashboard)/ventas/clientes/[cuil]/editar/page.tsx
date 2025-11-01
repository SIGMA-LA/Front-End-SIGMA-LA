import CrearClienteForm from '@/components/ventas/CrearCliente'
import { obtenerCliente, actualizarCliente } from '@/actions/clientes'
import { redirect, notFound } from 'next/navigation'

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ cuil: string }>
}) {
  const { cuil } = await params
  const cliente = await obtenerCliente(cuil)

  if (!cliente) {
    notFound()
  }

  async function handleActualizar(prevState: any, formData: FormData) {
    'use server'

    try {
      const raw = Object.fromEntries(formData.entries())
      const result = await actualizarCliente(cuil, raw as any)

      if (!result) {
        return {
          success: false,
          error: 'No se pudo actualizar el cliente',
        }
      }

      redirect('/ventas/clientes')
    } catch (error: any) {
      console.error('[handleActualizar]', error)
      return {
        success: false,
        error: error?.message || 'Error al actualizar el cliente',
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <CrearClienteForm
          action={handleActualizar}
          cliente={cliente}
          cancelUrl="/ventas/clientes"
        />
      </div>
    </div>
  )
}
