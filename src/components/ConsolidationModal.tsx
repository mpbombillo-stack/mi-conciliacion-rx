import React, { useState } from 'react';
import { Patient, InpatientOrder } from '../types/clinical';

interface ConsolidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  orders: InpatientOrder[];
  isAlreadyConsolidated: boolean;
  onConfirmConsolidation: () => void;
}

export const ConsolidationModal: React.FC<ConsolidationModalProps> = ({
  isOpen,
  onClose,
  patient,
  orders,
  isAlreadyConsolidated,
  onConfirmConsolidation,
}) => {
  const [pin, setPin] = useState('');
  const [notes, setNotes] = useState('Conciliación farmacéutica completada según guía institucional y estándares OMS/ISMP.');
  const [success, setSuccess] = useState(isAlreadyConsolidated);

  if (!isOpen) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    onConfirmConsolidation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-[#bfc7d2] max-w-2xl w-full p-6 flex flex-col gap-4 text-[#0b1c30]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#bfc7d2]/40 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#cce5ff] flex items-center justify-center text-[#006194]">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <h2 className="font-headline-md text-[18px] text-[#0b1c30]">
                {success ? 'Plan de Conciliación Consolidado' : 'Firma Digital y Consolidación Farmacéutica'}
              </h2>
              <span className="font-code-audit text-[11px] text-[#565e74]">
                Estándar HL7 FHIR R4: MedicationStatement/AuditTrail • Centro Médico de Especialistas Clínica Santillana
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eff4ff] flex items-center justify-center text-[#707881] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        {!success ? (
          <form onSubmit={handleSign} className="flex flex-col gap-4">
            <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#bfc7d2]/50 text-[12px] flex flex-col gap-1.5">
              <span className="font-body-bold text-[#006194] uppercase tracking-wide">
                Resumen de Decisiones Farmacoterapéuticas:
              </span>
              <ul className="space-y-1 text-[#3f4850] list-disc list-inside">
                {orders.map((ord) => (
                  <li key={ord.id}>
                    <span className="font-semibold text-[#0b1c30]">{ord.nombre}:</span>{' '}
                    <span className="capitalize font-bold text-[#006194]">[{ord.accionSeleccionada}]</span> -{' '}
                    <span className="italic">{ord.motivoAccion || 'Validado según protocolo'}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps uppercase text-[#3f4850] text-[10px]">
                Nota Clínica de Cierre Farmacológico
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full text-[12px] bg-[#eff4ff] text-[#0b1c30] rounded-lg p-2.5 border border-[#bfc7d2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007bb9]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#eff4ff]/60 p-3 rounded-lg border border-[#bfc7d2]/40">
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] uppercase text-[#707881]">
                  Responsable Farmacovigilancia
                </span>
                <span className="font-body-bold text-[13px] text-[#00694c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Dra. Marcela Cardona H.
                </span>
                <span className="font-code-audit text-[10px] text-[#565e74]">
                  Reg. FarmaClínica #8492 • Clínica Santillana
                </span>
              </div>

              <div className="flex flex-col">
                <label className="font-label-caps text-[9px] uppercase text-[#707881]">
                  PIN de Firma Digital Electrónica
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Ej: 8492"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    className="w-32 text-[13px] font-mono tracking-widest bg-white border border-[#bfc7d2] rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#007bb9]"
                  />
                  <span className="font-code-audit text-[10px] text-[#707881]">(PIN de prueba: 8492)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#bfc7d2]/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[#3f4850] hover:bg-[#eff4ff] font-medium text-[12px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#006194] text-white font-body-bold text-[12px] hover:bg-[#007bb9] flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">draw</span>
                <span>Firmar y Emitir HL7 FHIR Bundle</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-[#97f5cc]/30 border border-[#1e8462]/30 rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e8462] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-[15px] text-[#00694c] font-bold">
                  ¡Conciliación Oficial Asentada en Historia Clínica!
                </span>
                <p className="font-body-dense text-[12px] text-[#00513a] mt-0.5">
                  El expediente de <strong>{patient.nombre}</strong> ha sido consolidado. Los bloqueos críticos
                  fueron superados con justificación institucional y el plan de egreso y enfermería 5C se
                  encuentran sincronizados.
                </p>
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#bfc7d2]/40 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-code-audit">
                <span className="text-[#3f4850]">HASH CRIPTOGRÁFICO DE AUDITORÍA:</span>
                <span className="font-bold text-[#006194]">9a7f.e23b.cc81.049f.77da</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-code-audit">
                <span className="text-[#3f4850]">FIRMA MÉDICA INTERNISTA:</span>
                <span className="font-bold text-[#006194]">3c11.0f9a.887b.d442.e019</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-code-audit">
                <span className="text-[#3f4850]">NODO RECEPTOR HL7:</span>
                <span className="text-[#00694c]">RXE-SANTILLANA-CLUSTER-01 • 200 OK</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#bfc7d2]/40">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#006194] text-white rounded-lg font-body-bold text-[12px] hover:bg-[#007bb9] shadow-sm transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
