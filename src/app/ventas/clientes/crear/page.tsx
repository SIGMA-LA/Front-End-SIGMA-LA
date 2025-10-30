import CrearCliente from '@/components/ventas/CrearCliente'
import { crearCliente } from '@/actions/clientes'
import { redirect } from 'next/dist/client/components/navigation'

export default function Page() {
  const action = async (formData: FormData) => {
    'use server'
    const cliente = await crearCliente(formData)
    if (!cliente) {
      throw new Error('No se pudo crear el cliente')
    }
    redirect('/ventas/clientes')
  }

  return <CrearCliente action={action} cancelUrl="/ventas/clientes" />
}
