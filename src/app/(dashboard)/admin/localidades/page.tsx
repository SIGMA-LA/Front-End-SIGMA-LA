import Link from 'next/link'
import { Plus, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function LocalidadesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Localidades
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona las localidades del sistema
            </p>
          </div>
          <Link href="/admin/localidades/crear">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Localidad
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No hay localidades
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Comienza creando tu primera localidad.
            </p>
            <Link href="/admin/localidades/crear" className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Localidad
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}