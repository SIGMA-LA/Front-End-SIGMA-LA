'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import EmpleadoCard from './EmpleadoCard'
import type { Empleado } from '@/types'

interface EmpleadosListByRoleProps {
  title: string
  icon: React.ReactNode
  empleados: Empleado[]
  colorClass?: string
}

export default function EmpleadosListByRole({
  title,
  icon,
  empleados,
}: EmpleadosListByRoleProps) {
  if (empleados.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          {icon}
          <span className="ml-3">
            {title} ({empleados.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {empleados.map((empleado) => (
            <EmpleadoCard key={empleado.cuil} empleado={empleado} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
