'use client'

import {
  Building,
  Eye,
  Truck,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/reportes-utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  color: 'blue' | 'purple' | 'green' | 'amber'
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-600 text-blue-100',
    purple: 'bg-purple-600 text-purple-100',
    green: 'bg-green-600 text-green-100',
    amber: 'bg-amber-500 text-amber-100',
  }
  const iconColor = {
    blue: 'text-blue-200',
    purple: 'text-purple-200',
    green: 'text-green-200',
    amber: 'text-amber-200',
  }

  return (
    <Card className={`${colorClasses[color]} border-0 text-white`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-9 w-9 ${iconColor[color]}`} />
        </div>
      </CardContent>
    </Card>
  )
}

interface ReportesStatsProps {
  obrasActivas: number
  totalVisitasMes: number
  totalEntregasMes: number
  ingresosMes: number
  currentMonthLabel: string
}

export function ReportesStats({
  obrasActivas,
  totalVisitasMes,
  totalEntregasMes,
  ingresosMes,
  currentMonthLabel,
}: ReportesStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Obras Activas"
        value={obrasActivas}
        icon={Building}
        color="blue"
      />
      <StatCard
        label={`Visitas en ${currentMonthLabel}`}
        value={totalVisitasMes}
        icon={Eye}
        color="purple"
      />
      <StatCard
        label={`Entregas en ${currentMonthLabel}`}
        value={totalEntregasMes}
        icon={Truck}
        color="amber"
      />
      <StatCard
        label={`Ingresos de ${currentMonthLabel}`}
        value={formatCurrency(ingresosMes)}
        icon={DollarSign}
        color="green"
      />
    </div>
  )
}
