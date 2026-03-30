import { ArrowLeft, UserX } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
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

        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <UserX className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Empleado no encontrado
          </h2>
          <p className="mt-2 text-gray-600">
            El empleado que buscas no existe o fue eliminado.
          </p>
          <Link
            href="/admin/empleados"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Ver todos los empleados
          </Link>
        </div>
      </div>
    </div>
  )
}
