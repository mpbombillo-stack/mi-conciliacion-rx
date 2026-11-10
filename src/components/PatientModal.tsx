import React, { useState, useEffect } from 'react';
import { Patient, ClinicalUnit } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (patient: Patient) => void;
  currentPatientCount: number;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSavePatient,
  currentPatientCount,
}) => {
  // Read available units and rooms dynamically from config/storage
  const [availableUnits, setAvailableUnits] = useState<ClinicalUnit[]>(() => {
    const saved = localStorage.getItem('proa_units');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('proa_units');
    if (saved) {
      try {
        setAvailableUnits(JSON.parse(saved));
      } catch (e) {}
    }
  }, [isOpen]);

  const [nombre, setNombre] = useState('');
  const [pid, setPid] = useState(`PID-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [edad, setEdad] = useState<number>(65);
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [servicio, setServicio] = useState(() => {
    return availableUnits[0]?.name || 'Medicina Interna';
  });
  const [cama, setCama] = useState(() => {
    return availableUnits[0]?.rooms[0]?.name || '412-B';
  });
  const [pesoKg, setPesoKg] = useState<number>(70);
  const [tallaCm, setTallaCm] = useState<number>(170);
  const [creatinina, setCreatinina] = useState<number>(1.2);
  const [alergiasText, setAlergiasText] = useState('Penicilinas');
  const [diagnosticosText, setDiagnosticosText] = useState(
    'Hipertensión Arterial Grado II\nInsuficiencia Cardíaca Congestiva'
  );
  const [medicoTratante, setMedicoTratante] = useState('Dr. Fernando Morales R.');
  const [farmaceuticoAsignado, setFarmaceuticoAsignado] = useState('Dra. Marcela Cardona H.');

  // Update room when selected service changes
  const handleServiceChange = (newServicio: string) => {
    setServicio(newServicio);
    const unitFound = availableUnits.find((u) => u.name === newServicio);
    if (unitFound && unitFound.rooms.length > 0) {
      setCama(unitFound.rooms[0].name);
    }
  };

  if (!isOpen) return null;

  // Calculo automatico Cockcroft-Gault: ((140-edad) * peso * (0.85 si F)) / (72 * CrS)
  const factorSexo = sexo === 'F' ? 0.85 : 1.0;
  const crVal = creatinina > 0 ? creatinina : 1.0;
  const calculatedClCr = Math.round(
    (((140 - edad) * pesoKg * factorSexo) / (72 * crVal)) * 10
  ) / 10;

  // Calculo automatico DuBois: 0.007184 * peso^0.425 * talla^0.725
  const calculatedBSA =
    Math.round(0.007184 * Math.pow(pesoKg, 0.425) * Math.pow(tallaCm, 0.725) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const parsedAlergias = alergiasText
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean)
      .map((sustancia) => ({
        sustancia,
        severidad: 'Moderada / Alerta Activa',
        reaccion: 'Reacción documentada en admisión hospitalaria',
      }));

    const parsedDiagnosticos = diagnosticosText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const now = new Date();
    const fechaIngresoFormatted = `${now.getDate()}-${now.toLocaleString('es-CO', {
      month: 'short',
    })}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      pid: pid.startsWith('#') ? pid : `#${pid}`,
      nombre: nombre.trim(),
      edad,
      sexo,
      servicio,
      cama,
      fechaIngreso: fechaIngresoFormatted,
      pesoKg,
      tallaCm,
      creatinina,
      clCr: calculatedClCr,
      bsaDuBois: calculatedBSA,
      alergias: parsedAlergias.length > 0 ? parsedAlergias : [{ sustancia: 'Sin alergias conocidas', severidad: 'Baja', reaccion: 'Negativo' }],
      diagnosticos: parsedDiagnosticos.length > 0 ? parsedDiagnosticos : ['Ingreso para valoración clínica y conciliación'],
      rfidPulsera: pid.startsWith('#') ? pid : `#${pid}`,
      medicoTratante,
      farmaceuticoAsignado,
    };

    onSavePatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#bfc7d2] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-[#eff4ff] p-4 sm:p-5 flex items-center justify-between border-b border-[#bfc7d2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                Ingreso de Nuevo Paciente a Conciliación
              </h2>
              <p className="text-[11px] text-[#565e74]">
                Registro clínico interoperable para soporte <ClinicalTooltip code="CDSS" /> y verificación <ClinicalTooltip code="5C" />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#565e74] hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Identificación Básica */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                Nombre y Apellidos del Paciente *
              </label>
              <input
                required
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Gloria Mercedes Botero Gómez"
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                <ClinicalTooltip code="PID">Identificador (PID / C.C.)</ClinicalTooltip>
              </label>
              <input
                required
                type="text"
                value={pid}
                onChange={(e) => setPid(e.target.value)}
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
          </div>

          {/* Demografía & Ubicación */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                Edad (Años)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={edad}
                onChange={(e) => setEdad(Number(e.target.value))}
                className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                Sexo Biológico
              </label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as 'M' | 'F')}
                className="w-full h-9 px-2 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
              >
                <option value="M">Masculino (M)</option>
                <option value="F">Femenino (F)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                Servicio Hospitalario
              </label>
              <select
                value={servicio}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full h-9 px-2 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
              >
                {availableUnits.length > 0 ? (
                  availableUnits.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.code})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Medicina Interna">Medicina Interna</option>
                    <option value="Unidad de Cuidados Intensivos (UCI)">UCI Adultos</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Cirugía General">Cirugía General</option>
                    <option value="Urgencias">Urgencias</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                Cama Asignada
              </label>
              {availableUnits.find((u) => u.name === servicio)?.rooms &&
              (availableUnits.find((u) => u.name === servicio)?.rooms.length ?? 0) > 0 ? (
                <select
                  value={cama}
                  onChange={(e) => setCama(e.target.value)}
                  className="w-full h-9 px-2 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                >
                  {availableUnits
                    .find((u) => u.name === servicio)
                    ?.rooms.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.type === 'Individual' ? 'Indiv.' : 'Compartida'})
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={cama}
                  onChange={(e) => setCama(e.target.value)}
                  placeholder="Ej. 412-B"
                  className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                />
              )}
            </div>
          </div>

          {/* Parámetros Antropométricos y Renales con Auto-cálculo */}
          <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#bfc7d2]/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#006194] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                Parámetros Fisiológicos y Cálculo Automático
              </span>
              <span className="text-[10px] text-[#565e74] font-semibold">
                DuBois & Cockcroft-Gault
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#565e74] uppercase">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pesoKg}
                  onChange={(e) => setPesoKg(Number(e.target.value))}
                  className="w-full h-9 px-3 bg-white border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#565e74] uppercase">Talla (cm)</label>
                <input
                  type="number"
                  value={tallaCm}
                  onChange={(e) => setTallaCm(Number(e.target.value))}
                  className="w-full h-9 px-3 bg-white border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#565e74] uppercase">Creatinina (mg/dL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={creatinina}
                  onChange={(e) => setCreatinina(Number(e.target.value))}
                  className="w-full h-9 px-3 bg-white border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
                />
              </div>
            </div>

            {/* Computed Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#bfc7d2]/40 text-xs">
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#bfc7d2]/50">
                <span className="text-[#565e74] font-bold">
                  <ClinicalTooltip code="ASC">Superficie Corporal (ASC)</ClinicalTooltip>:
                </span>
                <span className="font-mono font-bold text-[#006194]">{calculatedBSA} m²</span>
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#bfc7d2]/50">
                <span className="text-[#565e74] font-bold">
                  <ClinicalTooltip code="ClCr">Aclaramiento Renal (ClCr)</ClinicalTooltip>:
                </span>
                <span
                  className={`font-mono font-bold ${
                    calculatedClCr < 50 ? 'text-[#ba1a1a]' : 'text-[#00694c]'
                  }`}
                >
                  {calculatedClCr} mL/min
                </span>
              </div>
            </div>
          </div>

          {/* Diagnósticos & Alergias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider flex items-center justify-between">
                <span>Diagnósticos de Ingreso (<ClinicalTooltip code="CIE-10" />)</span>
                <span className="text-[9px] font-normal text-slate-400">1 por línea</span>
              </label>
              <textarea
                rows={3}
                value={diagnosticosText}
                onChange={(e) => setDiagnosticosText(e.target.value)}
                placeholder="Ej. Falla Cardíaca con FEVI reducida&#10;Hipertensión Arterial"
                className="w-full p-2.5 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-medium outline-none focus:ring-1 focus:ring-[#006194] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#ba1a1a] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Alergias Farmacológicas
                </span>
                <span className="text-[9px] font-normal text-slate-400">1 por línea</span>
              </label>
              <textarea
                rows={3}
                value={alergiasText}
                onChange={(e) => setAlergiasText(e.target.value)}
                placeholder="Ej. Penicilinas (Anafilaxia)&#10;Sulfamidas"
                className="w-full p-2.5 bg-[#ffdad6]/30 border border-[#ba1a1a]/30 rounded-xl text-xs font-semibold text-[#93000a] outline-none focus:ring-1 focus:ring-[#ba1a1a] resize-none"
              />
            </div>
          </div>

          {/* Profesionales a Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                Médico Especialista Tratante
              </label>
              <input
                type="text"
                value={medicoTratante}
                onChange={(e) => setMedicoTratante(e.target.value)}
                className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                Farmacéutico(a) Clínico Asignado
              </label>
              <input
                type="text"
                value={farmaceuticoAsignado}
                onChange={(e) => setFarmaceuticoAsignado(e.target.value)}
                className="w-full h-9 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-[#006194]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#bfc7d2]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#565e74] hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Registrar e Iniciar Conciliación</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;
