"use client"

interface ConfiguracionesProps {
  className?: string
}

export default function Configuraciones({ className = "" }: ConfiguracionesProps) {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Configuraciones</h1>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="grid gap-6">
            <div className="border-b border-blue-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil de Usuario</h3>
              <p className="text-gray-600">Gestiona tu información personal y preferencias.</p>
            </div>
            <div className="border-b border-blue-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notificaciones</h3>
              <p className="text-gray-600">Configura cómo y cuándo recibir notificaciones.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sistema</h3>
              <p className="text-gray-600">Configuraciones generales del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}