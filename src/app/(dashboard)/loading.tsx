import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="animate-pulse text-sm font-medium text-gray-500">
          Cargando sección...
        </p>
      </div>
    </div>
  )
}
