import { createClient } from '@/utils/supabase/server';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export default async function AvisoPrivacidadPage({ searchParams }: { searchParams: Promise<{ p?: string, nombrePaciente?: string, domicilioPaciente?: string, telefonoPaciente?: string, correoPaciente?: string }> }) {
  const resolvedParams = await searchParams;
  const doctorId = resolvedParams.p;
  const nombrePaciente = resolvedParams.nombrePaciente || '[Nombre del Paciente]';
  const domicilioPaciente = resolvedParams.domicilioPaciente || '[Domicilio del paciente]';
  const telefonoPaciente = resolvedParams.telefonoPaciente || '[teléfono registrado en pre-registro]';
  const correoPaciente = resolvedParams.correoPaciente || '[correo electrónico registrado en pre-registro]';
  
  let doctor = {
    nombre_doctor: '[Nombre del Dr]',
    direccion_clinica: '[Dirección de la clínica]',
    correo_doctor: '[Correo registrado del Dr]'
  };

  if (doctorId) {
    try {
      const supabase = await createClient();
      // Se intenta buscar en la tabla doctores (o ajustar según la base de datos real)
      const { data } = await supabase
        .from('doctores')
        .select('nombre_doctor, direccion_clinica, correo_doctor')
        .eq('id', doctorId)
        .single();
      
      if (data) {
        doctor = data;
      }
    } catch (err) {
      console.error('Error fetching doctor data for privacy policy:', err);
    }
  }

  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className={`min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 ${nunito.className}`}>
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 border border-slate-200 shadow-sm rounded-xl">
        
        <div className="text-center mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Aviso de Privacidad Integral para la Prestación de Servicios de Salud</h1>
        </div>

        <div className="prose prose-slate prose-teal max-w-none text-slate-700 text-justify leading-relaxed [&_p]:!text-[12px] [&_li]:!text-[12px] [&_h2]:!text-[15px] [&_h3]:!text-[13px]">
          
          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">I. Identidad y Domicilio del Médico</h2>
          <p>
            <strong>{doctor.nombre_doctor}</strong> (en lo sucesivo, el «Médico»), en su carácter de profesional de la salud
            y Médico del tratamiento de sus datos personales, con domicilio legal para oír y recibir
            notificaciones en <strong>{doctor.direccion_clinica}</strong>, expide el presente
            Aviso de Privacidad en estricto apego a la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares (LFPDPPP), su Reglamento, y en
            concordancia con las normativas sanitarias aplicables para la gestión de sistemas de
            información de registro electrónico para la salud y del expediente clínico.
          </p>
          <p className="mt-4">
            La captura, interoperabilidad, resguardo y administración de su información personal
            y clínica se realizará a través de la infraestructura tecnológica DOCTREE, operada
            legalmente por SEUX INTEGRA S. DE R.L. de C.V., fungiendo como herramienta digital
            para la integración de su expediente clínico electrónico. El Médico garantiza que el
            tratamiento de sus datos se limitará exclusivamente a las finalidades estipuladas en
            este documento, asegurando su privacidad, confidencialidad y el derecho a la
            autodeterminación informativa.
          </p>
          <p className="mt-4">
            El Titular reconoce que, al proporcionar sus datos por cualquier medio (físico,
            electrónico, verbal o escrito), otorga su consentimiento expreso para su tratamiento.
            La negativa a suministrar información esencial facultará al Médico a declinar la
            prestación de los servicios, sin que ello genere responsabilidad legal alguna por
            omisión o negligencia.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">II. Glosario de Términos</h2>
          <p>Para la correcta interpretación de este instrumento, se entenderá por:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Médico:</strong> Profesional de la salud o institución clínica que decide sobre el tratamiento de los datos personales.</li>
            <li><strong>Titular:</strong> Persona física a quien corresponden los datos personales, actuando por propio derecho o mediante representante legal (en caso de menores o personas en estado de interdicción).</li>
            <li><strong>Encargado:</strong> Persona física o moral (ej. proveedores tecnológicos como SEUX INTEGRA S. DE R.L. de C.V.) que trata datos personales a nombre y por cuenta del Médico, bajo una relación jurídica delimitada.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">III. Datos Personales Sujetos a Tratamiento</h2>
          <p>Para proveerle atención médica integral, recabaremos las siguientes categorías de datos:</p>
          <h3 className="font-semibold text-lg mt-6 mb-2">1. Datos de Identificación y Contacto:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre completo del paciente y/o representante legal.</li>
            <li>Firma autógrafa o digital.</li>
            <li>Identificación oficial vigente.</li>
            <li>Dirección particular.</li>
            <li>Teléfono del paciente y números de contacto de emergencia.</li>
            <li>Correo del paciente.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-2">2. Datos Patrimoniales y de Facturación:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Información fiscal para facturación.</li>
            <li>Datos de pólizas de seguros de gastos médicos.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-2">3. Datos Personales Sensibles:</h3>
          <p className="mb-2">Por la naturaleza del servicio, se recabarán datos catalogados como legalmente sensibles, los cuales requieren especial protección:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Historial clínico completo (interrogatorio, exploración física, antecedentes heredo-familiares, patológicos y no patológicos).</li>
            <li>Tipo de sangre, alergias, enfermedades previas y actuales.</li>
            <li>Información genética, psicológica y/o psiquiátrica.</li>
            <li>Consumo de sustancias o medicamentos.</li>
            <li>Resultados de estudios de laboratorio, gabinete y esquemas de vacunación.</li>
            <li>Datos biométricos (fotografía, huella dactilar)</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">IV. Finalidades del Tratamiento</h2>
          <h3 className="font-semibold text-lg mt-6 mb-2">A. Finalidades Primarias (Originarias y Necesarias):</h3>
          <p className="mb-2">Sus datos serán utilizados estrictamente para salvaguardar su integridad física y proveerle atención médica, incluyendo:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Verificación y confirmación de identidad.</li>
            <li>Integración, actualización y resguardo de su Expediente Clínico Electrónico.</li>
            <li>Emisión de diagnósticos, pronósticos, recomendaciones terapéuticas, recetas electrónicas y órdenes de estudios.</li>
            <li>Derivación o interconsulta con otros especialistas de la salud cuando la condición clínica lo amerite.</li>
            <li>Notificación a contactos de emergencia.</li>
            <li>Gestión administrativa, facturación, cobranza y programación de citas.</li>
            <li>Cumplimiento de requerimientos legales ante autoridades sanitarias o judiciales competentes.</li>
          </ol>

          <h3 className="font-semibold text-lg mt-6 mb-2">B. Finalidades Secundarias (Accesorias):</h3>
          <p className="mb-2">De manera adicional, utilizaremos su información para fines que no son indispensables para el servicio médico, pero permiten brindarle una mejor atención:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Envío de campañas de prevención de salud, promociones y/o boletines médicos.</li>
            <li>Notificación sobre nuevos avances farmacológicos o servicios.</li>
            <li>Evaluación de la calidad del servicio mediante encuestas.</li>
            <li>Fines estadísticos y de investigación clínica (debidamente anonimizados).</li>
          </ol>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">V. Transferencia de Datos Personales</h2>
          <h3 className="font-semibold text-lg mt-6 mb-2">1. Transferencias que NO requieren consentimiento expreso (Art. 37 LFPDPPP):</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>A instituciones hospitalarias o médicos en caso de emergencias médicas.</li>
            <li>A autoridades sanitarias, fiscales o judiciales, en cumplimiento de obligaciones legales.</li>
            <li>A sociedades controladoras, subsidiarias o afiliadas bajo el mismo control interno.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-2">2. Transferencias que SÍ requieren su consentimiento:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>A médicos interconsultantes, especialistas de apoyo o laboratorios externos para la complementación de su diagnóstico.</li>
            <li>A compañías aseguradoras para el trámite de siniestros, reembolsos o dictámenes de cobertura.</li>
          </ul>
          <p className="mt-4">
            Al suscribir el presente documento, el Titular otorga su consentimiento expreso para la
            transferencia de sus datos, incluyendo los sensibles, en los términos aquí estipulados.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">VI. Ejercicio de Derechos ARCO y Revocación del Consentimiento</h2>
          <p>
            Usted posee el derecho de Acceder a sus datos, Rectificarlos en caso de inexactitud,
            Cancelarlos cuando considere que no son necesarios para las finalidades previstas, o
            bien, Oponerse al tratamiento para fines específicos. Asimismo, puede revocar el
            consentimiento otorgado.
          </p>
          <p className="mt-4 mb-2 font-semibold">Procedimiento de Ejercicio:</p>
          <p>Toda solicitud deberá ser formalizada y dirigida al Médico, a través de las siguientes vías:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2 mb-4">
            <li><strong>Presencial / Impresa:</strong> Presentada en el domicilio del Médico, dirigida a <strong>{doctor.nombre_doctor}</strong>.</li>
            <li><strong>Electrónica:</strong> Enviada a la cuenta <strong>{doctor.correo_doctor}</strong>.</li>
          </ul>

          <p className="font-semibold mb-2">Requisitos de la Solicitud:</p>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Nombre del Titular y medio de contacto para recibir respuesta.</li>
            <li>Identificación oficial vigente (o acreditación legal del representante).</li>
            <li>Descripción clara del derecho a ejercer (ARCO o revocación) y los motivos que lo originan.</li>
          </ol>
          <p className="mt-4">
            El Médico dispondrá de un plazo de 5 (cinco) días naturales para requerir información
            faltante. Una vez integrada la solicitud, se emitirá una resolución en un plazo máximo
            de 20 (veinte) días naturales, la cual, de ser procedente, se ejecutará dentro de los 15
            (quince) días posteriores.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">VII. Conservación del Expediente y Modificaciones al Aviso</h2>
          <p>
            En estricto cumplimiento normativo, el Expediente Clínico será conservado por un
            periodo mínimo de 5 (cinco) años, contados a partir de la última actuación médica. En
            caso de conclusión de la relación profesional, el paciente podrá solicitar la
            transferencia de su historial mediante acuse de recibo, liberando al Médico de su
            custodia futura.
          </p>
          <p className="mt-4 mb-2">
            El presente Aviso de Privacidad podrá ser modificado por actualizaciones legislativas
            o políticas internas. Las modificaciones estarán disponibles mediante:
          </p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Notificación al correo electrónico registrado.</li>
            <li>Disposición física o digital en el consultorio durante su próxima cita.</li>
          </ol>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">VIII. Consentimiento Expreso y Declaración Jurada</h2>
          <p>
            Yo, <strong>{nombrePaciente}</strong>, con domicilio en <strong>{domicilioPaciente}</strong>, con el número telefónico <strong>{telefonoPaciente}</strong>, y con correo electrónico <strong>{correoPaciente}</strong>, en pleno uso de mis
            facultades, reconozco que el presente documento ha sido puesto a mi disposición.
            Tras haber analizado su contenido, otorgo mi consentimiento expreso (mediante firma
            autógrafa, electrónica o validación digital) para que el Médico y los Encargados traten
            mis datos personales, incluyendo patrimoniales y sensibles, bajo los términos
            descritos. Eximo al Médico de responsabilidad derivada del tratamiento informático de
            los mismos, presumiendo siempre la buena fe en el uso de la plataforma tecnológica.
          </p>
          <p className="mt-4">
            Conforme a lo previsto en la normatividad vigente, en el caso de menores de edad o
            incapaces, el suscrito, a la firma del presente, manifiesto bajo protesta de decir verdad,
            ser el padre o tutor del menor de edad o del incapaz Titular de los datos facilitados, por
            lo que acepto toda responsabilidad al respecto, asumiendo cualquier reclamación que
            pudiera surgir, comprometiéndome a deslindar al Médico y a los encargados que
            realicen el tratamiento de datos personales del menor o del incapaz, de toda
            responsabilidad. En caso de no proporcionar al Médico ciertos datos del suscrito o en
            su caso del menor o incapaz del que soy padre o tutor, acepto la posibilidad de que no
            se tenga acceso por parte del suscrito o del menor o incapaz del que soy padre o tutor
            a los servicios que éste proporciona, sin que se genere responsabilidad alguna para
            éste último.
          </p>

          <div className="mt-12 pt-8 border-t border-slate-200 text-center">
            <p className="!text-[11px] text-slate-400">Última revisión: {currentDate}</p>
          </div>

        </div>
      </div>
    </main>
  );
}
