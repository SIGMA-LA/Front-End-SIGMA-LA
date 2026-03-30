import { Suspense } from 'react'
import { getUsuario } from '@/lib/cache'
import {
  getNotasConOrdenEnProceso,
  getNotasSinOrdenAprobada,
} from '@/actions/obras'
import { getOrdenesValidadas, getOrdenesEnProduccion } from '@/actions/ordenes'
import Navbar from '@/components/layout/Navbar'
import ProduccionClient from '@/components/produccion/ProduccionClient'
import ProduccionSkeleton from '@/components/produccion/ProduccionSkeleton'

async function getProduccionData() {
  try {
    const [
      obrasSinOrden,
      obrasEnProceso,
      ordenesAprobadas,
      ordenesEnProduccion,
    ] = await Promise.all([
      getNotasSinOrdenAprobada(),
      getNotasConOrdenEnProceso(),
      getOrdenesValidadas(),
      getOrdenesEnProduccion(),
    ])

    return {
      obrasSinOrden,
      obrasEnProceso,
      ordenesAprobadas,
      ordenesEnProduccion,
    }
  } catch (error) {
    console.error('Error al cargar datos de producción:', error)
    return {
      obrasSinOrden: [],
      obrasEnProceso: [],
      ordenesAprobadas: [],
      ordenesEnProduccion: [],
    }
  }
}

async function ProduccionContent() {
  const [empleadoData, produccionData] = await Promise.all([
    getUsuario(),
    getProduccionData(),
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
      <ProduccionClient usuario={empleadoData} {...produccionData} />
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
