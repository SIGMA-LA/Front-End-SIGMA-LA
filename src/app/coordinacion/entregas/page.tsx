'use client'

import { useRouter } from 'next/navigation'
import EntregasList from '@/components/shared/EntregasList'

export default function EntregasPage() {
  const router = useRouter()

  return (
    <EntregasList
      onCreateClick={() => {
        router.push('/coordinacion/entregas/crear')
      }}
    />
  )
}
