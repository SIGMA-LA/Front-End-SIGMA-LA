'use client'

import { ArrowLeft } from 'lucide-react'
import LocalidadFormulario from '@/components/admin/LocalidadFormulario'
import { createLocalidad } from '@/actions/localidad'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { notify } from '@/lib/toast'

import type { CreateLocalidadData } from '@/types'

export default function CrearLocalidadPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(data: CreateLocalidadData) {
    setIsPending(true)
    setError(null)

    try {
      const result = await createLocalidad(data)
      if (result.success) {
        notify.success('Localidad creada correctamente.')
        router.push('/admin/localidades')
        router.refresh()
      } else {
        setError(result.error || 'Error al crear la localidad')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al crear la localidad'
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/admin/localidades"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver a localidades
          </Link>
        </div>

        <LocalidadFormulario
          onSubmit={handleCreate}
          isPending={isPending}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  )
}
