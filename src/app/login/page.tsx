"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter();
  const { login, usuario } = useAuth();

  useEffect(() => {
    if (usuario) {
      switch (usuario.rol) {
        case 'admin':
          router.push('/adminDashboard');
          break;
        case 'encargado':
          router.push('/encargadoDashboard');
          break;
        case 'visitador':
          router.push('/visitadorDashboard');
          break;
        default:
          console.error('Rol de usuario desconocido:', usuario.rol);
          break;
      }
    }
  }, [usuario, router]);

  const handleLoginAttempt = (email: string, contrasena: string): boolean => {
    console.log(`Intentando login con: ${email}`);
    const loginSuccessful = login(email, contrasena);

    if (loginSuccessful) {
      console.log('Login exitoso a través del contexto!');
    } else {
      console.log('Login fallido a través del contexto.');
    }
    
    return loginSuccessful;
  };
  
  return <LoginForm onLogin={handleLoginAttempt} />;
}