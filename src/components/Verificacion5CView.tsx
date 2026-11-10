import React, { useState } from 'react';
import { Patient, Verification5CState, TabView } from '../types/clinical';

interface Verificacion5CViewProps {
  patient: Patient;
  verificationState: Verification5CState;
  onConfirmAdministration: () => void;
  onReportDiscrepancy: (reason: string) => void;
  onNavigateTab: (tab: TabView) => void;
  isMobileDeviceView: boolean;
}

export const Verificacion5CView: React.FC<Verificacion5CViewProps> = ({
  patient,
  verificationState,
  onConfirmAdministration,
  onReportDiscrepancy,
  onNavigateTab,
  isMobileDeviceView,
}) => {
  const [torchActive, setTorchActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscrepancyModalOpen, setIsDiscrepancyModalOpen] = useState(false);
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualCode, setManualCode] = useState('LOT-88220A');
  const [activeScannedDrug, setActiveScannedDrug] = useState<'furosemida' | 'ketorolaco' | 'metotrexato'>('furosemida');

  const handleAdminister = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmAdministration();
    }, 700);
  };

  const handleSaveDiscrepancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discrepancyReason) return;
    onReportDiscrepancy(discrepancyReason);
    setIsDiscrepancyModalOpen(false);
    setDiscrepancyReason('');
  };

  const content = (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-6 space-y-3 font-body-base text-[#0b1c30]">
      {/* 1. PATIENT CLINICAL HEADER BANNER (Compact Safe Bedside Header) */}
      <section className="bg-white shadow-sm rounded-xl p-3 space-y-1.5 border border-[#bfc7d2]/40">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-[15px] text-[#0b1c30]">{patient.nombre}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#dae2fd] text-[#5c647a] font-label-caps text-[10px]">
                {patient.edad} AÑOS
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[#3f4850] font-code-audit text-[11px] flex-wrap">
              <span className="flex items-center gap-1 font-body-bold text-[#006194]">
                <span className="material-symbols-outlined text-[15px]">single_bed</span>
                Cama {patient.cama}
              </span>
              <span>•</span>
              <span>PID: {patient.pid}</span>
              <span>•</span>
              <span>{patient.servicio}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] font-label-caps text-[10px] font-bold">
              <span className="material-symbols-outlined text-[13px] text-[#00694c]">nfc</span>
              RFID ACTIVO
            </span>
            <span className="font-label-mono-metric text-[12px] text-[#3f4850] mt-1">
              ClCr: {patient.clCr} mL/min
            </span>
          </div>
        </div>

        {/* Critical Allergy & Renal Alert Strip */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div className="flex items-center gap-1 bg-[#ffdad6] text-[#93000a] px-2 py-1 rounded font-label-caps text-[10px] font-bold shadow-xs">
            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">dangerous</span>
            <span>ALERGIA: PENICILINAS (ANAFILAXIA)</span>
          </div>
          <div className="flex items-center gap-1 bg-[#ffdad6] text-[#93000a] px-2 py-1 rounded font-label-caps text-[10px] font-bold shadow-xs">
            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">warning</span>
            <span>SULFONAMIDAS</span>
          </div>
          <div className="flex items-center gap-1 bg-[#dae2fd] text-[#131b2e] px-2 py-1 rounded font-label-caps text-[10px]">
            <span className="material-symbols-outlined text-[14px] text-[#006194]">info</span>
            <span>TFG DISMINUIDA (AJUSTADO)</span>
          </div>
        </div>
      </section>

      {/* Drug Switcher for Bedside Simulation testing */}
      <div className="flex items-center justify-between px-1 text-[11px] font-code-audit text-[#565e74]">
        <span>SIMULADOR DE LECTURA GS1:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveScannedDrug('furosemida')}
            className={`px-2 py-0.5 rounded ${
              activeScannedDrug === 'furosemida'
                ? 'bg-[#006194] text-white font-bold'
                : 'bg-[#e5eeff] text-[#3f4850]'
            }`}
          >
            Furosemida 40mg
          </button>
          <button
            onClick={() => setActiveScannedDrug('ketorolaco')}
            className={`px-2 py-0.5 rounded ${
              activeScannedDrug === 'ketorolaco'
                ? 'bg-[#ba1a1a] text-white font-bold'
                : 'bg-[#e5eeff] text-[#3f4850]'
            }`}
          >
            Ketorolaco (Alerta)
          </button>
        </div>
      </div>

      {/* 2. BARCODE SCANNER VIEWPORT HUD (Live GS1 / DataMatrix) */}
      <section className="bg-[#213145] rounded-xl overflow-hidden shadow-md text-[#eaf1ff] border border-[#213145]">
        {/* Camera Viewport Simulation */}
        <div className="relative w-full h-44 bg-[#d3e4fe]/15 flex flex-col justify-between p-3 overflow-hidden">
          {/* Background Ambient Lens Graphic */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#213145]/80 via-transparent to-[#213145]/90 pointer-events-none"></div>

          {/* HUD Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#213145]/90 text-[#eaf1ff]">
              <span className="w-2 h-2 rounded-full bg-[#00694c] animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-[#00694c] absolute"></span>
              <span className="font-label-caps text-[10px] pl-2 uppercase font-bold">
                Láser LiDAR Activo • GS1-128 & 2D
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTorchActive(!torchActive)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                  torchActive ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#213145]/80 text-[#eaf1ff]'
                }`}
                title="Alternar Linterna"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {torchActive ? 'flash_on' : 'flash_off'}
                </span>
              </button>
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="px-2.5 h-8 rounded-full bg-[#213145]/80 flex items-center gap-1 text-[#eaf1ff] active:scale-95 transition-transform font-label-caps text-[10px]"
                title="Ingreso Manual"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">keyboard</span>
                Manual
              </button>
            </div>
          </div>

          {/* Medical Scanner Reticle / Crosshairs */}
          <div className="relative z-10 self-center flex items-center justify-center my-auto">
            <div className="relative w-48 h-20 flex items-center justify-center">
              {/* Animated HUD Laser Line */}
              <div className="absolute inset-x-0 h-0.5 bg-[#97f5cc] shadow-[0_0_12px_#7bd8b1] animate-laser"></div>

              {/* Crosshair graphic */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#97f5cc] rounded-full"></div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#97f5cc] rounded-full"></div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#97f5cc] rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#97f5cc] rounded-full"></div>

              {/* Target corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#97f5cc] rounded-tl"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#97f5cc] rounded-tr"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#97f5cc] rounded-bl"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#97f5cc] rounded-br"></div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#213145]/90 shadow-sm border border-[#97f5cc]/30">
                <span className="material-symbols-outlined text-[#97f5cc] text-[16px]">check_circle</span>
                <span className="font-label-caps text-[10px] text-[#eaf1ff] tracking-wider font-bold">
                  CÓDIGO EMPAQUE CAPTURADO
                </span>
              </div>
            </div>
          </div>

          {/* Raw Barcode Scanned String */}
          <div className="relative z-10 flex items-center justify-between gap-2 bg-[#213145]/95 px-2.5 py-1.5 rounded-lg border border-[#3f4850]">
            <div className="min-w-0 flex-1 truncate">
              <div className="font-code-audit text-[10px] text-[#97f5cc] truncate">
                {activeScannedDrug === 'furosemida'
                  ? '(01)07702134567890(17)261231(10)LOT-88220A(21)SN-49102'
                  : '(01)07709928172641(17)250815(10)LOT-KET30B(21)SN-10294'}
              </div>
              <div className="font-label-caps text-[9px] text-[#eaf1ff]/80">
                {activeScannedDrug === 'furosemida'
                  ? 'Lote: 88220A • Cad: 31/12/2026 • Ampolla GS1'
                  : 'Lote: KET30B • Cad: 15/08/2025 • Ampolla GS1 (Alerta Bloqueo)'}
              </div>
            </div>
            <span className="material-symbols-outlined text-[#00694c] text-[20px] shrink-0">
              qr_code_scanner
            </span>
          </div>
        </div>

        {/* Scanned Drug Match Identity Card */}
        <div className="bg-white p-3 text-[#0b1c30] space-y-1">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-label-caps text-[10px] font-bold">
              FÁRMACO RECONOCIDO POR MAR
            </span>
            <span
              className={`font-label-caps text-[10px] uppercase flex items-center gap-1 font-bold ${
                activeScannedDrug === 'furosemida' ? 'text-[#00694c]' : 'text-[#ba1a1a]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeScannedDrug === 'furosemida' ? 'bg-[#00694c]' : 'bg-[#ba1a1a]'
                }`}
              ></span>
              {activeScannedDrug === 'furosemida' ? 'COINCIDENCIA 100%' : 'ORDEN SUSPENDIDA EN CDSS'}
            </span>
          </div>
          <div
            className={`font-headline-md text-[18px] pt-0.5 font-bold ${
              activeScannedDrug === 'furosemida' ? 'text-[#006194]' : 'text-[#ba1a1a]'
            }`}
          >
            {activeScannedDrug === 'furosemida' ? 'Furosemida 40 mg / 4 mL' : 'Ketorolaco Trometamol 30 mg / 1 mL'}
          </div>
          <div className="flex items-center justify-between text-[#3f4850] font-body-dense text-[12px]">
            <span>Solución Inyectable IV • Ampolla</span>
            <span className="font-code-audit text-[11px]">
              CUM: {activeScannedDrug === 'furosemida' ? '19934821-02' : '19914022-04'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. VERIFICATION CHECKLIST: THE 5 RIGHTS (5 CORRECTOS) */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006194] text-[20px]">fact_check</span>
            <h2 className="font-semibold text-[15px] text-[#0b1c30]">Validación 5C a Pie de Cama</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#00694c] text-white font-label-caps text-[10px] font-bold">
            5 DE 5 VERIFICADOS
          </span>
        </div>

        {/* Right 1: Patient */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#bfc7d2]/40 space-y-1.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#97f5cc] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#002115] text-[18px]">person_check</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-caps text-[10px] uppercase text-[#3f4850]">
                  1. Paciente Correcto (Right Patient)
                </div>
                <div className="font-body-bold text-[13px] text-[#0b1c30] truncate">{patient.nombre}</div>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00694c] text-white font-label-caps text-[10px] shrink-0 font-bold">
              <span className="material-symbols-outlined text-[13px]">check</span>
              VALIDADO
            </span>
          </div>
          <div className="bg-[#eff4ff] p-2 rounded-lg flex items-center justify-between text-[#3f4850] font-code-audit text-[11px]">
            <span>Pulsera RFID ID: {verificationState.paciente.rfid}</span>
            <span className="text-[#00694c] font-bold">{verificationState.paciente.detalle}</span>
          </div>
        </div>

        {/* Right 2: Drug */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#bfc7d2]/40 space-y-1.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#97f5cc] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#002115] text-[18px]">medication</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-caps text-[10px] uppercase text-[#3f4850]">
                  2. Medicamento Correcto (Right Drug)
                </div>
                <div className="font-body-bold text-[13px] text-[#0b1c30] truncate">
                  {activeScannedDrug === 'furosemida' ? verificationState.medicamento.nombre : 'Ketorolaco 30 mg IV'}
                </div>
              </div>
            </div>
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-label-caps text-[10px] shrink-0 font-bold text-white ${
                activeScannedDrug === 'furosemida' ? 'bg-[#00694c]' : 'bg-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {activeScannedDrug === 'furosemida' ? 'check' : 'close'}
              </span>
              {activeScannedDrug === 'furosemida' ? 'VALIDADO' : 'SUSPENDIDO'}
            </span>
          </div>
          <div className="bg-[#eff4ff] p-2 rounded-lg flex items-center justify-between text-[#3f4850] font-code-audit text-[11px]">
            <span>Orden médica activa: {verificationState.medicamento.orden}</span>
            <span
              className={`font-bold ${
                activeScannedDrug === 'furosemida' ? 'text-[#00694c]' : 'text-[#ba1a1a]'
              }`}
            >
              {activeScannedDrug === 'furosemida' ? verificationState.medicamento.detalle : 'SUSPENSIÓN CDSS'}
            </span>
          </div>
        </div>

        {/* Right 3: Dose */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#bfc7d2]/40 space-y-1.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#97f5cc] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#002115] text-[18px]">scale</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-caps text-[10px] uppercase text-[#3f4850]">
                  3. Dosis Correcta (Right Dose)
                </div>
                <div className="font-body-bold text-[13px] text-[#0b1c30]">
                  {verificationState.dosis.detectada}
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00694c] text-white font-label-caps text-[10px] shrink-0 font-bold">
              <span className="material-symbols-outlined text-[13px]">check</span>
              VALIDADO
            </span>
          </div>
          <div className="bg-[#eff4ff] p-2 rounded-lg flex items-center justify-between text-[#3f4850] font-code-audit text-[11px]">
            <span>Pautada: 40 mg • Detectada: 40 mg</span>
            <span className="text-[#00694c] font-bold">{verificationState.dosis.detalle}</span>
          </div>
        </div>

        {/* Right 4: Route */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#bfc7d2]/40 space-y-1.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#97f5cc] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#002115] text-[18px]">vaccines</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-caps text-[10px] uppercase text-[#3f4850]">
                  4. Vía Correcta (Right Route)
                </div>
                <div className="font-body-bold text-[13px] text-[#0b1c30]">
                  {verificationState.via.descripcion}
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00694c] text-white font-label-caps text-[10px] shrink-0 font-bold">
              <span className="material-symbols-outlined text-[13px]">check</span>
              VALIDADO
            </span>
          </div>
          <div className="bg-[#eff4ff] p-2 rounded-lg flex items-center justify-between text-[#3f4850] font-code-audit text-[11px]">
            <span>{verificationState.via.sitio}</span>
            <span className="text-[#00694c] font-bold">{verificationState.via.detalle}</span>
          </div>
        </div>

        {/* Right 5: Time */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#bfc7d2]/40 space-y-1.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#97f5cc] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#002115] text-[18px]">schedule</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-caps text-[10px] uppercase text-[#3f4850]">
                  5. Hora / Intervalo (Right Time)
                </div>
                <div className="font-body-bold text-[13px] text-[#0b1c30]">
                  Programada: {verificationState.hora.programada} (Ventana: {verificationState.hora.actual})
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00694c] text-white font-label-caps text-[10px] shrink-0 font-bold">
              <span className="material-symbols-outlined text-[13px]">check</span>
              VALIDADO
            </span>
          </div>
          <div className="bg-[#eff4ff] p-2 rounded-lg flex items-center justify-between text-[#3f4850] font-code-audit text-[11px]">
            <span>Ventana segura: {verificationState.hora.ventanaSegura}</span>
            <span className="text-[#00694c] font-bold">{verificationState.hora.detalle}</span>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME CDSS SAFETY CLEARANCE BANNER */}
      <section className="bg-[#97f5cc] text-[#002115] rounded-xl p-3 shadow-xs space-y-1 border border-[#1e8462]/30">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#00694c] text-[20px]">verified</span>
          <span className="font-body-bold text-[13px] text-[#002115]">
            Validación Farmacológica CDSS Aprobada
          </span>
        </div>
        <p className="font-body-dense text-[12px] text-[#00513a] leading-relaxed">
          Sin alertas de «Triple Whammy» activo (AINE Ketorolaco suspendido previamente). Se monitoriza balance
          acumulado (+850 mL/24h) y control de potasio sérico.
        </p>
        <div className="flex items-center justify-between pt-1 font-label-caps text-[10px] text-[#00513a]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00694c]"></span>
            Enlace HL7 RXE Transmitido
          </span>
          <span>Farmacia Centralizada OK</span>
        </div>
      </section>

      {/* 5. CLINICAL AUDIT & ACTION BUTTONS */}
      <section className="bg-white rounded-xl p-3 shadow-xs space-y-3 border border-[#bfc7d2]/40">
        {/* Nurse Operator ID Stamp */}
        <div className="flex items-center justify-between bg-[#eff4ff] p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#dae2fd] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#5c647a] text-[16px]">assignment_ind</span>
            </div>
            <div>
              <div className="font-label-caps text-[10px] text-[#3f4850]">OPERADOR RESPONSABLE</div>
              <div className="font-body-bold text-[13px] text-[#0b1c30]">{verificationState.operador}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-label-caps text-[10px] text-[#3f4850]">REGISTRO MAR</div>
            <div className="font-code-audit text-[11px] text-[#006194] font-bold">
              {verificationState.registroMar}
            </div>
          </div>
        </div>

        {/* Quadrant Actions */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleAdminister}
            disabled={isSubmitting || verificationState.administracionConfirmada}
            className={`w-full h-12 rounded-xl font-headline-sm text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md ${
              verificationState.administracionConfirmada
                ? 'bg-[#dae2fd] text-[#5c647a] shadow-xs'
                : 'bg-[#00694c] text-white hover:bg-[#1e8462]'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                <span>Registrando en MAR Hospitalario...</span>
              </>
            ) : verificationState.administracionConfirmada ? (
              <>
                <span className="material-symbols-outlined text-[#00694c] text-[20px]">task_alt</span>
                <span>¡Administración Asentada en MAR!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Confirmar Administración (5/5 OK)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsDiscrepancyModalOpen(true)}
            className="w-full h-10 rounded-xl bg-[#dce9ff] text-[#3f4850] font-body-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98] hover:bg-[#cce5ff] transition-all"
          >
            <span className="material-symbols-outlined text-[#565e74] text-[18px]">report_problem</span>
            <span>Reportar Discrepancia o Desviación</span>
          </button>
        </div>
      </section>

      {/* Manual Code Input Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full space-y-3">
            <h3 className="font-headline-sm text-[16px] text-[#0b1c30]">Ingreso Manual de GS1-128 / CUM</h3>
            <p className="text-[12px] text-[#3f4850]">
              Si el lector óptico o LiDAR presenta fallas de enfoque, digite el identificador del envase:
            </p>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ej: LOT-88220A o CUM 19934821-02"
              className="w-full p-2 bg-[#eff4ff] border border-[#bfc7d2] rounded-lg text-[13px] font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-3 py-1.5 rounded text-[12px] text-[#565e74]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Código ${manualCode} verificado manualmente en el maestro de farmacia.`);
                  setIsManualModalOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-[#006194] text-white text-[12px] font-bold"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Discrepancy Modal */}
      {isDiscrepancyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSaveDiscrepancy} className="bg-white rounded-xl p-5 max-w-md w-full space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">report_problem</span>
              <h3 className="font-headline-sm text-[16px] text-[#0b1c30]">Reportar Desviación / Retención 5C</h3>
            </div>
            <p className="text-[12px] text-[#3f4850]">
              Indique el motivo por el cual no se administró el medicamento o la inconsistencia detectada a pie de cama:
            </p>
            <textarea
              required
              rows={3}
              value={discrepancyReason}
              onChange={(e) => setDiscrepancyReason(e.target.value)}
              placeholder="Ej: Paciente hipotenso (PA 85/50 mmHg), catéter periférico con flebitis o rechazo del paciente."
              className="w-full p-2.5 bg-[#eff4ff] border border-[#bfc7d2] rounded-lg text-[12px]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDiscrepancyModalOpen(false)}
                className="px-3 py-1.5 rounded text-[12px] text-[#565e74]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#ba1a1a] text-white text-[12px] font-bold"
              >
                Registrar Alerta CDSS
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  // If in mobile device simulation mode, render phone chassis
  if (isMobileDeviceView) {
    return (
      <div className="w-full py-4 flex justify-center items-center">
        <div className="w-[390px] min-h-[780px] bg-[#f8f9ff] rounded-[40px] shadow-2xl border-[10px] border-[#213145] p-3 flex flex-col relative overflow-hidden">
          {/* Phone speaker / notch */}
          <div className="w-32 h-4 bg-[#213145] rounded-full mx-auto mb-2 shrink-0"></div>
          
          {/* In-device Branding Header */}
          <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-[#bfc7d2]/30 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#006194] flex items-center justify-center text-white text-[10px] font-bold">RX</div>
              <div className="flex flex-col">
                <span className="font-bold text-[11px] text-[#006194] leading-tight">Mi Conciliación RX</span>
                <span className="text-[9px] text-[#565e74] leading-none">by Quimera RX • Clínica Santillana</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-[#00694c] bg-[#97f5cc] px-1.5 py-0.5 rounded">v1.0</span>
          </div>

          {content}
          {/* In-device bottom tab bar */}
          <div className="mt-auto border-t border-[#bfc7d2]/40 pt-2 flex justify-around text-[#565e74]">
            <button
              onClick={() => onNavigateTab('verificacion-pie-de-cama-5c')}
              className="flex flex-col items-center text-[#006194] font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">checklist</span>
              <span className="font-label-caps text-[9px] uppercase">Verif. 5C</span>
            </button>
            <button
              onClick={() => onNavigateTab('matriz-de-conciliacion')}
              className="flex flex-col items-center hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[20px]">dataset</span>
              <span className="font-label-caps text-[9px] uppercase">Matriz CDSS</span>
            </button>
            <button
              onClick={() => onNavigateTab('matriz-de-conciliacion')}
              className="flex flex-col items-center hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[20px]">medication</span>
              <span className="font-label-caps text-[9px] uppercase">Órdenes</span>
            </button>
            <button
              onClick={() => onNavigateTab('auditoria-cdss')}
              className="flex flex-col items-center hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <span className="font-label-caps text-[9px] uppercase">Alertas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full px-4 sm:px-6">{content}</div>;
};
