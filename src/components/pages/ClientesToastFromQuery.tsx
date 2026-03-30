'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { notify } from '@/lib/toast'

interface ClientesToastFromQueryProps {
  toast?: string
}

const toastMessages: Record<string, string> = {
  'cliente-creado': 'Cliente creado correctamente.',
  'cliente-actualizado': 'Cliente actualizado correctamente.',
}

export default function ClientesToastFromQuery({
  toast,
}: ClientesToastFromQueryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!toast) return

    const message = toastMessages[toast]
    if (message) {
      notify.success(message)
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete('toast')
    const nextQuery = params.toString()

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }, [toast, pathname, router, searchParams])

  return null
}
