'use client'

import CrearObra from '@/components/ventas/CrearObra'
import { useRouter } from 'next/navigation'

export default function CrearObraPage() {
  const router = useRouter()

  return (
    <CrearObra
      onCancel={() => router.push('/ventas/obras')}
      onSubmit={async (obraData, presupuesto) => {
        router.push('/ventas/obras')
      }}
    />
  )
}
