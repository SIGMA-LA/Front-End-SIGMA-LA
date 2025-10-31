import VisitasList from '@/components/shared/VisitasList'
import { Visita, Empleado } from '@/types'
import { obtenerVisitas } from '@/actions/visitas'
import { obtenerEmpleadoPorCuil } from '@/actions/empleado'
import { cache } from 'react'

const getVisitasCache = cache(async () => {
  return await obtenerVisitas()
})

async function getEmpleadosDeVisitas(visitas: Visita[]) {
  const cuilsUnicos = new Set<string>()

  visitas.forEach((visita) => {
    if (Array.isArray(visita.empleado_visita)) {
      visita.empleado_visita.forEach((ev) => {
        if (ev?.cuil) {
          cuilsUnicos.add(ev.cuil)
        }
      })
    }
  })

  const empleadosPromises = Array.from(cuilsUnicos).map((cuil) =>
    obtenerEmpleadoPorCuil(cuil).catch(() => null)
  )

  const empleadosArray = await Promise.all(empleadosPromises)

  const empleadosMap = new Map<string, Empleado>()
  empleadosArray.forEach((emp, idx) => {
    if (emp) {
      empleadosMap.set(Array.from(cuilsUnicos)[idx], emp)
    }
  })

  return empleadosMap
}

export default async function VisitasPage() {
  const visitas = await getVisitasCache()

  const empleadosMap = await getEmpleadosDeVisitas(visitas)

  return <VisitasList visitas={visitas} empleadosMap={empleadosMap} />
}

export const revalidate = 30
