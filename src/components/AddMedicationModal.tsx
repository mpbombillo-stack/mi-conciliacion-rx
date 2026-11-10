import React, { useState } from 'react';
import { PreAdmissionMedication, InpatientOrder } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoDestino: 'pre-ingreso' | 'intrahospitalario';
  onSavePreAdmission?: (med: PreAdmissionMedication) => void;
  onSaveInpatientOrder?: (order: InpatientOrder) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  tipoDestino,
  onSavePreAdmission,
  onSaveInpatientOrder,
}) => {
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [via, setVia] = useState('Vía Oral');
  const [posologia, setPosologia] = useState('');
  const [indicacion, setIndicacion] = useState('');
  const [prescriptor, setPrescriptor] = useState('Dr. Especialista Tratante');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [esTratamientoCronico, setEsTratamientoCronico] = useState(true);
  const [fechaFinEstimada, setFechaFinEstimada] = useState('');
  const [duracionDias, setDuracionDias] = useState<number | ''>('');
  const [esMAR, setEsMAR] = useState(false);
  const [tipoPre, setTipoPre] = useState<'Prescrito' | 'Automedicado' | 'Especialidad' | 'Fitoterapia'>('Prescrito');
  const [cumInvima, setCumInvima] = useState('');
  const [atc, setAtc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !dosis.trim()) return;

    if (tipoDestino === 'pre-ingreso' && onSavePreAdmission) {
      const newMed: PreAdmissionMedication = {
        id: `pre-custom-${Date.now()}`,
        nombre: nombre.trim(),
        dosis: dosis.trim(),
        via,
        posologia: posologia.trim() || `${dosis} ${via}`,
        atc: atc.trim() || 'ATC-ND',
        atcGrupo: 'ATC-C',
        esMAR,
        tipo: tipoPre,
        indicacion: indicacion.trim() || 'Uso habitual ambulatorio',
        adherencia: '100%',
        cumInvima: cumInvima.trim() || '19900000-01',
        fechaInicio,
        prescritoPor: prescriptor.trim(),
        fechaFinEstimada: esTratamientoCronico ? 'Tratamiento Crónico Indefinido' : fechaFinEstimada,
        esTratamientoCronico,
      };
      onSavePreAdmission(newMed);
    } else if (tipoDestino === 'intrahospitalario' && onSaveInpatientOrder) {
      const newOrder: InpatientOrder = {
        id: `ord-custom-${Date.now()}`,
        numeroOrden: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        nombre: `${nombre.trim()} ${dosis.trim()} ${via}`,
        dosis: dosis.trim(),
        via,
        posologia: posologia.trim() || `${dosis} ${via}`,
        indicacion: indicacion.trim() || 'Indicación médica intrahospitalaria',
        prescriptor: prescriptor.trim(),
        accionSeleccionada: 'continuar',
        estadoValidacion: 'Validado',
        cumInvima: cumInvima.trim() || '19950000-01',
        fechaInicio,
        fechaFinEstimada: esTratamientoCronico ? undefined : fechaFinEstimada,
        duracionDias: typeof duracionDias === 'number' ? duracionDias : undefined,
      };
      onSaveInpatientOrder(newOrder);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#bfc7d2] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-[#eff4ff] p-4 sm:p-5 flex items-center justify-between border-b border-[#bfc7d2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">medication</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                {tipoDestino === 'pre-ingreso'
                  ? 'Registrar Medicamento Pre-Ingreso (Ambulatorio)'
                  : 'Crear Orden Intrahospitalaria'}
              </h2>
              <p className="text-[11px] text-[#565e74]">
                Registro farmacológico detallado: indicación, posología, formulador y fechas de tratamiento.
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
          {/* Nombre y Dosis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                Principio Activo & Nombre Comercial *
              </label>
              <input
                required
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Enalapril, Atorvastatina, Levotiroxina..."
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                Dosificación *
              </label>
              <input
                required
                type="text"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                placeholder="Ej. 20 mg, 500 mg, 5 UI..."
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
          </div>

          {/* Vía y Posología */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                Vía de Administración
              </label>
              <select
                value={via}
                onChange={(e) => setVia(e.target.value)}
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              >
                <option value="Vía Oral">Vía Oral (VO)</option>
                <option value="Intravenosa">Intravenosa (IV)</option>
                <option value="Subcutánea">Subcutánea (SC)</option>
                <option value="Intramuscular">Intramuscular (IM)</option>
                <option value="Inhalatoria">Inhalatoria</option>
                <option value="Tópica">Tópica</option>
                <option value="Sublingual">Sublingual</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                Frecuencia / Posología
              </label>
              <input
                type="text"
                value={posologia}
                onChange={(e) => setPosologia(e.target.value)}
                placeholder="Ej. 1 comp c/12h con alimentos (8:00 - 20:00)"
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
          </div>

          {/* Indicación Clínica y Formulación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                ¿Para qué se formuló? (Indicación Médica) *
              </label>
              <input
                required
                type="text"
                value={indicacion}
                onChange={(e) => setIndicacion(e.target.value)}
                placeholder="Ej. Hipertensión arterial, Diabetes, Analgesia..."
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-[#565e74] uppercase tracking-wider">
                ¿Quién lo formuló? (Médico / Especialidad) *
              </label>
              <input
                required
                type="text"
                value={prescriptor}
                onChange={(e) => setPrescriptor(e.target.value)}
                placeholder="Ej. Dr. Andrés Castro (Cardiología EPS)"
                className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>
          </div>

          {/* Fechas de Inicio y Término / Finalización */}
          <div className="bg-[#f0f4f9] p-3.5 rounded-xl border border-[#bfc7d2]/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006194]">calendar_clock</span>
                Temporalidad del Tratamiento
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#565e74]">
                <input
                  type="checkbox"
                  checked={esTratamientoCronico}
                  onChange={(e) => setEsTratamientoCronico(e.target.checked)}
                  className="rounded text-[#006194] focus:ring-0"
                />
                <span>Tratamiento Crónico / Continuo (Sin fecha de fin)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                  Fecha de Inicio de Toma
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-[#bfc7d2]/60 rounded-lg text-xs font-medium outline-none"
                />
              </div>

              {!esTratamientoCronico ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                    ¿Cuándo Finaliza? (Fecha Fin Estimada)
                  </label>
                  <input
                    type="date"
                    value={fechaFinEstimada}
                    onChange={(e) => setFechaFinEstimada(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#bfc7d2]/60 rounded-lg text-xs font-medium outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center p-2 rounded bg-white text-[11px] text-[#00694c] font-medium border border-[#00694c]/20">
                  <span className="material-symbols-outlined text-[16px] mr-1">all_inclusive</span>
                  Medicación continua a largo plazo. Se revisa en conciliación al alta.
                </div>
              )}
            </div>
          </div>

          {/* Metadatos Adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tipoDestino === 'pre-ingreso' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                  Tipo de Medicación
                </label>
                <select
                  value={tipoPre}
                  onChange={(e) => setTipoPre(e.target.value as any)}
                  className="w-full h-9 px-2.5 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-semibold"
                >
                  <option value="Prescrito">Prescrito por Médico</option>
                  <option value="Automedicado">Automedicado / Sin Receta</option>
                  <option value="Especialidad">Medicamento de Especialidad</option>
                  <option value="Fitoterapia">Fitoterapia / Suplemento</option>
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#565e74] uppercase tracking-wider">
                <ClinicalTooltip code="CUM">Código CUM INVIMA</ClinicalTooltip>
              </label>
              <input
                type="text"
                value={cumInvima}
                onChange={(e) => setCumInvima(e.target.value)}
                placeholder="Ej. 19920144-01"
                className="w-full h-9 px-2.5 bg-[#eff4ff] border border-[#bfc7d2]/60 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#ba1a1a]">
                <input
                  type="checkbox"
                  checked={esMAR}
                  onChange={(e) => setEsMAR(e.target.checked)}
                  className="rounded text-[#ba1a1a] focus:ring-0"
                />
                <span>Es <ClinicalTooltip code="MAR">MAR</ClinicalTooltip> (Alto Riesgo ISMP)</span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#bfc7d2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#565e74] hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#006194] hover:bg-[#007bb9] text-white shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Guardar Medicamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
