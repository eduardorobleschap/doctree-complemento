import FormularioPaciente, { DatosPaciente } from '@/components/FormularioPaciente';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

interface RegisterPageProps {
  searchParams: Promise<{ p?: string }>;
}

export default async function PatientRegisterPage({ searchParams }: RegisterPageProps) {
  // 1. Capturar el parámetro de búsqueda `?p=` de la URL (doctor_id).
  // En Next.js 15+ (y 14 canary con el nuevo router), searchParams es una Promesa.
  const resolvedParams = await searchParams;
  const doctorId = resolvedParams.p;

  // 2. Implementar el Server Action asíncrono para enviar los datos a Supabase.
  async function submitPatientPreRegistration(datos: DatosPaciente) {
    'use server';

    if (!doctorId) {
      throw new Error('Falta el identificador del doctor (doctor_id) en la URL.');
    }

    // Simulación para entorno de desarrollo local sin credenciales
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase no está configurado. Simulando envío en entorno local...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return;
    }

    // Inicializar el cliente de Supabase en el servidor.
    const supabase = await createClient();

    // 2.1 Capturar metadatos para la Firma Electrónica Simple
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'IP_NO_DISPONIBLE';
    const userAgent = headersList.get('user-agent') || 'USER_AGENT_NO_DISPONIBLE';
    const timestamp = new Date().toISOString();
    const AVISO_VERSION = "v1.0-2026";

    // 2.2 Generar Hash SHA-256 de integridad
    const nombreCompleto = `${datos.nombre} ${datos.apellidoPaterno} ${datos.apellidoMaterno || ''}`.trim();
    const dataToHash = `${nombreCompleto}${AVISO_VERSION}${timestamp}${ip}`;
    const firmaHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    // 2.3 Preparar el payload separando las casillas
    const { aceptoPrivacidad, noDatosSecundarios, ...restoDatos } = datos;

    // Combinar los datos del formulario con el doctor_id capturado y campos de auditoría.
    const payload = {
      ...restoDatos,
      doctor_id: doctorId,
      aviso_privacidad_aceptado: aceptoPrivacidad || false,
      fines_secundarios_aceptados: noDatosSecundarios === false, // Si "noDeseo" es true, aceptado es false
      aviso_version: AVISO_VERSION,
      firma_ip: ip,
      firma_user_agent: userAgent,
      firma_timestamp: timestamp,
      firma_hash: firmaHash,
    };

    // Ejecutar un INSERT en la tabla pacientes_pre_registro.
    const { error } = await supabase
      .from('pacientes_pre_registro')
      .insert([payload]);

    if (error) {
      console.error('Error insertando el registro en Supabase:', error.message);
      throw new Error('Error al guardar el pre-registro del paciente.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* 3. Pasar el Server Action como la prop onSubmit al componente cliente. */}
      {doctorId ? (
        <FormularioPaciente onSubmit={submitPatientPreRegistration} />
      ) : (
        <div className="text-center p-8 bg-white border border-red-200 rounded-lg shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Enlace Inválido</h2>
          <p className="text-gray-600">
            Falta el identificador del doctor en el enlace. Asegúrese de incluir <code>?p=ID_DEL_DOCTOR</code> en la URL.
          </p>
        </div>
      )}
    </main>
  );
}
