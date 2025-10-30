import CrearCliente from '@/components/ventas/CrearCliente'
import { obtenerCliente, actualizarCliente } from '@/actions/clientes'
import { redirect } from 'next/navigation'
import type { Cliente } from '@/types'

export default async function Page({ params }: { params: { cuil: string } }) {
  const cuilParam = params.cuil
  let cliente: Cliente | null = null
  try {
    cliente = await obtenerCliente(cuilParam)
  } catch (err) {
    console.error('[clientes/[cuil]/page] obtenerCliente error:', err)
  }

  if (!cliente) {
    redirect('/ventas/clientes')
  }

  const action = async (formData: FormData) => {
    'use server'
    try {
      const raw = Object.fromEntries(formData.entries()) as Record<
        string,
        FormDataEntryValue
      >
      const getString = (k: string) =>
        typeof raw[k] === 'string' ? (raw[k] as string).trim() : ''

      const newCuilRaw = getString('cuil')
      const newCuil = newCuilRaw.replace(/\D/g, '')

      const originalCuilRaw = getString('original_cuil') || cuilParam
      const originalCuil = originalCuilRaw.replace(/\D/g, '')

      if (!newCuil || newCuil.length !== 11) {
        const msg = encodeURIComponent('CUIL inválido (debe tener 11 dígitos)')
        redirect(
          `/ventas/clientes/${encodeURIComponent(cuilParam)}?error=${msg}`
        )
      }

      if (!originalCuil || originalCuil.length !== 11) {
        const msg = encodeURIComponent('Original CUIL inválido')
        redirect(
          `/ventas/clientes/${encodeURIComponent(cuilParam)}?error=${msg}`
        )
      }

      // armar payload con los campos esperados
      const payload: Partial<Cliente> = {
        cuil: newCuil,
        tipo_cliente: getString('tipo_cliente') as Cliente['tipo_cliente'],
        telefono: getString('telefono'),
        mail: getString('mail'),
        razon_social: getString('razon_social'),
        nombre: getString('nombre'),
        apellido: getString('apellido'),
        sexo: getString('sexo'),
      }

      const updated = await actualizarCliente(originalCuil, payload)

      if (!updated) {
        const msg = encodeURIComponent('No se pudo actualizar el cliente')
        redirect(
          `/ventas/clientes/${encodeURIComponent(cuilParam)}?error=${msg}`
        )
      }
      redirect('/ventas/clientes')
    } catch (err: any) {
      if (
        err?.message === 'NEXT_REDIRECT' ||
        String(err?.message ?? '').includes('NEXT_REDIRECT') ||
        (typeof err?.digest === 'string' &&
          err.digest.startsWith('NEXT_REDIRECT'))
      ) {
        throw err
      }

      console.error('[clientes/[cuil]/action] actualizar error:', err)
      const msg = encodeURIComponent(
        String(err?.message ?? 'Error desconocido')
      )
      redirect(`/ventas/clientes/${encodeURIComponent(cuilParam)}?error=${msg}`)
    }
  }
  return (
    <CrearCliente
      action={action}
      cancelUrl="/ventas/clientes"
      cliente={cliente}
    />
  )
}
