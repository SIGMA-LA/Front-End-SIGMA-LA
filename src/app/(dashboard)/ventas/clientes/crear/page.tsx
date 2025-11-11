import CrearClienteForm from '@/components/ventas/CrearCliente'
import { createCliente } from '@/actions/clientes'
import { redirect } from 'next/navigation'

export default function CrearClientePage() {
  async function handleCrear(formData: FormData) {
    'use server'
    try {
      const result = await createCliente(formData)

      if (!result || result.error) {
        return {
          success: false,
          error: result?.error || 'No se pudo crear el cliente',
        }
      }
      redirect('/ventas/clientes')
    } catch (error: any) {
      console.error('[handleCrear]', error)
      return {
        success: false,
        error: error?.message || 'Error al crear el cliente',
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <CrearClienteForm action={handleCrear} />
      </div>
    </div>
  )
}
