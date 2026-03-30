'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import {
  TrendingUp,
  Building,
  Eye,
  Truck,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Obra, Pago, Visita, Entrega } from '@/types'


const ESTADO_OBRA_COLORS: Record<string, string> = {
  'EN ESPERA DE PAGO': '#3b82f6',
  'PAGADA PARCIALMENTE': '#8b5cf6',
  'EN ESPERA DE STOCK': '#f59e0b',
  'EN PRODUCCION': '#06b6d4',
  'PRODUCCION FINALIZADA': '#10b981',
  'PAGADA TOTALMENTE': '#22c55e',
  ENTREGADA: '#6366f1',
  CANCELADA: '#ef4444',
}

const ESTADO_VISITA_COLORS: Record<string, string> = {
  PROGRAMADA: '#3b82f6',
  'EN CURSO': '#f59e0b',
  CANCELADA: '#ef4444',
  REPROGRAMADA: '#8b5cf6',
  COMPLETADA: '#10b981',
}

const ESTADO_ENTREGA_COLORS: Record<string, string> = {
  PENDIENTE: '#3b82f6',
  'EN CURSO': '#f59e0b',
  CANCELADO: '#ef4444',
  ENTREGADO: '#10b981',
}

const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]


function processVentasMensuales(pagos: Pago[]) {
  const now = new Date()
  const months: { key: string; label: string; total: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({
      key,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      total: 0,
    })
  }

  for (const pago of pagos) {
    const date = new Date(pago.fecha_pago)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const month = months.find((m) => m.key === key)
    if (month) month.total += pago.monto
  }

  return months.map((m) => ({ name: m.label, ventas: m.total }))
}

function processObrasPorEstado(obras: Obra[]) {
  const counts: Record<string, number> = {}
  for (const obra of obras) {
    counts[obra.estado] = (counts[obra.estado] || 0) + 1
  }
  return Object.entries(counts).map(([estado, cantidad]) => ({
    name: formatEstado(estado),
    value: cantidad,
    fullName: estado,
  }))
}

