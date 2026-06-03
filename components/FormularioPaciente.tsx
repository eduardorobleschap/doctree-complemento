'use client';

import { useState, FormEvent, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function CheckboxTextfield({ 
  label, 
  subtitle, 
  nameCb, 
  nameTxt, 
  placeholder = "Escribe más detalles aquí..." 
}: { 
  label: string; 
  subtitle?: string; 
  nameCb: string; 
  nameTxt: string; 
  placeholder?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="pt-0.5">
        <input type="checkbox" id={nameCb} name={nameCb} className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 accent-teal-600" />
      </div>
      <div className="flex-1">
        <label htmlFor={nameCb} className="text-sm font-bold text-slate-700 block">{label}</label>
        {subtitle && <p className="text-xs text-slate-500 mt-1 mb-1">{subtitle}</p>}
        <div className="relative mt-1">
          <input type="text" id={nameTxt} name={nameTxt} placeholder={placeholder} className="w-full border-b border-gray-300 bg-transparent px-1 py-1 text-sm outline-none focus:border-teal-500 transition-colors placeholder:text-gray-300" />
          <div className="absolute right-0 bottom-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// DocTree Brand Logo Component
function DocTreeLogo() {
  return (
    <div className="flex flex-col items-center justify-center mb-2">
      <img
        src="/media/DocTree2.svg"
        alt="DocTree Logo"
        className="h-32 w-auto object-contain select-none"
      />
    </div>
  );
}

export interface DatosPaciente {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: string;
  edad: string;
  sexo: string;
  telefono: string;
  correo: string;
  ocupacion: string;
  genero: string;
  nacionalidad: string;
  estadoCivil: string;
  motivo: string;
  aceptoPrivacidad?: boolean;
  noDatosSecundarios?: boolean;
  firma?: string;
  calleNumero?: string;
  colonia?: string;
  ciudad?: string;
  estado?: string;
  codigoPostal?: string;
  // Historia Clinica
  hc_diabetesFam?: string;
  hc_cancerFam?: string;
  hc_presionAltaFam?: string;
  hc_otraEnfFam?: string;
  hc_alergico?: string;
  hc_medicamentos?: string;
  hc_cirugias?: string;
  hc_enfermedades?: string;
  hc_transfusiones?: string;
  hc_hepatitisA?: boolean;
  hc_hepatitisB?: boolean;
  hc_hepatitisC?: boolean;
  hc_diabetico?: string;
  hc_presionAlta?: string;
  hc_fuma?: string;
  hc_alcoholFrecuencia?: string;
  hc_alcoholCantidad?: string;
  hc_drogas?: string;
  hc_ejercicio?: string;
}

interface FormularioPacienteProps {
  onSubmit: (datos: DatosPaciente) => Promise<void>;
}

export default function FormularioPaciente({ onSubmit }: FormularioPacienteProps) {
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [direccionAbierta, setDireccionAbierta] = useState(false);
  const [historiaAbierta, setHistoriaAbierta] = useState(false);
  
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const [firmaData, setFirmaData] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [privacidadAceptada, setPrivacidadAceptada] = useState(false);
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      const formData = new FormData(e.currentTarget);
      const datos: DatosPaciente = {
        nombre: formData.get('nombre') as string,
        apellidoPaterno: formData.get('apellidoPaterno') as string,
        apellidoMaterno: formData.get('apellidoMaterno') as string,
        curp: formData.get('curp') as string,
        fechaNacimiento: formData.get('fechaNacimiento') as string,
        edad: formData.get('edad') as string,
        sexo: formData.get('sexo') as string,
        telefono: formData.get('telefono') as string,
        correo: formData.get('correo') as string,
        ocupacion: formData.get('ocupacion') as string,
        genero: formData.get('genero') as string,
        nacionalidad: formData.get('nacionalidad') as string,
        estadoCivil: formData.get('estadoCivil') as string,
        motivo: formData.get('motivo') as string,
        aceptoPrivacidad: formData.get('cb_privacidad') === 'on',
        noDatosSecundarios: formData.get('cb_secundarios') === 'on',
        firma: firmaData || undefined,
        calleNumero: (formData.get('calleNumero') as string) || undefined,
        colonia: (formData.get('colonia') as string) || undefined,
        ciudad: (formData.get('ciudad') as string) || undefined,
        estado: (formData.get('estado') as string) || undefined,
        codigoPostal: (formData.get('codigoPostal') as string) || undefined,
        hc_diabetesFam: formData.get('cb_diabetes') === 'on' ? (formData.get('txt_diabetes') as string) || 'Sí' : undefined,
        hc_cancerFam: formData.get('cb_cancer') === 'on' ? (formData.get('txt_cancer') as string) || 'Sí' : undefined,
        hc_presionAltaFam: formData.get('cb_presionAltaFam') === 'on' ? (formData.get('txt_presionAltaFam') as string) || 'Sí' : undefined,
        hc_otraEnfFam: formData.get('cb_otraEnfFam') === 'on' ? (formData.get('txt_otraEnfFam') as string) || 'Sí' : undefined,
        hc_alergico: formData.get('cb_alergico') === 'on' ? (formData.get('txt_alergico') as string) || 'Sí' : undefined,
        hc_medicamentos: formData.get('cb_medicamento') === 'on' ? (formData.get('txt_medicamento') as string) || 'Sí' : undefined,
        hc_cirugias: formData.get('cb_cirugia') === 'on' ? (formData.get('txt_cirugia') as string) || 'Sí' : undefined,
        hc_enfermedades: (formData.get('txt_enfermedades') as string) || undefined,
        hc_transfusiones: formData.get('cb_transfusiones') === 'on' ? (formData.get('txt_transfusiones') as string) || 'Sí' : undefined,
        hc_hepatitisA: formData.get('cb_hepA') === 'on',
        hc_hepatitisB: formData.get('cb_hepB') === 'on',
        hc_hepatitisC: formData.get('cb_hepC') === 'on',
        hc_diabetico: formData.get('cb_diabetico') === 'on' ? (formData.get('txt_diabetico') as string) || 'Sí' : undefined,
        hc_presionAlta: formData.get('cb_presionAlta') === 'on' ? (formData.get('txt_presionAlta') as string) || 'Sí' : undefined,
        hc_fuma: formData.get('cb_fuma') === 'on' ? (formData.get('txt_fuma') as string) || 'Sí' : undefined,
        hc_alcoholFrecuencia: formData.get('cb_alcohol') === 'on' ? (formData.get('txt_alcohol_frecuencia') as string) || undefined : undefined,
        hc_alcoholCantidad: formData.get('cb_alcohol') === 'on' ? (formData.get('txt_alcohol_cantidad') as string) || undefined : undefined,
        hc_drogas: formData.get('cb_drogas') === 'on' ? (formData.get('txt_drogas') as string) || 'Sí' : undefined,
        hc_ejercicio: formData.get('cb_ejercicio') === 'on' ? (formData.get('txt_ejercicio') as string) || 'Sí' : undefined,
      };

      await onSubmit(datos);
      setEnviado(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al enviar el registro. Por favor intente de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  if (enviado) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Registro Exitoso!</h2>
        <p className="text-slate-500">Tus datos han sido enviados correctamente al consultorio médico.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 font-sans">
      <style>{`
        .show-errors input:invalid,
        .show-errors select:invalid,
        .show-errors textarea:invalid {
          border-color: #ef4444 !important;
          --tw-ring-color: #ef4444 !important;
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
        }
        .show-errors input[type="checkbox"]:invalid {
          outline: 2px solid #ef4444;
          outline-offset: 2px;
        }
      `}</style>
      <DocTreeLogo />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <svg className="w-6 h-6 text-teal-600 fill-teal-50" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          Cuidamos de ti desde la raíz
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          Registra tus datos para sembrar la base de tu expediente clínico y permitir a nuestros especialistas brindarte una atención integral, ágil y precisa.
        </p>
      </div>

      <form onSubmit={handleSubmit} onInvalid={() => setIntentoEnvio(true)} className={`space-y-6 ${intentoEnvio ? 'show-errors' : ''}`}>
        {/* Card 1: Datos de Pre-Registro */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-slate-800 font-bold text-base">Datos de Pre-Registro</h3>
          </div>

          <div className="space-y-5">
            {/* ROW 1: Nombre(s) | Apellido Paterno | Apellido Materno */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="nombre" className="text-sm font-bold text-slate-700 mb-1">
                  Nombre(s) <span className="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="apellidoPaterno" className="text-sm font-bold text-slate-700 mb-1">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  type="text"
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="apellidoMaterno" className="text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Apellido Materno</span>
                  <span className="text-slate-400 font-normal text-[10px] bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5">Opcional</span>
                </label>
                <input
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* ROW 2: CURP | Fecha de nacimiento | Tu edad | Sexo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label htmlFor="curp" className="text-sm font-bold text-slate-700 mb-1">
                  CURP
                </label>
                <input
                  id="curp"
                  name="curp"
                  type="text"
                  placeholder="CURP"
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-gray-300"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="fechaNacimiento" className="text-sm font-bold text-slate-700 mb-1">
                  Fecha de nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-gray-700"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edad" className="text-sm font-bold text-slate-700 mb-1">
                  Tu edad
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="sexo" className="text-sm font-bold text-slate-700 mb-1">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="sexo"
                    name="sexo"
                    required
                    defaultValue=""
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors bg-white text-gray-600 appearance-none"
                  >
                    <option value="" disabled hidden>Seleccione</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Intersexual">Intersexual</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Teléfono Celular | Correo Electrónico | Ocupación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="telefono" className="text-sm font-bold text-slate-700 mb-1">
                  Teléfono Celular <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-colors">
                  <div className="flex items-center px-3 bg-white border-r border-gray-200 cursor-default">
                    <span className="text-base leading-none mr-1" title="México">🇲🇽</span>
                    <span className="text-sm text-gray-600 font-medium">+52</span>
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    placeholder="222 123 4567"
                    className="w-full px-3 py-2 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="correo" className="text-sm font-bold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ocupacion" className="text-sm font-bold text-slate-700 mb-1">
                  Ocupación
                </label>
                <input
                  id="ocupacion"
                  name="ocupacion"
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* ROW 4: Género | Nacionalidad | Estado Civil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="genero" className="text-sm font-bold text-slate-700 mb-1">
                  Género
                </label>
                <div className="relative">
                  <select
                    id="genero"
                    name="genero"
                    defaultValue=""
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors bg-white text-gray-600 appearance-none"
                  >
                    <option value="" disabled hidden>Seleccione</option>
                    <option value="No especificado">No especificado</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Transgénero">Transgénero</option>
                    <option value="Transexual">Transexual</option>
                    <option value="Intersexual">Intersexual</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="nacionalidad" className="text-sm font-bold text-slate-700 mb-1">
                  Nacionalidad
                </label>
                <div className="relative">
                  <select
                    id="nacionalidad"
                    name="nacionalidad"
                    defaultValue="México"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors bg-white text-gray-600 appearance-none"
                  >
                    <option value="México">México</option>
                    <option disabled>──────────</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                    <option value="España">España</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Perú">Perú</option>
                    <option value="Chile">Chile</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Honduras">Honduras</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Panamá">Panamá</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Otro">Otro país...</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="estadoCivil" className="text-sm font-bold text-slate-700 mb-1">
                  Estado Civil
                </label>
                <div className="relative">
                  <select
                    id="estadoCivil"
                    name="estadoCivil"
                    defaultValue=""
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors bg-white text-gray-600 appearance-none"
                  >
                    <option value="" disabled hidden>Seleccione</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Divorciado/a">Divorciado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                    <option value="Unión Libre">Unión Libre</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Dirección (Collapsible / Contráctil) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
          <button
            type="button"
            onClick={() => setDireccionAbierta(!direccionAbierta)}
            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-slate-800 font-bold text-base">Dirección</h3>
            </div>
            <div className="flex items-center gap-2">
              {!direccionAbierta && <span className="text-xs text-slate-400">Expandir</span>}
              <svg
                className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${direccionAbierta ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {direccionAbierta && (
            <div className="p-6 md:p-8 pt-0 border-t border-slate-100/50 space-y-5 animate-fadeIn">
              {/* ROW 1: Calle y número | Colonia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="calleNumero" className="text-sm font-bold text-slate-700 mb-1">
                    Calle y número
                  </label>
                  <input
                    id="calleNumero"
                    name="calleNumero"
                    type="text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="colonia" className="text-sm font-bold text-slate-700 mb-1">
                    Colonia
                  </label>
                  <input
                    id="colonia"
                    name="colonia"
                    type="text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              {/* ROW 2: Ciudad | Estado | Código postal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="ciudad" className="text-sm font-bold text-slate-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    id="ciudad"
                    name="ciudad"
                    type="text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="estado" className="text-sm font-bold text-slate-700 mb-1">
                    Estado
                  </label>
                  <input
                    id="estado"
                    name="estado"
                    type="text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="codigoPostal" className="text-sm font-bold text-slate-700 mb-1">
                    Código postal
                  </label>
                  <input
                    id="codigoPostal"
                    name="codigoPostal"
                    type="text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Historia Clínica (Collapsible) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
          <button
            type="button"
            onClick={() => setHistoriaAbierta(!historiaAbierta)}
            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-slate-800 font-bold text-base">Historia Clínica del Paciente</h3>
            </div>
            <div className="flex items-center gap-2">
              {!historiaAbierta && <span className="text-xs text-slate-400">Expandir</span>}
              <svg
                className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${historiaAbierta ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {historiaAbierta && (
            <div className="p-6 md:p-8 pt-0 border-t border-slate-100/50 space-y-8 animate-fadeIn">
              
              {/* Sección 1: Antecedentes Familiares */}
              <div>
                <h4 className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Antecedentes Familiares (Padre, Madre, Hermanos)
                </h4>
                <div className="space-y-4">
                  <CheckboxTextfield label="Diabetes" nameCb="cb_diabetes" nameTxt="txt_diabetes" />
                  <CheckboxTextfield label="Cáncer" nameCb="cb_cancer" nameTxt="txt_cancer" />
                  <CheckboxTextfield label="Presión alta" nameCb="cb_presionAltaFam" nameTxt="txt_presionAltaFam" />
                  <CheckboxTextfield label="¿Hay alguna otra enfermedad importante en su familia?" nameCb="cb_otraEnfFam" nameTxt="txt_otraEnfFam" />
                </div>
              </div>

              {/* Sección 2: Personales Patológicos */}
              <div>
                <h4 className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-4 border-t border-slate-100 pt-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  A. Personales Patológicos
                </h4>
                <div className="space-y-6">
                  <CheckboxTextfield label="¿Es alérgico?" subtitle="Por favor especifique: (incluir alimentos, medicamentos y/o otros)" nameCb="cb_alergico" nameTxt="txt_alergico" />
                  <CheckboxTextfield label="¿Se encuentra tomando algún medicamento o suplemento alimenticio?" subtitle="Por favor especifique" nameCb="cb_medicamento" nameTxt="txt_medicamento" />
                  <CheckboxTextfield label="¿Le han practicado alguna operación o cirugía?" subtitle="Especifique tipo de cirugía y año" nameCb="cb_cirugia" nameTxt="txt_cirugia" />
                  
                  <div className="pl-8">
                    <label htmlFor="txt_enfermedades" className="text-sm font-bold text-slate-700 block mb-2">Excluyendo las cirugías u operaciones, ¿Qué enfermedades importantes ha tenido? (especifique año)</label>
                    <div className="relative">
                      <input type="text" id="txt_enfermedades" name="txt_enfermedades" placeholder="Escribe más detalles aquí..." className="w-full border-b border-gray-300 bg-transparent px-1 py-1 text-sm outline-none focus:border-teal-500 transition-colors placeholder:text-gray-300" />
                      <div className="absolute right-0 bottom-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </div>
                    </div>
                  </div>

                  <CheckboxTextfield label="¿Ha recibido transfusiones sanguíneas?" nameCb="cb_transfusiones" nameTxt="txt_transfusiones" />
                  
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <input type="checkbox" id="cb_hepatitis" name="cb_hepatitis" className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 accent-teal-600" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cb_hepatitis" className="text-sm font-bold text-slate-700 block">¿Ha tenido Hepatitis?</label>
                      <p className="text-xs text-slate-500 mb-2 mt-1">Selecciona las que has tenido</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="cb_hepA" className="w-4 h-4 accent-teal-600 rounded border-gray-300" /> Hepatitis A</label>
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="cb_hepB" className="w-4 h-4 accent-teal-600 rounded border-gray-300" /> Hepatitis B</label>
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="cb_hepC" className="w-4 h-4 accent-teal-600 rounded border-gray-300" /> Hepatitis C</label>
                      </div>
                    </div>
                  </div>

                  <CheckboxTextfield label="¿Es diabético?" subtitle="¿Qué medicamentos recibe para la diabetes?" nameCb="cb_diabetico" nameTxt="txt_diabetico" />
                  <CheckboxTextfield label="¿En alguna ocasión le han detectado alta la presión?" subtitle="¿Qué tratamiento recibe para la presión alta?" nameCb="cb_presionAlta" nameTxt="txt_presionAlta" />
                </div>
              </div>

              {/* Sección 3: Personales NO Patológicos */}
              <div>
                <h4 className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-4 border-t border-slate-100 pt-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  A. Personales NO Patológicos
                </h4>
                <div className="space-y-6">
                  <CheckboxTextfield label="¿Actualmente fuma?" nameCb="cb_fuma" nameTxt="txt_fuma" />
                  
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <input type="checkbox" id="cb_alcohol" name="cb_alcohol" className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 accent-teal-600" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cb_alcohol" className="text-sm font-bold text-slate-700 block mb-2">¿Acostumbra tomar bebidas alcohólicas?</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="txt_alcohol_frecuencia" className="text-xs text-slate-500 mb-1 block">¿Cuántas veces a la semana?</label>
                          <input type="text" id="txt_alcohol_frecuencia" name="txt_alcohol_frecuencia" className="w-full border-b border-gray-300 bg-transparent px-1 py-1 text-sm outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                          <label htmlFor="txt_alcohol_cantidad" className="text-xs text-slate-500 mb-1 block">¿Cuántas copas al día que toma?</label>
                          <input type="text" id="txt_alcohol_cantidad" name="txt_alcohol_cantidad" className="w-full border-b border-gray-300 bg-transparent px-1 py-1 text-sm outline-none focus:border-teal-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <CheckboxTextfield label="¿Utiliza algún tipo de drogas?" nameCb="cb_drogas" nameTxt="txt_drogas" />
                  <CheckboxTextfield label="¿Realiza ejercicio?" nameCb="cb_ejercicio" nameTxt="txt_ejercicio" />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Card 4: Motivo de consulta */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="mb-4">
            <h3 className="text-indigo-700 font-bold text-base mb-1">Motivo de consulta</h3>
            <p className="text-sm text-slate-500">Comparte tus síntomas o cualquier detalle importante que el médico deba conocer</p>
          </div>
          <textarea
            id="motivo"
            name="motivo"
            rows={4}
            required
            className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-y"
          ></textarea>
        </div>

        {/* Card 5: Aviso de privacidad y firma */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs text-sm text-slate-700">
          <p className="mb-4 font-bold">
            Favor de leer nuestro aviso de privacidad{' '}
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('form');
                if (!form) return;
                const p = new URLSearchParams(window.location.search).get('p') || '';
                const nombre = `${(form.elements.namedItem('nombre') as HTMLInputElement)?.value || ''} ${(form.elements.namedItem('apellidoPaterno') as HTMLInputElement)?.value || ''}`.trim();
                const domicilio = `${(form.elements.namedItem('calleNumero') as HTMLInputElement)?.value || ''}, ${(form.elements.namedItem('colonia') as HTMLInputElement)?.value || ''}`.trim();
                const telefono = (form.elements.namedItem('telefono') as HTMLInputElement)?.value || '';
                const correo = (form.elements.namedItem('correo') as HTMLInputElement)?.value || '';
                const url = `/aviso-privacidad?p=${encodeURIComponent(p)}&nombrePaciente=${encodeURIComponent(nombre || '[No proporcionado]')}&domicilioPaciente=${encodeURIComponent(domicilio || '[No proporcionado]')}&telefonoPaciente=${encodeURIComponent(telefono || '[No proporcionado]')}&correoPaciente=${encodeURIComponent(correo || '[No proporcionado]')}`;
                window.open(url, '_blank');
              }}
              className="text-[#00BFA5] underline hover:text-[#00A891]"
            >
              aquí
            </button>
          </p>
          
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="pt-0.5">
                <input type="checkbox" name="cb_privacidad" required onChange={(e) => setPrivacidadAceptada(e.target.checked)} className="w-5 h-5 text-[#00BFA5] border-gray-400 rounded focus:ring-[#00BFA5] accent-[#00BFA5]" />
              </div>
              <span className="font-medium text-slate-800">
                Acepto que he leído y estoy de acuerdo con el{' '}
                <button
                  type="button"
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (!form) return;
                    const p = new URLSearchParams(window.location.search).get('p') || '';
                    const nombre = `${(form.elements.namedItem('nombre') as HTMLInputElement)?.value || ''} ${(form.elements.namedItem('apellidoPaterno') as HTMLInputElement)?.value || ''}`.trim();
                    const domicilio = `${(form.elements.namedItem('calleNumero') as HTMLInputElement)?.value || ''}, ${(form.elements.namedItem('colonia') as HTMLInputElement)?.value || ''}`.trim();
                    const telefono = (form.elements.namedItem('telefono') as HTMLInputElement)?.value || '';
                    const correo = (form.elements.namedItem('correo') as HTMLInputElement)?.value || '';
                    const url = `/aviso-privacidad?p=${encodeURIComponent(p)}&nombrePaciente=${encodeURIComponent(nombre || '[No proporcionado]')}&domicilioPaciente=${encodeURIComponent(domicilio || '[No proporcionado]')}&telefonoPaciente=${encodeURIComponent(telefono || '[No proporcionado]')}&correoPaciente=${encodeURIComponent(correo || '[No proporcionado]')}`;
                    window.open(url, '_blank');
                  }}
                  className="text-[#00BFA5] underline hover:text-[#00A891]"
                >
                  aviso de privacidad
                </button>
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="pt-0.5">
                <input type="checkbox" name="cb_secundarios" className="w-5 h-5 text-[#00BFA5] border-gray-400 rounded focus:ring-[#00BFA5] accent-[#00BFA5]" />
              </div>
              <span className="font-medium text-slate-800">
                No deseo que se utilicen mis datos para los fines secundarios
              </span>
            </label>
          </div>

          <div className="flex justify-center mt-6">
            {firmaData ? (
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold text-teal-700 mb-2">Firma Capturada</div>
                <div className="border border-slate-200 rounded-lg p-2 bg-white w-48 h-24 mb-3 flex items-center justify-center">
                  <img src={firmaData} alt="Firma" className="max-h-full max-w-full" />
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarFirma(true)}
                  className="text-sm text-slate-500 hover:text-teal-600 underline"
                >
                  Volver a dibujar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMostrarFirma(true)}
                className="flex items-center gap-2 bg-[#00BFA5] hover:bg-[#00A891] text-white font-bold rounded px-6 py-2 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Dibujar firma
              </button>
            )}
          </div>
        </div>

        {/* Modal de Firma */}
        {mostrarFirma && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Dibuje su firma</h3>
                <button type="button" onClick={() => setMostrarFirma(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-4 bg-slate-50 flex justify-center">
                <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden touch-none">
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{ width: 340, height: 200, className: 'sigCanvas cursor-crosshair' }}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-between bg-white items-center">
                <button type="button" onClick={() => sigCanvas.current?.clear()} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
                  Limpiar
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMostrarFirma(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
                    Cancelar
                  </button>
                  <button type="button" onClick={() => {
                    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
                      setFirmaData(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
                      setMostrarFirma(false);
                    }
                  }} className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-sm">
                    Firmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            onClick={() => setIntentoEnvio(true)}
            disabled={cargando || !privacidadAceptada}
            className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-lg px-4 py-3 shadow-md shadow-teal-600/10 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {cargando ? 'Enviando...' : 'Completar Pre-Registro'}
          </button>
        </div>
      </form>
    </div>
  );
}
