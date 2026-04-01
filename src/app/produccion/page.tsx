import { Suspense } from 'react'
import { getUsuario } from '@/lib/cache'
import { getNotasFabricaProduccion } from '@/actions/obras'
import Navbar from '@/components/layout/Navbar'
import ProduccionClient from '@/components/produccion/ProduccionClient'
import ProduccionSkeleton from '@/components/produccion/ProduccionSkeleton'

async function getInitialNotasData() {
  try {
    return await getNotasFabricaProduccion({ estado: 'SIN_ORDEN' })
  } catch (error) {
    console.error('Error al cargar notas iniciales de producción:', error)
    return []
  }
}

async function ProduccionContent() {
  const [empleadoData, initialNotasSinOrden] = await Promise.all([
    getUsuario(),
    getInitialNotasData(),
  ])

  if (!empleadoData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl lg:text-2xl">
          Error: No se pudo cargar el usuario
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar usuario={empleadoData} />
      <ProduccionClient
        usuario={empleadoData}
        initialNotasSinOrden={initialNotasSinOrden}
      />
    </>
  )
}

export default function ProduccionPage() {
  return (
    <Suspense fallback={<ProduccionSkeleton />}>
      <ProduccionContent />
    </Suspense>
  )
}
