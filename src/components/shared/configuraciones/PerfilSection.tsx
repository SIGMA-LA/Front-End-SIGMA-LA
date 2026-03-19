import { User } from 'lucide-react'

interface PerfilSectionProps {
  perfil: {
    nombre: string;
    apellido: string;
    cuil: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PerfilSection({ perfil, onChange }: PerfilSectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Perfil</h3>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={perfil.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={perfil.apellido}
            onChange={(e) => onChange('apellido', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">CUIL</label>
          <input
            type="text"
            value={perfil.cuil}
            onChange={(e) => onChange('cuil', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
