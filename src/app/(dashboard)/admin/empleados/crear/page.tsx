import { ArrowLeft } from 'lucide-react'
import EmpleadoFormulario from '@/components/admin/EmpleadoFormulario'
import { crearEmpleado } from '@/actions/empleado'
import Link from 'next/link'

export default function CrearEmpleadoPage() {
  async function handleCreate(data: any) {
    'use server'

    const result = await crearEmpleado(data)

    if (!result.success) {
      throw new Error(result.error || 'Error al crear empleado')
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

        <EmpleadoFormulario onSubmit={handleCreate} />
      </div>
    </div>
  )
}
