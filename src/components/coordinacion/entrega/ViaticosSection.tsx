interface ViaticosSectionProps {
  diasViaticos: number
  onDiasViaticosChange: (value: number) => void
  totalViaticos: number
  viaticoPorDia: number
  numAcompanantes: number
  hayEncargado: boolean
}

export default function ViaticosSection({
  diasViaticos,
  onDiasViaticosChange,
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
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-4 font-semibold text-gray-900">Viáticos</h3>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Días de viático
        </label>
        <input
          type="number"
          min="0"
          value={diasViaticos}
          onChange={(e) => onDiasViaticosChange(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {diasViaticos > 0 && totalPersonas > 0 && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-gray-600">
            {diasViaticos} días × {totalPersonas} persona
            {totalPersonas !== 1 ? 's' : ''} × {formatCurrency(viaticoPorDia)}
          </p>
          <p className="mt-1 text-lg font-bold text-blue-900">
            Total: {formatCurrency(totalViaticos)}
          </p>
        </div>
      )}
    </div>
  )
}