function processVisitasDelMes(visitas: Visita[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthVisitas = visitas.filter((v) => {
    const d = new Date(v.fecha_hora_visita)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const counts: Record<string, number> = {}
  for (const v of thisMonthVisitas) {
    const estado = v.estado || 'SIN ESTADO'
    counts[estado] = (counts[estado] || 0) + 1
  }

  return Object.entries(counts).map(([estado, cantidad]) => ({
    name: formatEstado(estado),
    cantidad,
    fullName: estado,
  }))
}

function processEntregasDelMes(entregas: Entrega[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthEntregas = entregas.filter((e) => {
    const d = new Date(e.fecha_hora_entrega)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const counts: Record<string, number> = {}
  for (const e of thisMonthEntregas) {
    counts[e.estado] = (counts[e.estado] || 0) + 1
  }

  return Object.entries(counts).map(([estado, cantidad]) => ({
    name: formatEstado(estado),
    cantidad,
    fullName: estado,
  }))
}

function processIngresosAcumulados(pagos: Pago[]) {
  const now = new Date()
  const months: { key: string; label: string; total: number; acumulado: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({
      key,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      total: 0,
      acumulado: 0,
    })
  }

  for (const pago of pagos) {
    const date = new Date(pago.fecha_pago)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const month = months.find((m) => m.key === key)
    if (month) month.total += pago.monto
  }

  let acc = 0
  for (const m of months) {
    acc += m.total
    m.acumulado = acc
  }

  return months.map((m) => ({ name: m.label, ingresos: m.acumulado }))
}

function formatEstado(estado: string) {
  return estado
    .split(' ')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}


interface ChartPayloadEntry {
  value: number
  name: string
  color: string
  payload: any
}

interface CustomTooltipProps {
  active?: boolean
  payload?: ChartPayloadEntry[]
  label?: string
}

function CurrencyTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

function CountTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-sm font-medium text-gray-600">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}


function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600 text-blue-100',
    purple: 'bg-purple-600 text-purple-100',
    green: 'bg-green-600 text-green-100',
    amber: 'bg-amber-500 text-amber-100',
  }
  const iconColor: Record<string, string> = {
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


function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-gray-400">
      <p className="text-sm">{message}</p>
    </div>
  )
}


interface ReportesViewProps {
  obras: Obra[]
  pagos: Pago[]
  visitas: Visita[]
  entregas: Entrega[]
}

export default function ReportesView({
  obras,
  pagos,
  visitas,
  entregas,
}: ReportesViewProps) {
  const ventasMensuales = useMemo(() => processVentasMensuales(pagos), [pagos])
  const obrasPorEstado = useMemo(() => processObrasPorEstado(obras), [obras])
  const visitasDelMes = useMemo(() => processVisitasDelMes(visitas), [visitas])
  const entregasDelMes = useMemo(() => processEntregasDelMes(entregas), [entregas])
  const ingresosAcumulados = useMemo(() => processIngresosAcumulados(pagos), [pagos])

  const now = new Date()
  const currentMonthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`

  // Summary stats
  const obrasActivas = obras.filter(
    (o) =>
      o.estado !== 'ENTREGADA' && o.estado !== 'CANCELADA'
  ).length

  const totalVisitasMes = visitasDelMes.reduce((sum, v) => sum + v.cantidad, 0)
  const totalEntregasMes = entregasDelMes.reduce((sum, e) => sum + e.cantidad, 0)
  const ingresosMes = ventasMensuales[ventasMensuales.length - 1]?.ventas ?? 0

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Reportes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de actividad y métricas del negocio
          </p>
        </div>

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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Ventas Mensuales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Ventas Mensuales
              </CardTitle>
              <p className="text-sm text-gray-500">
                Total cobrado por mes (últimos 6 meses)
              </p>
            </CardHeader>
            <CardContent>
              {ventasMensuales.every((m) => m.ventas === 0) ? (
                <EmptyChart message="No hay pagos registrados en los últimos 6 meses" />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventasMensuales} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(v: number) => formatCurrency(v)} tick={{ fontSize: 11 }} width={90} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Bar
                        dataKey="ventas"
                        name="Ventas"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Obras por Estado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Obras por Estado
              </CardTitle>
              <p className="text-sm text-gray-500">
                Distribución actual de obras ({obras.length} total)
              </p>
            </CardHeader>
            <CardContent>
              {obrasPorEstado.length === 0 ? (
                <EmptyChart message="No hay obras registradas" />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={obrasPorEstado}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }: { name?: string; value?: number }) => `${name || ''} (${value || 0})`}
                        labelLine={{ strokeWidth: 1 }}
                      >
                        {obrasPorEstado.map((entry) => (
                          <Cell
                            key={entry.fullName}
                            fill={ESTADO_OBRA_COLORS[entry.fullName] || '#94a3b8'}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: string | number | readonly (string | number)[] | null | undefined) => [
                          `${value ? (Array.isArray(value) ? value.join(', ') : value) : 0} obras`,
                          'Cantidad',
                        ]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visitas del Mes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Visitas de {currentMonthLabel}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Desglose por estado ({totalVisitasMes} total)
              </p>
            </CardHeader>
            <CardContent>
              {visitasDelMes.length === 0 ? (
                <EmptyChart message="No hay visitas agendadas este mes" />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={visitasDelMes}
                      layout="vertical"
                      margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                      <Tooltip content={<CountTooltip />} />
                      <Bar dataKey="cantidad" name="Visitas" radius={[0, 6, 6, 0]} maxBarSize={35}>
                        {visitasDelMes.map((entry) => (
                          <Cell
                            key={entry.fullName}
                            fill={ESTADO_VISITA_COLORS[entry.fullName] || '#94a3b8'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entregas del Mes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-500" />
                Entregas de {currentMonthLabel}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Desglose por estado ({totalEntregasMes} total)
              </p>
            </CardHeader>
            <CardContent>
              {entregasDelMes.length === 0 ? (
                <EmptyChart message="No hay entregas agendadas este mes" />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={entregasDelMes}
                      layout="vertical"
                      margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                      <Tooltip content={<CountTooltip />} />
                      <Bar dataKey="cantidad" name="Entregas" radius={[0, 6, 6, 0]} maxBarSize={35}>
                        {entregasDelMes.map((entry) => (
                          <Cell
                            key={entry.fullName}
                            fill={ESTADO_ENTREGA_COLORS[entry.fullName] || '#94a3b8'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ingresos Acumulados - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Ingresos Acumulados
            </CardTitle>
            <p className="text-sm text-gray-500">
              Tendencia de ingresos de los últimos 6 meses
            </p>
          </CardHeader>
          <CardContent>
            {ingresosAcumulados.every((m) => m.ingresos === 0) ? (
              <EmptyChart message="No hay ingresos registrados en los últimos 6 meses" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ingresosAcumulados}
                    margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} width={90} />
                    <Tooltip content={<CurrencyTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      name="Acumulado"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorIngresos)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
