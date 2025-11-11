import { ArrowLeft } from 'lucide-react'
import EmpleadoFormulario from '@/components/admin/EmpleadoFormulario'
import { updateEmpleado, getEmpleado } from '@/actions/empleado'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditarEmpleadoPage({
  params,
}: {
  params: Promise<{ cuil: string }>
}) {
  const { cuil } = await params
  const empleado = await getEmpleado(cuil)

  if (!empleado) {
    notFound()
  }

  async function handleUpdate(data: any) {
    'use server'

    const { contrasenia, ...updateData } = data
    const dataToUpdate = contrasenia
      ? { ...updateData, contrasenia }
      : updateData

    const result = await updateEmpleado(cuil, dataToUpdate)

    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar empleado')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/admin/empleados"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver a empleados
          </Link>
        </div>

        <EmpleadoFormulario empleado={empleado} onSubmit={handleUpdate} />
      </div>
    </div>
  )
}
