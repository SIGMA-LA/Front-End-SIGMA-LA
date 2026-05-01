import { useState } from 'react'
import { Shield, Lock, Trash2 } from 'lucide-react'
import { ChangePasswordModal } from './ChangePasswordModal'
import { DeleteAccountModal } from './DeleteAccountModal'
import { changePasswordConfig } from '@/actions/configuraciones'
import { logoutAction } from '@/actions/auth'

export function SeguridadSection() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handlePasswordSave = async (current: string, newPass: string) => {
    const res = await changePasswordConfig(current, newPass)
    if (res && res.success === false) {
      throw new Error(res.error || 'Error al cambiar la contraseña')
    }
  }

  const handleDeleteAccount = async () => {

    console.log('Eliminando cuenta...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await logoutAction()
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
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full rounded-lg border border-gray-300 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="rounded-full bg-gray-100 p-2">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Cambiar Contraseña</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Actualiza tu contraseña de acceso
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full rounded-lg border border-red-300 p-4 transition-colors hover:bg-red-50"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="rounded-full bg-red-100 p-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-red-600">Eliminar Cuenta</div>
                  <div className="mt-1 text-sm text-red-500">Acción irreversible</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordSave}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  )
}
