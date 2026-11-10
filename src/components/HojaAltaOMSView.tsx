import React, { useState } from 'react';
import { Patient } from '../types/clinical';

interface HojaAltaOMSViewProps {
  patient: Patient;
}

export const HojaAltaOMSView: React.FC<HojaAltaOMSViewProps> = ({ patient }) => {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportFhirJson = () => {
    const fhirResource = {
      resourceType: 'Bundle',
      id: `HOU-REC-2024-${patient.pid.replace('#', '')}`,
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: patient.pid.replace('#', ''),
            name: [{ family: 'Restrepo Gómez', given: ['Carlos', 'E.'] }],
            gender: 'male',
            birthDate: '1956-04-12',
            identifier: [{ system: 'http://hospital.uptu.edu.co/pid', value: patient.pid }],
          },
        },
        {
          resource: {
            resourceType: 'MedicationStatement',
            status: 'active',
            medicationCodeableConcept: {
              coding: [{ system: 'http://www.whocc.no/atc', code: 'L01BA01', display: 'Methotrexate 15mg weekly' }],
            },
            dosage: [
              {
                text: '6 tabletas de 2.5 mg (15 mg total) únicamente los días viernes en el desayuno',
                timing: {
                  repeat: {
                    frequency: 1,
                    period: 1,
                    periodUnit: 'wk',
                    dayOfWeek: ['fri'],
                  },
                },
              },
            ],
            note: [{ text: 'Protocolo MAR estricto. Rescate obligado con Ácido Fólico 5 mg los domingos (48h después).' }],
          },
        },
        {
          resource: {
            resourceType: 'MedicationStatement',
            status: 'active',
            medicationCodeableConcept: {
              coding: [{ system: 'http://www.whocc.no/atc', code: 'C09CA01', display: 'Losartan potassium 50mg' }],
            },
            dosage: [{ text: '50 mg cada 12 horas vía oral (08:00 y 20:00)' }],
          },
        },
        {
          resource: {
            resourceType: 'MedicationStatement',
            status: 'active',
            medicationCodeableConcept: {
              coding: [{ system: 'http://www.whocc.no/atc', code: 'C03CA01', display: 'Furosemide 40mg' }],
            },
            dosage: [{ text: '40 mg vía oral cada mañana con el desayuno' }],
          },
        },
        {
          resource: {
            resourceType: 'Provenance',
            target: [{ reference: `Patient/${patient.pid.replace('#', '')}` }],
            recorded: new Date().toISOString(),
            agent: [
              {
                role: [{ text: 'Farmacéutica Clínica' }],
                who: { display: 'Dra. Marcela Cardona H. (Reg. #8492)' },
              },
              {
                role: [{ text: 'Médico Internista' }],
                who: { display: 'Dr. Fernando Morales R. (RM #184920)' },
              },
            ],
            signature: [
              {
                type: [{ system: 'urn:iso-astm:E1762-95:2013', code: '1.2.840.10065.1.12.1.1' }],
                when: new Date().toISOString(),
                data: '9a7f.e23b.cc81.049f.77da',
              },
            ],
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(fhirResource, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_DischargeSummary_ClinicaSantillana_RestrepoGomez_${patient.pid.replace('#', '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = () => {
    setShareStatus('¡Enviado a +57 310 445 9294 y Portal MiPaciente!');
    setTimeout(() => {
      setShareStatus(null);
    }, 4000);
  };

  return (
    <div className="w-full flex flex-col bg-[#f8f9ff]">
      {/* Interactive Action & Print Control Strip (Visible on screen, hidden on print) */}
      <div className="w-full bg-[#eff4ff] border-b border-[#bfc7d2]/40 px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1e8462]/20 flex items-center justify-center text-[#00694c] shrink-0">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[15px] sm:text-[16px] text-[#0b1c30]">
                Plan Farmacoterapéutico de Egreso
              </span>
              <span className="font-label-caps text-[10px] bg-[#97f5cc] text-[#002115] px-2 py-0.5 rounded font-bold">
                Validado CDSS OMS
              </span>
            </div>
            <p className="font-code-audit text-[11px] text-[#3f4850] mt-0.5">
              Verificado por Dra. M. Cardona (Reg. FarmaClínica #8492) & Dr. F. Morales (Med. Interna) • Protocolo FHIR v2.4
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006194] text-white font-body-bold text-[12px] hover:bg-[#007bb9] shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimir Guía A4</span>
          </button>
          <button
            onClick={handleExportFhirJson}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d3e4fe] text-[#0b1c30] font-body-medium text-[12px] hover:bg-[#cce5ff] transition-colors border border-[#bfc7d2]/40"
          >
            <span className="material-symbols-outlined text-[18px]">data_object</span>
            <span>Exportar FHIR JSON</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-medium text-[12px] transition-colors border ${
              shareStatus
                ? 'bg-[#97f5cc] text-[#002115] border-[#1e8462]/30 font-bold'
                : 'bg-[#d3e4fe] text-[#0b1c30] hover:bg-[#cce5ff] border-[#bfc7d2]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {shareStatus ? 'task_alt' : 'cell_tower'}
            </span>
            <span>{shareStatus || 'Enviar a WhatsApp / Portal'}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header & Clinical Identification Banner */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#bfc7d2]/40">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#cce5ff] flex items-center justify-center text-[#006194] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[32px]">folder_shared</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-caps text-[10px] tracking-wider text-[#006194] font-bold">
                    GUÍA DE SEGURIDAD FARMACOLÓGICA AL ALTA
                  </span>
                  <span className="font-code-audit text-[11px] text-[#3f4850]">
                    DOC: CS-REC-2024-84920
                  </span>
                </div>
                <h1 className="font-display-lg text-[24px] text-[#0b1c30] tracking-tight font-bold">
                  {patient.nombre}
                </h1>
                <div className="flex items-center gap-3 text-[#3f4850] font-body-medium text-[13px] flex-wrap mt-0.5">
                  <span>
                    <strong>PID:</strong> {patient.pid}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Edad:</strong> {patient.edad} años ({patient.sexo === 'M' ? 'Masculino' : 'Femenino'})
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Fecha de Alta:</strong> 26 de Octubre de 2024
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Cama Previa:</strong> 402-B (Medicina Interna)
                  </span>
                </div>
              </div>
            </div>

            {/* QR Mobile & Portal Access Module */}
            <div className="flex items-center gap-3 bg-[#eff4ff] p-2.5 rounded-lg shrink-0 border border-[#bfc7d2]/40">
              <div className="w-16 h-16 bg-white p-1 rounded flex items-center justify-center shadow-xs">
                {/* Crisp Vector QR */}
                <svg className="w-full h-full text-[#0b1c30]" fill="currentColor" viewBox="0 0 100 100">
                  <rect width="28" height="28" x="5" y="5" fill="currentColor"></rect>
                  <rect width="18" height="18" x="10" y="10" fill="#ffffff"></rect>
                  <rect width="10" height="10" x="14" y="14" fill="currentColor"></rect>
                  <rect width="28" height="28" x="67" y="5" fill="currentColor"></rect>
                  <rect width="18" height="18" x="72" y="10" fill="#ffffff"></rect>
                  <rect width="10" height="10" x="76" y="14" fill="currentColor"></rect>
                  <rect width="28" height="28" x="5" y="67" fill="currentColor"></rect>
                  <rect width="18" height="18" x="10" y="72" fill="#ffffff"></rect>
                  <rect width="10" height="10" x="14" y="76" fill="currentColor"></rect>
                  <rect width="8" height="16" x="42" y="12" fill="currentColor"></rect>
                  <rect width="6" height="8" x="55" y="6" fill="currentColor"></rect>
                  <rect width="16" height="16" x="42" y="40" fill="currentColor"></rect>
                  <rect width="26" height="8" x="65" y="44" fill="currentColor"></rect>
                  <rect width="8" height="24" x="72" y="60" fill="currentColor"></rect>
                  <rect width="12" height="12" x="45" y="68" fill="currentColor"></rect>
                  <rect width="10" height="10" x="85" y="80" fill="currentColor"></rect>
                  <rect width="18" height="6" x="12" y="42" fill="currentColor"></rect>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-body-bold text-[13px] text-[#0b1c30] leading-tight">Acceso Celular</span>
                <span className="font-code-audit text-[11px] text-[#3f4850] max-w-[130px] leading-tight mt-0.5">
                  Escanee para alarmas y horario en el celular
                </span>
                <span className="font-label-caps text-[10px] text-[#00694c] mt-1 font-bold">ENLACE ACTIVO</span>
              </div>
            </div>
          </div>

          {/* Clinical Metrics & Diagnostic Tags Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
            <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col border border-[#bfc7d2]/40">
              <span className="font-label-caps text-[10px] text-[#3f4850] uppercase font-bold">
                Diagnósticos de Alta
              </span>
              <span className="font-body-bold text-[13px] text-[#0b1c30] mt-1">
                Insuficiencia Cardíaca (FEVI red.)
              </span>
              <span className="font-code-audit text-[11px] text-[#3f4850]">
                HTA Grado II • Artritis Reumatoide Seropositiva
              </span>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col border border-[#bfc7d2]/40">
              <span className="font-label-caps text-[10px] text-[#3f4850] uppercase font-bold">
                Monitoreo Renal (CrCl)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-md text-[18px] text-[#006194] font-bold">
                  {patient.clCr} mL/min
                </span>
                <span className="font-label-mono-metric text-[12px] text-[#3f4850]">ClCr Cockcroft</span>
              </div>
              <span className="font-code-audit text-[11px] text-[#3f4850]">
                Creatinina: {patient.creatinina} mg/dL • Ajuste de dosis activo
              </span>
            </div>

            <div className="bg-[#ffdad6] p-3 rounded-lg flex flex-col justify-between border border-[#ba1a1a]/20">
              <div>
                <div className="flex items-center gap-1 text-[#93000a]">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span className="font-label-caps text-[10px] uppercase font-bold">Alergias Confirmadas</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded font-label-caps text-[9px] font-bold">
                    Penicilinas (Anafilaxia)
                  </span>
                  <span className="bg-[#ba1a1a]/80 text-white px-2 py-0.5 rounded font-label-caps text-[9px] font-bold">
                    Sulfonamidas
                  </span>
                </div>
              </div>
              <span className="font-code-audit text-[10px] text-[#93000a] mt-1">
                Riesgo vital documentado en CDSS
              </span>
            </div>

            {/* Strict Clinical Safety Alert for NSAIDs */}
            <div className="bg-[#ffdad6]/60 p-3 rounded-lg flex flex-col justify-between border border-[#ba1a1a]/30">
              <div className="flex items-center gap-1.5 text-[#93000a]">
                <span className="material-symbols-outlined text-[18px]">block</span>
                <span className="font-body-bold text-[13px] uppercase leading-tight">Prohibido AINEs</span>
              </div>
              <p className="font-body-dense text-[12px] text-[#93000a] leading-tight mt-1">
                NO consumir Ibuprofeno, Ketorolaco, Naproxeno o Diclofenaco. Riesgo severo de falla renal aguda y
                descompensación cardíaca.
              </p>
            </div>
          </div>
        </div>

        {/* The 5 Moments for Medication Safety (OMS / WHO Pillars) */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[22px]">health_and_safety</span>
              <h2 className="font-headline-md text-[18px] text-[#0b1c30] font-bold">
                Los 5 Momentos para la Seguridad de los Medicamentos (OMS)
              </h2>
            </div>
            <span className="font-label-caps text-[10px] text-[#3f4850] bg-[#eff4ff] px-2 py-1 rounded hidden sm:inline-block">
              Educación al Paciente y Familia
            </span>
          </div>
          <p className="font-body-base text-[13px] text-[#3f4850]">
            La Organización Mundial de la Salud recomienda tener claras estas cinco etapas clave en su tratamiento de regreso a casa:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-1">
            {/* Moment 1 */}
            <div className="p-3 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#006194] text-white font-code-audit text-[11px] flex items-center justify-center font-bold">
                  1
                </span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">¿Comenzando?</span>
              </div>
              <p className="font-code-audit text-[11px] text-[#3f4850] leading-snug">
                Conozca el nombre, dosis y para qué sirve cada pastilla nueva indicada.
              </p>
            </div>
            {/* Moment 2 */}
            <div className="p-3 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#006194] text-white font-code-audit text-[11px] flex items-center justify-center font-bold">
                  2
                </span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">¿Tomando?</span>
              </div>
              <p className="font-code-audit text-[11px] text-[#3f4850] leading-snug">
                Tómelo a la hora y forma exacta. Use organizadores y alarmas diarias.
              </p>
            </div>
            {/* Moment 3 */}
            <div className="p-3 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#006194] text-white font-code-audit text-[11px] flex items-center justify-center font-bold">
                  3
                </span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">¿Añadiendo?</span>
              </div>
              <p className="font-code-audit text-[11px] text-[#3f4850] leading-snug">
                Nunca agregue remedios naturales ni medicamentos sin aval médico.
              </p>
            </div>
            {/* Moment 4 */}
            <div className="p-3 rounded-lg bg-[#eff4ff] flex flex-col gap-1 border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#006194] text-white font-code-audit text-[11px] flex items-center justify-center font-bold">
                  4
                </span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">¿Revisando?</span>
              </div>
              <p className="font-code-audit text-[11px] text-[#3f4850] leading-snug">
                Lleve siempre esta hoja a todas sus citas médicas y exámenes de sangre.
              </p>
            </div>
            {/* Moment 5 */}
            <div className="p-3 rounded-lg bg-[#ffdad6]/40 flex flex-col gap-1 border border-[#ba1a1a]/30">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white font-code-audit text-[11px] flex items-center justify-center font-bold">
                  5
                </span>
                <span className="font-body-bold text-[13px] text-[#93000a]">¿Dejando?</span>
              </div>
              <p className="font-code-audit text-[11px] text-[#93000a] leading-snug">
                Deseche las pastillas canceladas. No vuelva a tomarlas aunque le sobren.
              </p>
            </div>
          </div>
        </div>

        {/* Active Discharge Pharmacotherapy Schedule */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline-md text-[18px] text-[#0b1c30] font-bold">
                Medicamentos Activos al Salir del Hospital
              </h2>
              <p className="font-body-dense text-[12px] text-[#3f4850]">
                Siga este esquema diario riguroso. Cada recuadro indica cómo y a qué hora tomar su medicina.
              </p>
            </div>
            <div className="flex items-center gap-3 font-code-audit text-[11px] text-[#3f4850]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1e8462]"></span> Continuado
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006194]"></span> Ajustado
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> Alto Riesgo MAR
              </span>
            </div>
          </div>

          {/* Medication Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: Losartán */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-label-caps text-[10px] text-[#006194] bg-[#cce5ff] px-2 py-0.5 rounded uppercase font-bold">
                      Continuar / Optimizado
                    </span>
                    <h3 className="font-headline-md text-[18px] text-[#0b1c30] mt-1 font-bold">
                      Losartán Potásico 50 mg
                    </h3>
                    <span className="font-code-audit text-[11px] text-[#707881]">
                      Tableta • Vía Oral • Código ATC: C09CA01
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-[24px]">cardiology</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] text-[18px]">info</span>
                  <span className="font-body-dense text-[12px] text-[#0b1c30]">
                    <strong>Propósito:</strong> Controlar la presión arterial y proteger la función de su corazón.
                  </span>
                </div>

                {/* Timetable Indicator */}
                <div className="grid grid-cols-4 gap-1 py-1 text-center font-code-audit text-[11px]">
                  <div className="p-2 rounded bg-[#006194] text-white flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                    <span className="font-bold">Mañana</span>
                    <span>08:00 (1 pastilla)</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                    <span>Mediodía</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#006194] text-white flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">nightlight_round</span>
                    <span className="font-bold">Noche</span>
                    <span>20:00 (1 pastilla)</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                    <span>Dormir</span>
                    <span>-</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-start gap-2 border border-[#bfc7d2]/30">
                <span className="material-symbols-outlined text-[#3f4850] text-[18px] shrink-0 mt-0.5">
                  lightbulb
                </span>
                <span className="font-body-dense text-[12px] text-[#3f4850] leading-snug">
                  <strong>Consejo de seguridad:</strong> Tómelo siempre a las mismas horas. Al levantarse de la
                  cama o de una silla, hágalo despacio para evitar mareos momentáneos.
                </span>
              </div>
            </div>

            {/* CARD 2: Furosemida (Ajustado) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-label-caps text-[10px] text-[#00694c] bg-[#97f5cc] px-2 py-0.5 rounded uppercase font-bold">
                      Ajuste de Dosis • Vía Oral
                    </span>
                    <h3 className="font-headline-md text-[18px] text-[#0b1c30] mt-1 font-bold">
                      Furosemida 40 mg
                    </h3>
                    <span className="font-code-audit text-[11px] text-[#707881]">
                      Tableta • Vía Oral (Pasa de IV en hospital a Oral en casa)
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#00694c]">
                    <span className="material-symbols-outlined text-[24px]">water_drop</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00694c] text-[18px]">info</span>
                  <span className="font-body-dense text-[12px] text-[#0b1c30]">
                    <strong>Propósito:</strong> Diurético para eliminar el exceso de líquido acumulado en piernas y
                    pulmones.
                  </span>
                </div>

                {/* Timetable Indicator */}
                <div className="grid grid-cols-4 gap-1 py-1 text-center font-code-audit text-[11px]">
                  <div className="p-2 rounded bg-[#00694c] text-white flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                    <span className="font-bold">Mañana</span>
                    <span>08:00 (1 pastilla)</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                    <span>Mediodía</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">nightlight_round</span>
                    <span>Tarde</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                    <span>Noche</span>
                    <span>-</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-start gap-2 border border-[#bfc7d2]/30">
                <span className="material-symbols-outlined text-[#00694c] text-[18px] shrink-0 mt-0.5">
                  timer
                </span>
                <span className="font-body-dense text-[12px] text-[#3f4850] leading-snug">
                  <strong>Regla de oro:</strong> Tomar únicamente en la mañana con el desayuno.{' '}
                  <em>¡Nunca tomar en la tarde o noche para no interrumpir su descanso nocturno!</em> Pésese cada
                  mañana en ayunas.
                </span>
              </div>
            </div>

            {/* CARD 3: CRITICAL HIGH-RISK MEDICATION (Metotrexato Semanal + Rescate Ácido Fólico) */}
            <div className="md:col-span-2 bg-[#ffdad6]/30 rounded-xl p-5 shadow-sm border border-[#ba1a1a]/30 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-[#ba1a1a]/20">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#ba1a1a] text-white px-2.5 py-0.5 rounded font-label-caps text-[10px] font-bold">
                      MEDICAMENTO DE ALTO RIESGO (MAR)
                    </span>
                    <span className="font-label-caps text-[10px] text-[#ba1a1a] bg-white px-2 py-0.5 rounded font-bold border border-[#ba1a1a]/30">
                      PAUTA SEMANAL ESTRICTA
                    </span>
                  </div>
                  <h3 className="font-display-lg text-[22px] text-[#0b1c30] mt-1 font-bold">
                    Metotrexato 15 mg (Dosis Total Semanal)
                  </h3>
                  <p className="font-body-medium text-[13px] text-[#ba1a1a] font-bold">
                    ¡SOLO UNA VEZ POR SEMANA: TODOS LOS VIERNES!
                  </p>
                </div>
                <div className="bg-white px-3 py-2 rounded-lg text-right border border-[#bfc7d2]/50 shadow-xs">
                  <span className="font-code-audit text-[11px] text-[#707881]">Presentación indicada:</span>
                  <div className="font-headline-sm text-[16px] text-[#ba1a1a] font-bold">6 pastillas de 2.5 mg</div>
                </div>
              </div>

              {/* Alert Callout Banner inside Card */}
              <div className="bg-[#ba1a1a] text-white p-3.5 rounded-lg flex items-start gap-3 shadow-xs">
                <span className="material-symbols-outlined text-[24px] shrink-0">dangerous</span>
                <div className="flex flex-col text-sm">
                  <span className="font-body-bold text-[13px] uppercase tracking-wide">
                    ADVERTENCIA VITAL AL PACIENTE Y CUIDADOR
                  </span>
                  <p className="font-body-dense text-[12px] mt-0.5 leading-relaxed text-[#ffdad6]">
                    NUNCA tome Metotrexato todos los días. La toma diaria produce envenenamiento y puede ser mortal.
                    Si tiene cualquier duda antes de tomarlo, llame inmediatamente a la farmacia clínica del
                    hospital.
                  </p>
                </div>
              </div>

              {/* Weekly Schedule Step-by-Step Module */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Step 1: Friday */}
                <div className="bg-white p-3.5 rounded-lg flex flex-col gap-1.5 shadow-xs border border-[#bfc7d2]/50">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-[14px] text-[#0b1c30] flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
                      PASO 1: VIERNES (Día de Metotrexato)
                    </span>
                    <span className="font-label-caps text-[10px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded font-bold">
                      08:00 AM
                    </span>
                  </div>
                  <p className="font-body-dense text-[12px] text-[#3f4850]">
                    Tome las <strong>6 pastillas juntas de 2.5 mg</strong> (total 15 mg) acompañadas de un vaso
                    completo de agua durante el desayuno.
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[#707881] font-code-audit text-[11px]">
                    <span className="material-symbols-outlined text-[15px]">event</span>
                    <span>Siguiente toma: Viernes próximo. No repetir sábado ni domingo.</span>
                  </div>
                </div>

                {/* Step 2: Sunday Folic Acid Rescue */}
                <div className="bg-white p-3.5 rounded-lg flex flex-col gap-1.5 shadow-xs border border-[#bfc7d2]/50">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-[14px] text-[#0b1c30] flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#00694c]"></span>
                      PASO 2: DOMINGO (Ácido Fólico de Protección)
                    </span>
                    <span className="font-label-caps text-[10px] bg-[#97f5cc] text-[#002115] px-2 py-0.5 rounded font-bold">
                      48h DESPUÉS
                    </span>
                  </div>
                  <p className="font-body-dense text-[12px] text-[#3f4850]">
                    Tome <strong>1 comprimido de Ácido Fólico 5 mg</strong> en el desayuno. Protege su sangre, boca
                    e hígado contra efectos adversos.
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[#00694c] font-code-audit text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    <span>Protector obligatorio programado exactamente 48 horas post-dosis.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: Atorvastatina */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-label-caps text-[10px] text-[#3f4850] bg-[#eff4ff] px-2 py-0.5 rounded uppercase font-bold">
                      Continuar
                    </span>
                    <h3 className="font-headline-md text-[18px] text-[#0b1c30] mt-1 font-bold">
                      Atorvastatina 40 mg
                    </h3>
                    <span className="font-code-audit text-[11px] text-[#707881]">
                      Comprimido • Vía Oral • Noche
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-[24px]">shield_with_heart</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] text-[18px]">info</span>
                  <span className="font-body-dense text-[12px] text-[#0b1c30]">
                    <strong>Propósito:</strong> Reducir colesterol y prevenir formación de trombos en vasos sanguíneos.
                  </span>
                </div>

                {/* Timetable Indicator */}
                <div className="grid grid-cols-4 gap-1 py-1 text-center font-code-audit text-[11px]">
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                    <span>Mañana</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                    <span>Mediodía</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">nightlight_round</span>
                    <span>Tarde</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#006194] text-white flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                    <span className="font-bold">Al Acostarse</span>
                    <span>21:00 (1 pastilla)</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-start gap-2 border border-[#bfc7d2]/30">
                <span className="material-symbols-outlined text-[#3f4850] text-[18px] shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <span className="font-body-dense text-[12px] text-[#3f4850] leading-snug">
                  <strong>Recomendación:</strong> Tomar con un vaso de agua antes de ir a dormir. Evite consumir
                  toronja o jugo de pomelo mientras tome este medicamento.
                </span>
              </div>
            </div>

            {/* CARD 5: Omeprazol */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-label-caps text-[10px] text-[#3f4850] bg-[#eff4ff] px-2 py-0.5 rounded uppercase font-bold">
                      Continuar
                    </span>
                    <h3 className="font-headline-md text-[18px] text-[#0b1c30] mt-1 font-bold">
                      Omeprazol 20 mg
                    </h3>
                    <span className="font-code-audit text-[11px] text-[#707881]">
                      Cápsula con gránulos gastrorresistentes • Vía Oral
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006194]">
                    <span className="material-symbols-outlined text-[24px]">medication</span>
                  </div>
                </div>

                <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] text-[18px]">info</span>
                  <span className="font-body-dense text-[12px] text-[#0b1c30]">
                    <strong>Propósito:</strong> Proteger el revestimiento gástrico durante los tratamientos orales.
                  </span>
                </div>

                {/* Timetable Indicator */}
                <div className="grid grid-cols-4 gap-1 py-1 text-center font-code-audit text-[11px]">
                  <div className="p-2 rounded bg-[#006194] text-white flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                    <span className="font-bold">Ayunas</span>
                    <span>07:30 (1 cápsula)</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                    <span>Mediodía</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">nightlight_round</span>
                    <span>Tarde</span>
                    <span>-</span>
                  </div>
                  <div className="p-2 rounded bg-[#eff4ff] text-[#707881] flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                    <span>Noche</span>
                    <span>-</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-2.5 rounded-lg flex items-start gap-2 border border-[#bfc7d2]/30">
                <span className="material-symbols-outlined text-[#3f4850] text-[18px] shrink-0 mt-0.5">
                  restaurant
                </span>
                <span className="font-body-dense text-[12px] text-[#3f4850] leading-snug">
                  <strong>Instrucción precisa:</strong> Debe ingerirse 30 minutos <strong>antes</strong> del desayuno.
                  Tráguela entera; no la mastique ni abra el contenido de la cápsula.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Definitively Discontinued Medications (Momento 5 OMS - Lo que NO debe volver a tomar) */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </div>
              <div>
                <h2 className="font-headline-md text-[18px] text-[#ba1a1a] font-bold">
                  Medicamentos Suspendidos Definitivamente
                </h2>
                <p className="font-code-audit text-[11px] text-[#3f4850]">
                  Momento 5 OMS: Deseche o separe estas medicinas de su botiquín familiar
                </p>
              </div>
            </div>
            <span className="font-label-caps text-[10px] bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded font-bold">
              ¡NO REINICIAR BAJO NINGÚN CONCEPTO!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Discontinued 1 */}
            <div className="p-4 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/20 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="line-through font-body-bold text-[13px] text-[#ba1a1a]">
                    Ibuprofeno 400 mg / AINEs
                  </span>
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">block</span>
                </div>
                <p className="font-body-dense text-[12px] text-[#93000a] mt-2">
                  <strong>Motivo médico:</strong> Provoca deterioro severo de la función renal e interactúa
                  peligrosamente con Losartán y Furosemida.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#bfc7d2]/40">
                <span className="font-label-caps text-[9px] text-[#00694c] font-bold">
                  ALTERNATIVA SEGURA APROBADA:
                </span>
                <p className="font-body-dense text-[12px] text-[#0b1c30] mt-0.5">
                  <strong>Acetaminofén (Paracetamol) 500 mg</strong> si presenta dolor articular leve. Máximo 2 g al
                  día (4 pastillas).
                </p>
              </div>
            </div>

            {/* Discontinued 2 */}
            <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#bfc7d2]/40 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="line-through font-body-bold text-[13px] text-[#3f4850]">
                    Enalapril 20 mg
                  </span>
                  <span className="material-symbols-outlined text-[#3f4850] text-[18px]">remove_done</span>
                </div>
                <p className="font-body-dense text-[12px] text-[#3f4850] mt-2">
                  <strong>Motivo médico:</strong> Ha sido sustituido por <strong>Losartán</strong> para una mejor
                  tolerancia respiratoria y control.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#bfc7d2]/40">
                <span className="font-label-caps text-[9px] text-[#3f4850] font-bold">ACCIÓN REQUERIDA:</span>
                <p className="font-body-dense text-[12px] text-[#3f4850] mt-0.5">
                  Deseche las cajas viejas de Enalapril para no duplicar el tratamiento ni confundir frascos.
                </p>
              </div>
            </div>

            {/* Discontinued 3 */}
            <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#bfc7d2]/40 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="line-through font-body-bold text-[13px] text-[#3f4850]">
                    Ginkgo Biloba (Hierbas/Gotas)
                  </span>
                  <span className="material-symbols-outlined text-[#3f4850] text-[18px]">spa</span>
                </div>
                <p className="font-body-dense text-[12px] text-[#3f4850] mt-2">
                  <strong>Motivo médico:</strong> Suplemento herbario no supervisado que incrementa el riesgo de
                  hemorragia y toxicidad hepática.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#bfc7d2]/40">
                <span className="font-label-caps text-[9px] text-[#3f4850] font-bold">ACCIÓN REQUERIDA:</span>
                <p className="font-body-dense text-[12px] text-[#3f4850] mt-0.5">
                  Suspender de forma permanente. Consulte siempre antes de iniciar cualquier infusión o producto
                  de tienda naturista.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Signs & Follow-up Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Traffic Light Safety Module (Semáforo de Alarma) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[24px]">traffic</span>
              <div>
                <h3 className="font-headline-md text-[18px] text-[#0b1c30] font-bold">
                  Semáforo de Seguridad: ¿Cuándo Consultar?
                </h3>
                <p className="font-code-audit text-[11px] text-[#3f4850]">
                  Identifique los signos clínicos para actuar oportunamente
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Red: Urgencies */}
              <div className="p-3 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/30 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ba1a1a] shrink-0 mt-1"></div>
                <div>
                  <span className="font-body-bold text-[13px] text-[#ba1a1a] uppercase font-bold">
                    Alerta Roja - Acuda a Urgencias de Inmediato:
                  </span>
                  <p className="font-body-dense text-[12px] text-[#3f4850] mt-0.5">
                    Falta de aire repentina estando sentado o acostado, dolor en el pecho, hinchazón brusca en
                    ambas piernas, fiebre alta después de tomar Metotrexato o sangrado inexplicable por encías/orina.
                  </p>
                </div>
              </div>

              {/* Yellow: Call Clinic */}
              <div className="p-3 rounded-lg bg-[#dae2fd]/50 border border-[#565e74]/20 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-[#565e74] shrink-0 mt-1"></div>
                <div>
                  <span className="font-body-bold text-[13px] text-[#0b1c30] uppercase font-bold">
                    Alerta Amarilla - Contacte a la Unidad Farmacéutica / Médico:
                  </span>
                  <p className="font-body-dense text-[12px] text-[#3f4850] mt-0.5">
                    Aumento de más de 1.5 kg de peso en 2 días consecutivos (indica retención de agua), mareos
                    frecuentes al ponerse de pie, o dudas en la toma semanal de Metotrexato.
                  </p>
                </div>
              </div>

              {/* Green: Optimal Control */}
              <div className="p-3 rounded-lg bg-[#97f5cc]/30 border border-[#00694c]/20 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-[#00694c] shrink-0 mt-1"></div>
                <div>
                  <span className="font-body-bold text-[13px] text-[#00694c] uppercase font-bold">
                    Zona Verde - Todo en Orden:
                  </span>
                  <p className="font-body-dense text-[12px] text-[#3f4850] mt-0.5">
                    Peso estable, respiración tranquila al caminar, ausencia de hinchazón y cumplimiento de todas
                    las tomas a la hora fijada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Appointment & Clinical Contacts */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#006194]">
                <span className="material-symbols-outlined text-[22px]">calendar_clock</span>
                <span className="font-headline-sm text-[15px] text-[#0b1c30] font-bold">
                  Próximo Control Clínico
                </span>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col gap-1 border border-[#bfc7d2]/40">
                <span className="font-label-caps text-[10px] text-[#006194] font-bold">
                  CITA PROGRAMADA OBLIGATORIA
                </span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">
                  Consulta Medicina Interna & Control Renal
                </span>
                <span className="font-code-audit text-[11px] text-[#3f4850]">
                  Fecha: 09 de Noviembre de 2024 • 09:30 AM
                </span>
                <span className="font-body-dense text-[12px] text-[#0b1c30] mt-1">
                  Centro Médico de Especialistas Clínica Santillana • Consultorio 312
                </span>
              </div>

              <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col gap-1 border border-[#bfc7d2]/40">
                <span className="font-label-caps text-[10px] text-[#3f4850] font-bold">
                  EXÁMENES PREVIOS (48 HORAS ANTES)
                </span>
                <span className="font-code-audit text-[11px] text-[#0b1c30]">
                  Creatinina Sérica • BUN • Ionograma (Sodio/Potasio) • Cuadro Hemático
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#bfc7d2]/30">
              <div className="flex items-center gap-2 text-[#3f4850] font-code-audit text-[11px]">
                <span className="material-symbols-outlined text-[16px] text-[#00694c]">support_agent</span>
                <span>Línea Farmacéutica 24/7: (606) 887-9000 Ext. 4892</span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Validation & Electronic Signatures */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#3f4850] uppercase font-bold">
              Validación Multidisciplinar y Custodia del Paciente
            </span>
            <span className="font-code-audit text-[11px] text-[#707881]">
              Estándar FHIR R4: MedicationStatement/AuditTrail
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Signature 1: Clinical Pharmacist */}
            <div className="flex flex-col gap-1 bg-[#eff4ff] p-3.5 rounded-lg border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2 text-[#00694c]">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">Dra. Marcela Cardona H.</span>
              </div>
              <span className="font-code-audit text-[11px] text-[#3f4850]">
                Especialista en Farmacia Clínica • Reg. #8492
              </span>
              <span className="font-label-caps text-[9px] text-[#707881] mt-2 uppercase">
                FIRMA DIGITAL CRIPTOGRÁFICA
              </span>
              <span className="font-code-audit text-[11px] text-[#00694c] truncate font-bold">
                HASH: 9a7f.e23b.cc81.049f.77da
              </span>
            </div>

            {/* Signature 2: Attending Physician */}
            <div className="flex flex-col gap-1 bg-[#eff4ff] p-3.5 rounded-lg border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2 text-[#006194]">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">Dr. Fernando Morales R.</span>
              </div>
              <span className="font-code-audit text-[11px] text-[#3f4850]">
                Médico Especialista en Medicina Interna • RM #184920
              </span>
              <span className="font-label-caps text-[9px] text-[#707881] mt-2 uppercase">
                FIRMA DIGITAL CRIPTOGRÁFICA
              </span>
              <span className="font-code-audit text-[11px] text-[#006194] truncate font-bold">
                HASH: 3c11.0f9a.887b.d442.e019
              </span>
            </div>

            {/* Signature 3: Patient/Caregiver Acknowledgment */}
            <div className="flex flex-col gap-1 bg-[#eff4ff] p-3.5 rounded-lg border border-[#bfc7d2]/40">
              <div className="flex items-center gap-2 text-[#0b1c30]">
                <span className="material-symbols-outlined text-[18px]">draw</span>
                <span className="font-body-bold text-[13px] text-[#0b1c30]">Don Carlos Restrepo Gómez</span>
              </div>
              <span className="font-code-audit text-[11px] text-[#3f4850]">
                Paciente / Familiar Acompañante
              </span>
              <span className="font-label-caps text-[9px] text-[#707881] mt-2 uppercase">
                CONSENTIMIENTO INFORMADO
              </span>
              <span className="font-code-audit text-[11px] text-[#3f4850]">
                Entendido y Recibido en Físico y Digital
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-[#707881] font-code-audit text-[11px] gap-2 border-t border-[#bfc7d2]/30">
            <span>Mi Conciliación RX by Quimera RX • Version 1.0 • Generado el 26/10/2024 a las 11:42 COT</span>
            <span>Centro Médico de Especialistas Clínica Santillana • Manizales, Colombia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
