import React from 'react';
import { Patient } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface PatientBannerProps {
  patient: Patient;
  hasCriticalBlock: boolean;
  unresolvedCount: number;
  isConsolidated: boolean;
  onOpenConsolidationModal: () => void;
  onOpenNewPatientModal?: () => void;
}

export const PatientBanner: React.FC<PatientBannerProps> = ({
  patient,
  hasCriticalBlock,
  unresolvedCount,
  isConsolidated,
  onOpenConsolidationModal,
  onOpenNewPatientModal,
}) => {
  return (
    <section className="w-full bg-white shadow-sm border-b border-[#bfc7d2]/50 px-4 sm:px-6 py-3 mb-3">
      <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Patient Identity & Bed info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-[#cce5ff] flex items-center justify-center text-[#006194] shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">airline_seat_flat</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[15px] sm:text-[16px] text-[#0b1c30] truncate">
                {patient.nombre}
              </span>
              <span className="font-code-audit text-[11px] px-1.5 py-0.5 bg-[#e5eeff] rounded text-[#3f4850] font-medium">
                <ClinicalTooltip code="PID">PID</ClinicalTooltip> {patient.pid}
              </span>
              <span className="font-label-caps text-[10px] px-1.5 py-0.5 bg-[#dae2fd] text-[#131b2e] rounded uppercase font-bold">
                {patient.edad}a • {patient.sexo === 'M' ? 'Masc' : 'Fem'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#3f4850] font-body-dense text-[12px] flex-wrap mt-0.5">
              <span className="font-medium text-[#006194]">{patient.servicio}</span>
              <span>•</span>
              <span className="font-semibold text-[#0b1c30]">Cama {patient.cama}</span>
              <span>•</span>
              <span className="font-code-audit text-[11px]">Adm: {patient.fechaIngreso}</span>
            </div>
          </div>
        </div>

        {/* Clinical Metrics & Calculations (DuBois BSA, Cockcroft ClCr) */}
        <div className="flex items-center gap-3 flex-wrap bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#bfc7d2]/40">
          <div className="flex flex-col">
            <span className="font-label-caps text-[9px] text-[#3f4850] uppercase">Antropometría</span>
            <span className="font-body-bold text-[13px] text-[#0b1c30]">
              {patient.pesoKg} kg <span className="text-[#3f4850] font-normal">| {patient.tallaCm} cm</span>
            </span>
          </div>

          <div className="h-6 w-px bg-[#bfc7d2]/60 hidden sm:block"></div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[9px] text-[#3f4850] uppercase">
                <ClinicalTooltip code="ASC">ASC (DuBois)</ClinicalTooltip>
              </span>
            </div>
            <span className="font-body-bold text-[13px] text-[#006194] flex items-center gap-1">
              {patient.bsaDuBois} m²{' '}
              <span className="font-code-audit text-[10px] text-[#3f4850] font-normal">[Cálc Auto]</span>
            </span>
          </div>

          <div className="h-6 w-px bg-[#bfc7d2]/60 hidden sm:block"></div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[9px] text-[#ba1a1a] uppercase font-bold">
                <ClinicalTooltip code="ClCr">ClCr (Cockcroft)</ClinicalTooltip>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-body-bold text-[13px] text-[#ba1a1a]">{patient.clCr} mL/min</span>
              <span className="font-label-caps text-[9px] bg-[#ffdad6] text-[#93000a] px-1 rounded">
                Mod. / Acumulación
              </span>
            </div>
          </div>
        </div>

        {/* Confirmed Allergies & Consolidation Action */}
        <div className="flex items-center gap-3 shrink-0 justify-between xl:justify-end flex-wrap">
          <div className="flex flex-col">
            <span className="font-label-caps text-[9px] text-[#3f4850] uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#ba1a1a]">warning</span>
              Alergias Confirmadas
            </span>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {patient.alergias.map((al, idx) => (
                <span
                  key={idx}
                  className="font-label-caps text-[9px] px-1.5 py-0.5 bg-[#ffdad6] text-[#93000a] rounded font-bold uppercase tracking-wider"
                  title={al.reaccion}
                >
                  {al.sustancia}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#bfc7d2]/40">
            <div className="flex flex-col text-right">
              {hasCriticalBlock ? (
                <span className="font-label-caps text-[9px] text-[#ba1a1a] uppercase font-bold flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  {unresolvedCount} Discrepancias • 1 Bloqueo Fatal
                </span>
              ) : isConsolidated ? (
                <span className="font-label-caps text-[9px] text-[#00694c] uppercase font-bold flex items-center justify-end gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#00694c]">task_alt</span>
                  Consolidado con Éxito
                </span>
              ) : (
                <span className="font-label-caps text-[9px] text-[#00694c] uppercase font-bold flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00694c]"></span>
                  Bloqueos Liberados • Listo para Firma
                </span>
              )}
              <span className="font-code-audit text-[10px] text-[#3f4850]">
                {isConsolidated ? (
                  <span>
                    Estado: Consolidado <ClinicalTooltip code="FHIR">FHIR</ClinicalTooltip>
                  </span>
                ) : (
                  'Estado: En Progreso'
                )}
              </span>
            </div>

            {onOpenNewPatientModal && (
              <button
                onClick={onOpenNewPatientModal}
                className="px-3 py-1.5 rounded font-body-bold text-[12px] bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] border border-[#006194]/40 flex items-center gap-1 transition-all"
                title="Registrar un nuevo paciente"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span className="hidden sm:inline">Nuevo Paciente</span>
              </button>
            )}

            <button
              onClick={onOpenConsolidationModal}
              disabled={hasCriticalBlock}
              title={
                hasCriticalBlock
                  ? 'Resuelva o sobreescriba los bloqueos críticos del CDSS para desbloquear la firma'
                  : 'Firmar electrónicamente y consolidar la conciliación'
              }
              className={`px-3 py-1.5 rounded font-body-bold text-[13px] flex items-center gap-1.5 transition-all shadow-sm ${
                hasCriticalBlock
                  ? 'bg-[#dce9ff] text-[#707881] opacity-60 cursor-not-allowed'
                  : isConsolidated
                  ? 'bg-[#1e8462] text-white hover:bg-[#00694c]'
                  : 'bg-[#006194] text-white hover:bg-[#007bb9]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {hasCriticalBlock ? 'lock' : isConsolidated ? 'verified' : 'draw'}
              </span>
              <span>{isConsolidated ? 'Ver Firma FHIR' : 'Firmar y Consolidar'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
