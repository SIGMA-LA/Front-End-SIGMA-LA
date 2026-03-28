import { Wallet, AlertCircle } from 'lucide-react'

interface ViaticosSectionProps {
  diasViaticos: number
  totalViaticos: number
  viaticoPorDia: number
  numAcompanantes: number
  hayEncargado: boolean
}

export default function ViaticosSection({
  diasViaticos,
  totalViaticos,
  viaticoPorDia,
  numAcompanantes,
  hayEncargado,
}: ViaticosSectionProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)

  const totalPersonas = (hayEncargado ? 1 : 0) + numAcompanantes

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="rounded-lg bg-emerald-100/80 p-2 shadow-inner">
          <Wallet className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-slate-800">Gastos y Viáticos Calculados</h3>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
          
          <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Despliegue Operativo</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-800">{diasViaticos}</span>
              <span className="text-sm font-medium text-slate-600 mb-1">{diasViaticos === 1 ? 'Día' : 'Días'}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Autocalculado según fechas</p>
          </div>

          <div className="flex-[2] rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/30 p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-600/80 mb-2">Proyección Financiera</span>
            {totalPersonas > 0 ? (
              <div className="flex flex-col justify-center h-full">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-700">
                    {formatCurrency(totalViaticos)}
                  </span>
                  <span className="text-sm font-medium text-emerald-600/70">
                    total estimado
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700/60 mt-2 font-medium bg-emerald-100/30 w-fit px-2 py-1 rounded-md">
                  Calculado base: {diasViaticos} día{diasViaticos !== 1 ? 's' : ''} × {totalPersonas} persona{totalPersonas !== 1 ? 's' : ''} × {formatCurrency(viaticoPorDia)}
                </p>
              </div>
            ) : (
              <div className="flex h-full items-center gap-3 pb-2 text-emerald-700/60">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Asigna personal a los recursos para previsualizar el total.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
