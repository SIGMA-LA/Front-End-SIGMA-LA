import CrearClienteForm from '@/components/ventas/CrearCliente'
import { createCliente, type ActionResponse } from '@/actions/clientes'
import { redirect } from 'next/navigation'

export default function CrearClienteAdminPage() {
  async function handleCrear(
    prevState: ActionResponse | null,
    formData: FormData
  ) {
    'use server'

    const result = await createCliente(formData)

    if (result.success) {
      redirect('/admin/clientes?toast=cliente-creado')
    }

    return result
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <CrearClienteForm
          action={handleCrear}
          cancelUrl="/admin/clientes"
          title="Nuevo Cliente"
          subtitle="Registra un nuevo cliente en el sistema"
        />
      </div>
    </div>
  )
}
