'use client'

interface ObservacionesProps {
  value: string
  onChange: (value: string) => void
}

export default function Observaciones({ value, onChange }: ObservacionesProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Observaciones:
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Observaciones adicionales..."
      />
    </div>
  )
}
