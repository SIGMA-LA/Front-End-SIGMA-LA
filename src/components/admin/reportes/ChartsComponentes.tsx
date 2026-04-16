'use client'

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
import { formatCurrency } from '@/lib/reportes-utils'
import {
  COLORES_ESTADO_OBRA,
  COLORES_ESTADO_VISITA,
  COLORES_ESTADO_ENTREGA,
} from '@/constants'

// ---------------------------------------------------------------------------
// Tooltip Components
// ---------------------------------------------------------------------------

interface ChartPayloadEntry {
  value: number
  name: string
  color: string
  payload: Record<string, string | number>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: ChartPayloadEntry[]
  label?: string
}

export function CurrencyTooltip({ active, payload, label }: CustomTooltipProps) {
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

export function CountTooltip({ active, payload, label }: CustomTooltipProps) {
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

// ---------------------------------------------------------------------------
// Empty State & Helper Components
// ---------------------------------------------------------------------------

export function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-gray-400">
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Specialized Charts
// ---------------------------------------------------------------------------

export function VentasBarChart({ data }: { data: { name: string; ventas: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
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
  )
}

export function ObrasPieChart({ data }: { data: { fullName: string; value: number; name: string }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }: { name?: string; value?: number }) => `${name || ''} (${value || 0})`}
            labelLine={{ strokeWidth: 1 }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.fullName}
                fill={COLORES_ESTADO_OBRA[entry.fullName as keyof typeof COLORES_ESTADO_OBRA] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: string | number | ReadonlyArray<string | number> | undefined) => {
              const val = Array.isArray(value) ? value[0] : value
              return [`${val?.toString() || '0'} obras`, 'Cantidad']
            }}
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
  )
}

export function VisitasHorizBarChart({ data }: { data: { fullName: string; cantidad: number; name: string }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
          <Tooltip content={<CountTooltip />} />
          <Bar dataKey="cantidad" name="Visitas" radius={[0, 6, 6, 0]} maxBarSize={35}>
            {data.map((entry) => (
              <Cell
                key={entry.fullName}
                fill={COLORES_ESTADO_VISITA[entry.fullName as keyof typeof COLORES_ESTADO_VISITA] || '#94a3b8'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function EntregasHorizBarChart({ data }: { data: { fullName: string; cantidad: number; name: string }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
          <Tooltip content={<CountTooltip />} />
          <Bar dataKey="cantidad" name="Entregas" radius={[0, 6, 6, 0]} maxBarSize={35}>
            {data.map((entry) => (
              <Cell
                key={entry.fullName}
                fill={COLORES_ESTADO_ENTREGA[entry.fullName as keyof typeof COLORES_ESTADO_ENTREGA] || '#94a3b8'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function IngresosAreaChart({ data }: { data: { name: string; ingresos: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
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
  )
}
