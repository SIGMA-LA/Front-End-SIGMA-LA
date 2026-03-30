import { Suspense } from 'react'
import { Wrench, Plus } from 'lucide-react'
import { getMaquinarias } from '@/actions/maquinarias'
import MaquinariasPageContent from '@/components/pages/MaquinariasPageContent'
import Link from 'next/link'

async function MaquinariasList() {
  const maquinarias = await getMaquinarias()
  return <MaquinariasPageContent maquinarias={maquinarias} />
}

function MaquinariasListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="flex gap-2">
            <div className="h-9 flex-1 animate-pulse rounded bg-gray-200"></div>
            <div className="h-9 flex-1 animate-pulse rounded bg-gray-200"></div>
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function MaquinariasPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Gestión de Maquinarias
              </h1>
              <p className="text-sm text-gray-600">
                Administra y controla el inventario de maquinarias
              </p>
            </div>
          </div>
          <Link
            href="/coordinacion/maquinarias/crear"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Maquinaria
          </Link>
        </div>

        <Suspense fallback={<MaquinariasListSkeleton />}>
          <MaquinariasList />
        </Suspense>
      </div>
    </div>
  )
}
