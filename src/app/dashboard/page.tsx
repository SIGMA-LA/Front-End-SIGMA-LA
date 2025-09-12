import AdminDashboardClient from "@/components/features/dashboard/AdminDashboardClient";
import { mockUsuarios } from "@/data/mockData";
import { redirect } from 'next/navigation';

async function getAdminUser() {
  const admin = mockUsuarios.find(u => u.rol === 'admin');
  return admin;
}

export default async function DashboardPage() {
  const usuarioLogueado = await getAdminUser();

  const handleLogout = async () => {
    "use server"
    console.log("Cerrando sesión desde el servidor...");
    redirect('/login');
  };

  if (!usuarioLogueado) {
    return <div>Error: No se pudo cargar el usuario administrador.</div>;
  }

  return <AdminDashboardClient usuario={usuarioLogueado} onLogout={handleLogout} />;
}