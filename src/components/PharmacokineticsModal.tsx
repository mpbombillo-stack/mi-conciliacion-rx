import React from 'react';

interface PharmacokineticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacokineticsModal: React.FC<PharmacokineticsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-[#bfc7d2] max-w-xl w-full p-5 flex flex-col gap-4 text-[#0b1c30]">
        <div className="flex items-start justify-between border-b border-[#bfc7d2]/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#97f5cc]/40 flex items-center justify-center text-[#00694c]">
              <span className="material-symbols-outlined text-[20px]">psychiatry</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-[#0b1c30] font-bold">
                Farmacocinética & Interacción: Ginkgo Biloba
              </h3>
              <span className="font-code-audit text-[11px] text-[#565e74]">
                Extracto EGB 761 • ATC: N06DX02 • Alerta INVIMA Farmacovigilancia
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

        <div className="flex flex-col gap-3 text-[12px] leading-relaxed">
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#bfc7d2]/50">
            <span className="font-body-bold text-[#006194] uppercase tracking-wide text-[11px]">
              Mecanismo Fisiopatológico:
            </span>
            <p className="mt-1 text-[#3f4850]">
              Los ginkgólidos A, B y C son potentes antagonistas competitivos del receptor del{' '}
              <strong>Factor Activador de Plaquetas (PAF)</strong>. Inhiben la agregación plaquetaria y la
              degranulación dependiente de tromboxano A2. Adicionalmente modula citocromos CYP2C9 y CYP3A4.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/20">
            <span className="font-body-bold text-[#ba1a1a] uppercase tracking-wide text-[11px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">warning</span>
              Riesgo Quirúrgico y Hospitalario:
            </span>
            <p className="mt-1 text-[#93000a]">
              En pacientes hospitalizados que reciben tromboprofilaxis con Heparinas de Bajo Peso Molecular
              (Enoxaparina 40 mg SC/día) o antiagregantes (AAS, Clopidogrel), el uso concomitante incrementa el
              riesgo de sangrado mayor (hematoma retroperitoneal, hemorragia gastrointestinal y sangrado en
              sitios de punción).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#e5eeff]">
            <span className="font-body-bold text-[#00694c] uppercase tracking-wide text-[11px]">
              Recomendación Farmacéutica Institucional (Clínica Santillana):
            </span>
            <ul className="mt-1 space-y-1 text-[#3f4850] list-disc list-inside">
              <li>Suspender fitoterapia de inmediato al ingreso hospitalario.</li>
              <li>Aclaramiento total en 48 - 72 horas previas a procedimientos intervencionistas.</li>
              <li>Instruir al paciente y familiares en la Hoja de Alta OMS sobre no reanudar sin consulta médica.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#bfc7d2]/40">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#006194] text-white rounded-lg font-body-bold text-[12px] hover:bg-[#007bb9] transition-colors shadow-sm"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
