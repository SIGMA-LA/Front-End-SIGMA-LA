'use client'

interface DateTimeSelectionProps {
  fecha: string
  hora: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
}

export default function DateTimeSelection({
  fecha,
  hora,
  onDateChange,
  onTimeChange,
}: DateTimeSelectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Fecha y hora programada *
        </label>
        <div className="flex gap-3">
          <input
            type="date"
            value={fecha}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => onTimeChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  )
}
