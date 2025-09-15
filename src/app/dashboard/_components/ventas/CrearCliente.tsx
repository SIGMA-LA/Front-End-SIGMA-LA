'use client'

import { User, Plus } from 'lucide-react'
import { CrearClienteProps } from '@/types'

export default function CrearCliente({
  onCancel,
  onSubmit,
}: CrearClienteProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para procesar el formulario
    if (onSubmit) {
      onSubmit({
        id: 0, // El backend generará un ID único
        nombre: (e.target as any)[0].value,
        apellido: (e.target as any)[1].value,
        email: (e.target as any)[2].value,
        telefono: (e.target as any)[8].value,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            Crear Cliente
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el nombre"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el apellido"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@email.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Localidad
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>Seleccione...</option>
                  <option>San Lorenzo</option>
                  <option>Rosario</option>
                  <option>Santa Fe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Calle y número"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  CP
                </label>
                <input
                  type="text"
                  placeholder="Código postal"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Razón Social
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la empresa (opcional)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  CUIL
                </label>
                <input
                  type="text"
                  placeholder="XX-XXXXXXXX-X"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="flex">
                  <input
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    className="w-full rounded-l-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-r-lg border border-l-0 border-gray-300 px-3 py-2.5 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Crear Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
