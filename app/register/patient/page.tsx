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

    // 2.3 Preparar el payload mapeando los campos camelCase a snake_case para la base de datos de Supabase.
    const payload = {
      doctor_id: doctorId,
      nombre: datos.nombre,
      apellido_paterno: datos.apellidoPaterno,
      apellido_materno: datos.apellidoMaterno || null,
      curp: datos.curp || null,
      fecha_nacimiento: datos.fechaNacimiento || null,
      edad: datos.edad || null,
      sexo: datos.sexo || null,
      telefono: datos.telefono || null,
      correo: datos.correo || null,
      ocupacion: datos.ocupacion || null,
      genero: datos.genero || null,
      nacionalidad: datos.nacionalidad || null,
      estado_civil: datos.estadoCivil || null,
      motivo: datos.motivo || null,
      firma: datos.firma || null,
      calle_numero: datos.calleNumero || null,
      colonia: datos.colonia || null,
      ciudad: datos.ciudad || null,
      estado: datos.estado || null,
      codigo_postal: datos.codigoPostal || null,
      
      // Antecedentes (Historia Clínica)
      hc_diabetes_fam: datos.hc_diabetesFam || null,
      hc_cancer_fam: datos.hc_cancerFam || null,
      hc_presion_alta_fam: datos.hc_presionAltaFam || null,
      hc_otra_enf_fam: datos.hc_otraEnfFam || null,
      hc_alergico: datos.hc_alergico || null,
      hc_medicamentos: datos.hc_medicamentos || null,
      hc_cirugias: datos.hc_cirugias || null,
      hc_enfermedades: datos.hc_enfermedades || null,
      hc_transfusiones: datos.hc_transfusiones || null,
      hc_hepatitis_a: datos.hc_hepatitisA || false,
      hc_hepatitis_b: datos.hc_hepatitisB || false,
      hc_hepatitis_c: datos.hc_hepatitisC || false,
      hc_diabetico: datos.hc_diabetico || null,
      hc_presion_alta: datos.hc_presionAlta || null,
      hc_fuma: datos.hc_fuma || null,
      hc_alcohol_frecuencia: datos.hc_alcoholFrecuencia || null,
      hc_alcohol_cantidad: datos.hc_alcoholCantidad || null,
      hc_drogas: datos.hc_drogas || null,
      hc_ejercicio: datos.hc_ejercicio || null,
      
      // Metadatos de firma electrónica y aviso de privacidad
      aviso_privacidad_aceptado: datos.aceptoPrivacidad || false,
      fines_secundarios_aceptados: datos.noDatosSecundarios === false,
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
