'use client'

interface ObservacionesProps {
  value: string
  onChange: (value: string) => void
}

export default function Observaciones({ value, onChange }: ObservacionesProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Observaciones adicionales
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        placeholder="Observaciones adicionales..."
      />
    </div>
  )
}
