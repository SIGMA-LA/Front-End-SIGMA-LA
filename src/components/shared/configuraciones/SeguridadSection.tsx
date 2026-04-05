import { useState } from 'react'
import { Shield } from 'lucide-react'
import { ChangePasswordModal } from './ChangePasswordModal'
import { changePasswordConfig } from '@/actions/configuraciones'

export function SeguridadSection() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handlePasswordSave = async (current: string, newPass: string) => {
    // Aquí invocamos al server action
    const res = await changePasswordConfig(current, newPass)
    if (res && res.success === false) {
      throw new Error(res.error || 'Error al cambiar la contraseña')
    }
  }

  return (
    <>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Seguridad y Datos
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="rounded-lg border border-gray-300 p-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="font-medium text-gray-900">Cambiar Contraseña</div>
              <div className="mt-1 text-sm text-gray-500">
                Actualiza tu contraseña de acceso
              </div>
            </button>
          <button className="rounded-lg border border-gray-300 p-4 text-left transition-colors hover:bg-gray-50">
            <div className="font-medium text-gray-900">Configurar 2FA</div>
            <div className="mt-1 text-sm text-gray-500">
              Autenticación de dos factores
            </div>
          </button>
          <button className="rounded-lg border border-gray-300 p-4 text-left transition-colors hover:bg-gray-50">
            <div className="font-medium text-gray-900">Exportar Datos</div>
            <div className="mt-1 text-sm text-gray-500">
              Descarga una copia de seguridad
            </div>
          </button>
          <button className="rounded-lg border border-red-300 p-4 text-left transition-colors hover:bg-red-50">
            <div className="font-medium text-red-600">Eliminar Cuenta</div>
            <div className="mt-1 text-sm text-red-500">Acción irreversible</div>
          </button>
        </div>
      </div>
    </div>
    
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onSave={handlePasswordSave} 
      />
    </>
  )
}
