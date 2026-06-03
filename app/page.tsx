import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir a la ruta oficial de registro con un usuario de prueba para desarrollo
  redirect('/register/patient?p=usuario_ejemplo');
}
