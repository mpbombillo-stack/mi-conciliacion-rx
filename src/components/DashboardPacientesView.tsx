import React, { useState, useMemo } from 'react';
import { Patient, TabView } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface DashboardPacientesProps {
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onNavigateToTab: (tab: TabView, patientId?: string) => void;
  onOpenNewPatientModal: () => void;
}

export const DashboardPacientesView: React.FC<DashboardPacientesProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onNavigateToTab,
  onOpenNewPatientModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServicio, setFilterServicio] = useState<string>('todos');
  const [filterConciliacion, setFilterConciliacion] = useState<string>('todos');
  const [filterDiscrepancia, setFilterDiscrepancia] = useState<string>('todos');

  // Stats calculation
  const stats = useMemo(() => {
    const total = patients.length;
    const conciliados = patients.filter((p) => p.estadoConciliacion === 'conciliado').length;
    const enProgreso = patients.filter((p) => p.estadoConciliacion === 'en_progreso').length;
    const bloqueados = patients.filter((p) => p.estadoConciliacion === 'bloqueado').length;
    const pendientes = patients.filter((p) => p.estadoConciliacion === 'pendiente' || !p.estadoConciliacion).length;
    const criticos = patients.filter((p) => p.nivelDiscrepancias === 'critica' || p.estadoClinico === 'critico').length;
    const pctConciliados = total > 0 ? Math.round((conciliados / total) * 100) : 0;

    return { total, conciliados, enProgreso, bloqueados, pendientes, criticos, pctConciliados };
  }, [patients]);

  // Unique services
  const servicios = useMemo(() => {
    const set = new Set<string>();
    patients.forEach((p) => {
      if (p.servicio) set.add(p.servicio);
    });
    return Array.from(set);
  }, [patients]);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosticos.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchServicio = filterServicio === 'todos' || p.servicio === filterServicio;
      const matchConciliacion = filterConciliacion === 'todos' || p.estadoConciliacion === filterConciliacion;
      const matchDiscrepancia = filterDiscrepancia === 'todos' || p.nivelDiscrepancias === filterDiscrepancia;

      return matchSearch && matchServicio && matchConciliacion && matchDiscrepancia;
    });
  }, [patients, searchTerm, filterServicio, filterConciliacion, filterDiscrepancia]);

  const renderBadgeEstadoConciliacion = (estado?: string) => {
    switch (estado) {
      case 'conciliado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#97f5cc]/40 text-[#00694c] border border-[#00694c]/20">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Conciliado</span>
          </span>
        );
      case 'en_progreso':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#cce5ff] text-[#006194] border border-[#006194]/20">
            <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
            <span>En Progreso</span>
          </span>
        );
      case 'bloqueado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30 animate-pulse">
            <span className="material-symbols-outlined text-[14px]">dangerous</span>
            <span>Bloqueo Crítico</span>
          </span>
        );
      case 'pendiente':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fff8e1] text-[#705d00] border border-[#705d00]/20">
            <span className="material-symbols-outlined text-[14px]">pending</span>
            <span>Pendiente</span>
          </span>
        );
    }
  };

  const renderBadgeNivelDiscrepancia = (nivel?: string, counts?: Patient['discrepanciasCount']) => {
    switch (nivel) {
      case 'critica':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30">
            <span className="material-symbols-outlined text-[15px]">priority_high</span>
            <span>Severa / Crítica {counts?.criticas ? `(${counts.criticas})` : ''}</span>
          </span>
        );
      case 'moderada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ffe0b2] text-[#b26a00] border border-[#b26a00]/30">
            <span className="material-symbols-outlined text-[15px]">warning</span>
            <span>Moderada ({counts?.total || 2})</span>
          </span>
        );
      case 'leve':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#e0f2fe] text-[#0284c7] border border-[#0284c7]/20">
            <span className="material-symbols-outlined text-[15px]">info</span>
            <span>Leve ({counts?.total || 1})</span>
          </span>
        );
      case 'ninguna':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#d1fae5] text-[#047857] border border-[#047857]/20">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>0 Discrepancias</span>
          </span>
        );
    }
  };

  const renderBadgeEstadoClinico = (estado?: string) => {
    switch (estado) {
      case 'critico':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#fee2e2] text-[#991b1b]">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping" />
            <span>Crítico / Vigilancia Estricta</span>
          </span>
        );
      case 'cuidado_intermedio':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#ffedd5] text-[#9a3412]">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
            <span>Cuidado Intermedio</span>
          </span>
        );
      case 'alta_pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#e0e7ff] text-[#3730a3]">
            <span className="material-symbols-outlined text-[13px]">exit_to_app</span>
            <span>Alta Pendiente OMS</span>
          </span>
        );
      case 'estable':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#f1f5f9] text-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Estable en Sala</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-in fade-in">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#bfc7d2]/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#006194] to-[#0284c7] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[28px]">dashboard</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0b1c30]">Dashboard de Pacientes y Conciliación</h1>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-bold">
                PROA & CDSS R4
              </span>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              Supervisión en tiempo real de pacientes hospitalizados, nivel de discrepancias farmacoterapéuticas y estado de validación.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewPatientModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Patients */}
        <div className="bg-white p-4 rounded-xl border border-[#bfc7d2]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#565e74] uppercase">Total Pacientes</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">groups</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0b1c30]">{stats.total}</span>
            <span className="text-[11px] text-[#565e74]">en censo activo</span>
          </div>
        </div>

        {/* Conciliados */}
        <div className="bg-white p-4 rounded-xl border border-[#00694c]/20 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-[#97f5cc]/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00694c] uppercase">Conciliados (100%)</span>
            <span className="material-symbols-outlined text-[#00694c] text-[20px]">task_alt</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#00694c]">{stats.conciliados}</span>
            <span className="text-xs font-bold text-[#00694c]">({stats.pctConciliados}%)</span>
          </div>
        </div>

        {/* En Progreso */}
        <div className="bg-white p-4 rounded-xl border border-[#006194]/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#006194] uppercase">En Conciliación</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">pending_actions</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#006194]">{stats.enProgreso}</span>
            <span className="text-[11px] text-[#565e74]">por farmacéutico</span>
          </div>
        </div>

        {/* Bloqueos Críticos CDSS */}
        <div className="bg-white p-4 rounded-xl border border-[#ba1a1a]/30 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-[#ffdad6]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#ba1a1a] uppercase">Bloqueos CDSS</span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">emergency</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#ba1a1a]">{stats.bloqueados}</span>
            <span className="text-[11px] font-bold text-[#ba1a1a]">Acción urgente</span>
          </div>
        </div>

        {/* Pendientes de Conciliar */}
        <div className="bg-white p-4 rounded-xl border border-[#bfc7d2]/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#705d00] uppercase">Pendientes</span>
            <span className="material-symbols-outlined text-[#705d00] text-[20px]">hourglass_empty</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#705d00]">{stats.pendientes}</span>
            <span className="text-[11px] text-[#565e74]">ingresos nuevos</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#bfc7d2]/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#565e74]">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, PID, cama o diagnóstico..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f4f9] text-[#0b1c30] rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] border border-transparent transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {/* Servicio Filter */}
          <div className="flex items-center gap-1.5 bg-[#f0f4f9] px-2.5 py-1.5 rounded-xl border border-[#bfc7d2]/40 text-xs">
            <span className="text-[#565e74] font-bold">Servicio:</span>
            <select
              value={filterServicio}
              onChange={(e) => setFilterServicio(e.target.value)}
              className="bg-transparent font-semibold text-[#0b1c30] outline-none cursor-pointer"
            >
              <option value="todos">Todos ({patients.length})</option>
              {servicios.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Estado Conciliación */}
          <div className="flex items-center gap-1.5 bg-[#f0f4f9] px-2.5 py-1.5 rounded-xl border border-[#bfc7d2]/40 text-xs">
            <span className="text-[#565e74] font-bold">Conciliación:</span>
            <select
              value={filterConciliacion}
              onChange={(e) => setFilterConciliacion(e.target.value)}
              className="bg-transparent font-semibold text-[#0b1c30] outline-none cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              <option value="conciliado">Conciliado</option>
              <option value="en_progreso">En Progreso</option>
              <option value="bloqueado">Bloqueo Crítico</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          {/* Discrepancia Filter */}
          <div className="flex items-center gap-1.5 bg-[#f0f4f9] px-2.5 py-1.5 rounded-xl border border-[#bfc7d2]/40 text-xs">
            <span className="text-[#565e74] font-bold">Discrepancias:</span>
            <select
              value={filterDiscrepancia}
              onChange={(e) => setFilterDiscrepancia(e.target.value)}
              className="bg-transparent font-semibold text-[#0b1c30] outline-none cursor-pointer"
            >
              <option value="todos">Cualquier nivel</option>
              <option value="critica">Crítica / Fatal</option>
              <option value="moderada">Moderada</option>
              <option value="leve">Leve</option>
              <option value="ninguna">Sin Discrepancias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table / Cards List */}
      <div className="bg-white rounded-2xl border border-[#bfc7d2]/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f4f9] border-b border-[#bfc7d2]/60 text-[11px] font-extrabold uppercase text-[#565e74] tracking-wider">
                <th className="py-3 px-4">Paciente & Identificación</th>
                <th className="py-3 px-3">Ubicación & Cama</th>
                <th className="py-3 px-3">Estado del Paciente</th>
                <th className="py-3 px-3">Función Renal & ASC</th>
                <th className="py-3 px-3">Nivel de Discrepancias</th>
                <th className="py-3 px-3">Estado Conciliación</th>
                <th className="py-3 px-4 text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc7d2]/40 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#565e74]">
                    <span className="material-symbols-outlined text-[36px] text-[#bfc7d2] block mb-1">
                      person_search
                    </span>
                    No se encontraron pacientes con los criterios de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => {
                  const isActive = pat.id === activePatientId;
                  return (
                    <tr
                      key={pat.id}
                      className={`hover:bg-[#f8faff] transition-colors ${
                        isActive ? 'bg-[#e5f1fb]/50 font-medium' : ''
                      }`}
                    >
                      {/* Paciente y PID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isActive
                                ? 'bg-[#006194] text-white shadow-sm'
                                : 'bg-[#e0e7ff] text-[#3730a3]'
                            }`}
                          >
                            {pat.sexo === 'M' ? 'M' : 'F'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0b1c30] text-sm hover:text-[#006194] transition-colors cursor-pointer" onClick={() => onSelectPatient(pat.id)}>
                                {pat.nombre}
                              </span>
                              {isActive && (
                                <span className="px-1.5 py-0.2 rounded bg-[#006194] text-white text-[9px] font-bold">
                                  ACTUAL
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#565e74] mt-0.5">
                              <span><ClinicalTooltip code="PID">PID</ClinicalTooltip> {pat.pid}</span>
                              <span>•</span>
                              <span>{pat.edad} años</span>
                              {pat.alergias.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#ba1a1a] font-bold flex items-center gap-0.5" title={pat.alergias.map(a => a.sustancia).join(', ')}>
                                    <span className="material-symbols-outlined text-[12px]">warning</span>
                                    {pat.alergias.length} alergia(s)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ubicación y Cama */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0b1c30]">{pat.servicio}</div>
                        <div className="text-[11px] text-[#565e74] flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px] text-[#006194]">bed</span>
                          <span className="font-semibold text-[#006194]">Cama {pat.cama}</span>
                        </div>
                      </td>

                      {/* Estado del Paciente */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {renderBadgeEstadoClinico(pat.estadoClinico)}
                          <div className="text-[10px] text-[#565e74] truncate max-w-[180px]" title={pat.diagnosticos.join(' • ')}>
                            {pat.diagnosticos[0] || 'Sin diagnóstico principal'}
                          </div>
                        </div>
                      </td>

                      {/* Función Renal & Métricas */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#0b1c30]">
                              <ClinicalTooltip code="ClCr">ClCr</ClinicalTooltip>: {pat.clCr} mL/min
                            </span>
                            {pat.clCr < 50 && (
                              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" title="Ajuste de dosis requerido por falla renal" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#565e74]">
                            <ClinicalTooltip code="ASC">ASC</ClinicalTooltip>: {pat.bsaDuBois} m² • {pat.pesoKg} kg
                          </div>
                        </div>
                      </td>

                      {/* Nivel de Discrepancias */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {renderBadgeNivelDiscrepancia(pat.nivelDiscrepancias, pat.discrepanciasCount)}
                          {pat.discrepanciasCount && pat.discrepanciasCount.total > 0 && (
                            <div className="text-[10px] text-[#565e74] flex items-center gap-1.5">
                              {pat.discrepanciasCount.omisiones > 0 && (
                                <span>{pat.discrepanciasCount.omisiones} omisión</span>
                              )}
                              {pat.discrepanciasCount.duplicidades > 0 && (
                                <span>• {pat.discrepanciasCount.duplicidades} dupl.</span>
                              )}
                              {pat.discrepanciasCount.interacciones > 0 && (
                                <span>• {pat.discrepanciasCount.interacciones} interac.</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Estado Conciliación */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {renderBadgeEstadoConciliacion(pat.estadoConciliacion)}
                          {pat.ultimaActualizacion && (
                            <div className="text-[10px] text-[#565e74]">
                              Act: {pat.ultimaActualizacion}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              onSelectPatient(pat.id);
                              onNavigateToTab('matriz-de-conciliacion', pat.id);
                            }}
                            className="p-1.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                            title="Abrir Matriz de Conciliación Farmacéutica para este paciente"
                          >
                            <span className="material-symbols-outlined text-[16px]">table_chart</span>
                            <span className="hidden sm:inline">Conciliar</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPatient(pat.id);
                              onNavigateToTab('hoja-de-alta-oms', pat.id);
                            }}
                            className="p-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] border border-[#006194]/30 text-xs font-semibold transition-all"
                            title="Ver o generar Hoja de Alta OMS"
                          >
                            <span className="material-symbols-outlined text-[16px]">description</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPatient(pat.id);
                              onNavigateToTab('verificacion-pie-de-cama-5c', pat.id);
                            }}
                            className="p-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] border border-[#006194]/30 text-xs font-semibold transition-all"
                            title="Verificación Pie de Cama 5C"
                          >
                            <span className="material-symbols-outlined text-[16px]">checklist</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
