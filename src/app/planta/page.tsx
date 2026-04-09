import { redirect } from 'next/navigation'
import PlantaClient from '@/components/planta/PlantaClient'
import { Suspense } from 'react'
import { getEntregasByEmpleado } from '@/actions/entregas'
import { getUsuario } from '@/lib/cache'
import Navbar from '@/components/layout/Navbar'

const PAGE_SIZE = 10

async function getEntregasData(cuil: string) {
  try {
    const response = await getEntregasByEmpleado(cuil, 'PENDIENTE', undefined, undefined, 1, PAGE_SIZE)
    return { response, error: null }
  } catch (error) {
    console.error('Error al cargar entregas:', error)
    return {
      response: { data: [], total: 0, totalPages: 0, page: 1, pageSize: PAGE_SIZE },
      error: 'Error al cargar las entregas',
    }
  }
}
function PlantaSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header Skeleton */}
      <div className="border-b bg-white px-2 py-4 sm:px-5 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center justify-between sm:justify-start">
            <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200 lg:hidden" />
            <div className="flex flex-1 flex-col items-center gap-2 sm:ml-3 sm:items-start">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-64" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200 sm:w-48" />
            </div>
            <div className="flex gap-2 sm:hidden">
              <div className="h-16 w-20 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-16 w-20 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
          <div className="hidden gap-6 sm:flex">
            <div className="h-20 w-28 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-20 w-28 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="hidden w-96 border-r bg-white lg:block lg:w-[28rem]">
          <div className="flex h-full flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              <div className="h-12 w-1/2 animate-pulse bg-gray-200" />
              <div className="h-12 w-1/2 animate-pulse bg-gray-100" />
            </div>
            {/* Lista de entregas */}
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border bg-white p-4"
                >
                  <div className="mb-2 h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <main className="flex-1 animate-pulse bg-gray-100 p-4 lg:p-8">
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-8 w-1/2 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default async function PlantaPage() {
  const usuario = await getUsuario()

  if (!usuario) {
    redirect('/login')
  }

  const { response, error } = await getEntregasData(usuario.cuil)

  return (
    <Suspense fallback={<PlantaSkeleton />}>
      <Navbar usuario={usuario} />
      <PlantaClient
        usuario={usuario}
        responseInitial={response}
        errorInitial={error}
      />
    </Suspense>
  )
}
