import React from 'react';
import { TabView, UserRole, Patient } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface HeaderProps {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  criticalAlertCount: number;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean) => void;
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatientModal: () => void;
  onLogout: () => void;
  currentUser?: { name: string; role: string; medicalReg?: string; ips?: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  criticalAlertCount,
  currentRole,
  setCurrentRole,
  isMobileDeviceView,
  setIsMobileDeviceView,
  patients,
  activePatient,
  onSelectPatient,
  onOpenNewPatientModal,
  onLogout,
  currentUser,
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'farmaceutico':
        return { name: currentUser?.name || 'Dra. M. Cardona', title: 'Farmacéutica Clínica' };
      case 'medico':
        return { name: 'Dr. F. Morales', title: 'Médico Internista' };
      case 'enfermero':
        return { name: 'Enf. S. Valencia', title: 'Enfermera Asistencial' };
    }
  };

  const roleInfo = getRoleLabel(currentRole);

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-[#bfc7d2] shadow-[0_1px_4px_rgba(11,28,48,0.06)] print:hidden">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setActiveTab('matriz-de-conciliacion')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* High-res vector logo */}
            <svg
              className="h-9 w-9 rounded-lg shadow-sm group-hover:scale-105 transition-transform shrink-0"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="10" fill="#0284C7" />
              <path d="M24 10V38M10 24H38" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="24" cy="24" r="8" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
              <path d="M20 24L23 27L28 21" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="36" cy="12" r="3.5" fill="#EF4444" />
            </svg>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[15px] sm:text-[16px] text-[#006194] tracking-tight">
                  Mi Conciliación RX
                </span>
                <span className="font-semibold text-[12px] text-[#565e74]">
                  by Quimera RX
                </span>
                <span className="hidden md:inline-block font-label-caps text-[9px] px-1.5 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-bold">
                  Version 1.0
                </span>
                <span className="hidden xl:inline-block font-code-audit text-[10px] px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#3f4850]">
                  (<ClinicalTooltip code="HL7" /> <ClinicalTooltip code="FHIR" /> R4)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#00694c] animate-pulse"></span>
                <span className="font-label-caps text-[9px] sm:text-[10px] uppercase text-[#00694c] tracking-wider truncate font-bold">
                  PROD - {currentUser?.ips || 'CENTRO MÉDICO DE ESPECIALISTAS CLÍNICA SANTILLANA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Switcher & New Patient Action */}
        <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-[#f0f4f9] rounded-xl border border-[#bfc7d2]/60">
          <span className="material-symbols-outlined text-[18px] text-[#006194]">patient_list</span>
          <select
            value={activePatient.id}
            onChange={(e) => onSelectPatient(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#0b1c30] outline-none cursor-pointer pr-1"
            title="Seleccionar paciente activo para revisión y conciliación"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.pid} - Cama {p.cama})
              </option>
            ))}
          </select>
          <button
            onClick={onOpenNewPatientModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-[11px] font-bold shadow-sm transition-all"
            title="Ingresar un nuevo paciente al módulo de conciliación"
          >
            <span className="material-symbols-outlined text-[14px]">person_add</span>
            <span>Nuevo Paciente</span>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#f0f4f9] p-1.5 rounded-2xl border border-[#bfc7d2]/70 shadow-inner">
          <button
            onClick={() => setActiveTab('matriz-de-conciliacion')}
            className={`font-body-medium text-[13px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'matriz-de-conciliacion'
                ? 'bg-[#007bb9] text-white font-bold shadow-sm'
                : 'text-[#3f4850] hover:text-[#0b1c30] hover:bg-[#dce9ff]/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">table_chart</span>
            <span>Matriz de Conciliación</span>
          </button>
          <button
            onClick={() => setActiveTab('verificacion-pie-de-cama-5c')}
            className={`font-body-medium text-[13px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'verificacion-pie-de-cama-5c'
                ? 'bg-[#007bb9] text-white font-bold shadow-sm'
                : 'text-[#3f4850] hover:text-[#0b1c30] hover:bg-[#dce9ff]/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">checklist</span>
            <span>Verificación Pie de Cama (<ClinicalTooltip code="5C" position="bottom">5C</ClinicalTooltip>)</span>
          </button>
          <button
            onClick={() => setActiveTab('hoja-de-alta-oms')}
            className={`font-body-medium text-[13px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'hoja-de-alta-oms'
                ? 'bg-[#007bb9] text-white font-bold shadow-sm'
                : 'text-[#3f4850] hover:text-[#0b1c30] hover:bg-[#dce9ff]/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">description</span>
            <span>Hoja de Alta (<ClinicalTooltip code="OMS" position="bottom">OMS</ClinicalTooltip>)</span>
          </button>
          <button
            onClick={() => setActiveTab('auditoria-cdss')}
            className={`font-body-medium text-[13px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'auditoria-cdss'
                ? 'bg-[#007bb9] text-white font-bold shadow-sm'
                : 'text-[#3f4850] hover:text-[#0b1c30] hover:bg-[#dce9ff]/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">verified_user</span>
            <span>Auditoría <ClinicalTooltip code="CDSS" position="bottom">CDSS</ClinicalTooltip></span>
          </button>
          <button
            onClick={() => setActiveTab('configuracion')}
            className={`font-body-medium text-[13px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'configuracion'
                ? 'bg-[#007bb9] text-white font-bold shadow-sm'
                : 'text-[#3f4850] hover:text-[#0b1c30] hover:bg-[#dce9ff]/70'
            }`}
            title="Parámetros Institucionales y CDSS"
          >
            <span className="material-symbols-outlined text-[17px]">settings</span>
            <span>Configuración</span>
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Critical alerts badge */}
          {criticalAlertCount > 0 ? (
            <button
              onClick={() => setActiveTab('matriz-de-conciliacion')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30 animate-pulse hover:bg-[#ffb4ab] transition-colors"
              title="Alertas críticas CDSS que requieren intervención farmacoterapéutica"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">emergency</span>
              <span className="font-label-caps uppercase text-[10px] font-bold">
                {criticalAlertCount} {criticalAlertCount === 1 ? 'Bloqueo Crítico' : 'Bloqueos Críticos'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#97f5cc]/40 text-[#00694c] border border-[#00694c]/20">
              <span className="material-symbols-outlined text-[16px] text-[#00694c]">verified</span>
              <span className="font-label-caps uppercase text-[10px] font-bold">
                <ClinicalTooltip code="CDSS">CDSS</ClinicalTooltip> Conciliado
              </span>
            </div>
          )}

          {/* HL7 connection pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e5eeff] text-[#3f4850] border border-[#bfc7d2]">
            <span className="w-2 h-2 rounded-full bg-[#1e8462]"></span>
            <span className="font-code-audit text-[11px]">
              <ClinicalTooltip code="HL7">HL7</ClinicalTooltip> RXE: En Línea
            </span>
          </div>

          {/* Device toggle for testing 5C mobile view */}
          {activeTab === 'verificacion-pie-de-cama-5c' && (
            <button
              onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#dce9ff] text-[#006194] hover:bg-[#cce5ff] text-[11px] font-semibold transition-colors"
              title="Alternar entre vista de dispositivo móvil o terminal de carro clínico"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMobileDeviceView ? 'desktop_windows' : 'smartphone'}
              </span>
              <span>{isMobileDeviceView ? 'Ver Pantalla Completa' : 'Simular Móvil'}</span>
            </button>
          )}

          {/* User Profile / Role selector */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#bfc7d2]">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-body-bold text-[13px] text-[#0b1c30] leading-tight">
                {roleInfo.name}
              </span>
              <span className="font-label-caps text-[10px] text-[#3f4850] uppercase">
                {roleInfo.title}
              </span>
            </div>

            {/* Quick role toggle popup / button */}
            <div className="relative group">
              <button
                className="w-9 h-9 rounded-full bg-[#006194] flex items-center justify-center text-white shadow-sm hover:ring-2 hover:ring-[#007bb9] transition-all"
                title="Cambiar usuario o rol clínico"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-2 hidden group-hover:block z-50">
                <div className="px-2 py-1 font-label-caps uppercase text-[#707881] border-b border-[#eff4ff]">
                  Cambiar Rol Clínico
                </div>
                <button
                  onClick={() => setCurrentRole('farmaceutico')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[12px] flex items-center justify-between ${
                    currentRole === 'farmaceutico' ? 'bg-[#cce5ff] text-[#001d31] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Dra. M. Cardona</div>
                    <div className="text-[10px] text-[#565e74]">Farmacéutica Clínica (Reg #8492)</div>
                  </div>
                  {currentRole === 'farmaceutico' && (
                    <span className="material-symbols-outlined text-[16px] text-[#006194]">check</span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentRole('medico')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[12px] flex items-center justify-between ${
                    currentRole === 'medico' ? 'bg-[#cce5ff] text-[#001d31] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Dr. F. Morales</div>
                    <div className="text-[10px] text-[#565e74]">Médico Especialista (RM #184920)</div>
                  </div>
                  {currentRole === 'medico' && (
                    <span className="material-symbols-outlined text-[16px] text-[#006194]">check</span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentRole('enfermero')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[12px] flex items-center justify-between ${
                    currentRole === 'enfermero' ? 'bg-[#cce5ff] text-[#001d31] font-bold' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Enf. S. Valencia</div>
                    <div className="text-[10px] text-[#565e74]">Enfermera Bedside (Reg #49201)</div>
                  </div>
                  {currentRole === 'enfermero' && (
                    <span className="material-symbols-outlined text-[16px] text-[#006194]">check</span>
                  )}
                </button>

                <div className="pt-1 mt-1 border-t border-[#eff4ff]">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar on Small Screens */}
      <div className="flex lg:hidden overflow-x-auto bg-[#f0f4f9] border-t border-[#bfc7d2] px-2.5 py-1.5 gap-1.5 items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setActiveTab('matriz-de-conciliacion')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 ${
              activeTab === 'matriz-de-conciliacion'
                ? 'bg-[#007bb9] text-white shadow-xs'
                : 'text-[#3f4850] bg-white border border-[#bfc7d2]/50 hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">table_chart</span>
            <span>Matriz Conciliación</span>
          </button>
          <button
            onClick={() => setActiveTab('verificacion-pie-de-cama-5c')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 ${
              activeTab === 'verificacion-pie-de-cama-5c'
                ? 'bg-[#007bb9] text-white shadow-xs'
                : 'text-[#3f4850] bg-white border border-[#bfc7d2]/50 hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">checklist</span>
            <span>Verif. Pie de Cama (<ClinicalTooltip code="5C" position="bottom">5C</ClinicalTooltip>)</span>
          </button>
          <button
            onClick={() => setActiveTab('hoja-de-alta-oms')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 ${
              activeTab === 'hoja-de-alta-oms'
                ? 'bg-[#007bb9] text-white shadow-xs'
                : 'text-[#3f4850] bg-white border border-[#bfc7d2]/50 hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>Hoja de Alta (<ClinicalTooltip code="OMS" position="bottom">OMS</ClinicalTooltip>)</span>
          </button>
          <button
            onClick={() => setActiveTab('auditoria-cdss')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 ${
              activeTab === 'auditoria-cdss'
                ? 'bg-[#007bb9] text-white shadow-xs'
                : 'text-[#3f4850] bg-white border border-[#bfc7d2]/50 hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span>Auditoría <ClinicalTooltip code="CDSS" position="bottom">CDSS</ClinicalTooltip></span>
          </button>
          <button
            onClick={() => setActiveTab('configuracion')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 ${
              activeTab === 'configuracion'
                ? 'bg-[#007bb9] text-white shadow-xs'
                : 'text-[#3f4850] bg-white border border-[#bfc7d2]/50 hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">settings</span>
            <span>Configuración</span>
          </button>
        </div>

        <button
          onClick={onOpenNewPatientModal}
          className="ml-2 shrink-0 p-1.5 bg-[#006194] text-white rounded-lg"
          title="Nuevo Paciente"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
        </button>
      </div>
    </header>
  );
};
