import { Users, Building, Plus } from 'lucide-react'
import { Suspense } from 'react'
import { obtenerTodosLosEmpleados } from '@/actions/empleado'
import EmpleadosListByRole from '@/components/admin/EmpleadosListByRole'
import SearchWrapper from '@/components/shared/SearchWrapper'
import Link from 'next/link'

async function EmpleadosList({ searchQuery }: { searchQuery?: string }) {
  const empleados = await obtenerTodosLosEmpleados()

  // Filtrar empleados según la búsqueda
  const filteredEmpleados = searchQuery
    ? empleados.filter(
        (emp) =>
          emp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.cuil.includes(searchQuery) ||
          emp.area_trabajo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : empleados

  const sections = {
    admin: filteredEmpleados.filter((u) => u.rol_actual === 'ADMIN'),
    coordinacion: filteredEmpleados.filter(
      (u) => u.rol_actual === 'COORDINACION'
    ),
    ventas: filteredEmpleados.filter((u) => u.rol_actual === 'VENTAS'),
    visitadores: filteredEmpleados.filter((u) => u.rol_actual === 'VISITADOR'),
    planta: filteredEmpleados.filter((u) => u.rol_actual === 'PLANTA'),
    produccion: filteredEmpleados.filter((u) => u.rol_actual === 'PRODUCCION'),
  }

  if (filteredEmpleados.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {searchQuery
            ? 'No se encontraron empleados'
            : 'No hay empleados registrados'}
        </h3>
        <p className="mt-2 text-gray-600">
          {searchQuery
            ? 'Intenta con otros términos de búsqueda'
            : 'Comienza creando el primer empleado'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <EmpleadosListByRole
        title="Administradores"
        icon={<Users className="h-6 w-6 text-red-500" />}
        empleados={sections.admin}
        colorClass="red"
      />

      <EmpleadosListByRole
        title="Coordinación"
        icon={<Users className="h-6 w-6 text-blue-500" />}
        empleados={sections.coordinacion}
        colorClass="blue"
      />

      <EmpleadosListByRole
        title="Ventas"
        icon={<Users className="h-6 w-6 text-purple-500" />}
        empleados={sections.ventas}
        colorClass="purple"
      />

      <EmpleadosListByRole
        title="Visitadores"
        icon={<Users className="h-6 w-6 text-orange-500" />}
        empleados={sections.visitadores}
        colorClass="orange"
      />

      <EmpleadosListByRole
        title="Planta"
        icon={<Building className="h-6 w-6 text-green-500" />}
        empleados={sections.planta}
        colorClass="green"
      />

      <EmpleadosListByRole
        title="Producción"
        icon={<Users className="h-6 w-6 text-indigo-500" />}
        empleados={sections.produccion}
        colorClass="indigo"
      />

      <div className="mt-6 text-center text-sm text-gray-600">
        Mostrando {filteredEmpleados.length} empleado
        {filteredEmpleados.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

function EmpleadosListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface EmpleadosPageContentProps {
  searchQuery?: string
  canCreate?: boolean
  createUrl?: string
  title?: string
  subtitle?: string
}

export default async function EmpleadosPageContent({
  searchQuery = '',
  canCreate = true,
  createUrl = '/admin/empleados/crear',
  title = 'Gestión de Empleados',
  subtitle = 'Administra el personal de la empresa',
}: EmpleadosPageContentProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          {canCreate && (
            <Link
              href={createUrl}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Nuevo Empleado
            </Link>
          )}
        </div>

        <div className="mb-8">
          <SearchWrapper
            placeholder="Buscar empleado por nombre, CUIL, área..."
            initialValue={searchQuery}
          />
        </div>

        <Suspense key={searchQuery} fallback={<EmpleadosListSkeleton />}>
          <EmpleadosList searchQuery={searchQuery} />
        </Suspense>
      </div>
    </div>
  )
}
