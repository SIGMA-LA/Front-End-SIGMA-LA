import EmpleadosView from '@/components/admin/EmpleadosView'
import { obtenerTodosLosEmpleados } from '@/actions/empleado'

export default async function EmpleadosPage() {
  // Cargar empleados en el servidor
  const empleados = await obtenerTodosLosEmpleados()

  return <EmpleadosView empleados={empleados} />
}
