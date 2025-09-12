"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const handleLoginAttempt = (usuario: string, contrasena: string): boolean => {
    console.log(`Intentando login con: ${usuario} / ${contrasena}`);
    
    if (usuario === 'admin' && contrasena === 'admin123') {
      console.log('Login exitoso! Redirigiendo al dashboard...');

      router.push('/dashboard');
      
      return true;
    }

    console.log('Login fallido.');
    return false;
  };
  
  return <LoginForm onLogin={handleLoginAttempt} />;
}