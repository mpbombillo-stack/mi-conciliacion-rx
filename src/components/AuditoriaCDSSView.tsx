import React, { useState } from 'react';
import { AuditEvent } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface AuditoriaCDSSViewProps {
  auditLogs: AuditEvent[];
}

export const AuditoriaCDSSView: React.FC<AuditoriaCDSSViewProps> = ({ auditLogs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.tipo === filterType;
    const matchesSearch =
      log.evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalles.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hashTransaccion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 text-[#0b1c30]">
      {/* Header & Colombian Institutional Standards Banner */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#cce5ff] flex items-center justify-center text-[#006194] shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline-md text-[18px] sm:text-[20px] text-[#0b1c30] font-bold">
                Auditoría CDSS & Trazabilidad HL7 FHIR
              </h1>
              <span className="font-label-caps text-[10px] bg-[#97f5cc] text-[#002115] px-2 py-0.5 rounded font-bold">
                ISO/IEC 27001 • HL7 v2.5 / FHIR R4
              </span>
            </div>
            <p className="font-code-audit text-[11px] text-[#3f4850] mt-0.5">
              Custodia digital inmutable de intervenciones farmacéuticas, sobreescrituras (overrides) y administración 5C
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#bfc7d2]/40 text-right">
            <span className="font-label-caps text-[9px] uppercase text-[#707881]">Nodo de Inferencia</span>
            <div className="font-code-audit text-[11px] text-[#006194] font-bold">RXE-SANTILLANA-CLUSTER-01</div>
          </div>
        </div>
      </div>

      {/* Compliance Metrics Grid (Colombian Health Standards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#bfc7d2]/50 shadow-xs flex flex-col justify-between">
          <span className="font-label-caps text-[10px] text-[#707881] uppercase font-bold">
            Resolución 1403 de 2007 (MinSalud)
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display-lg text-[24px] text-[#00694c] font-bold">100%</span>
            <span className="text-[12px] text-[#3f4850]">Conciliación al Ingreso</span>
          </div>
          <span className="font-code-audit text-[10px] text-[#707881] mt-1">
            Servicio Farmacéutico de Alta Complejidad
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#bfc7d2]/50 shadow-xs flex flex-col justify-between">
          <span className="font-label-caps text-[10px] text-[#707881] uppercase font-bold">
            Meta Internacional ISMP #3
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display-lg text-[24px] text-[#006194] font-bold">0</span>
            <span className="text-[12px] text-[#3f4850]">Errores de Dosificación MAR</span>
          </div>
          <span className="font-code-audit text-[10px] text-[#707881] mt-1">
            Enforcer Semanal de Metotrexato Activo
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#bfc7d2]/50 shadow-xs flex flex-col justify-between">
          <span className="font-label-caps text-[10px] text-[#707881] uppercase font-bold">
            Tasa de Aceptación CDSS
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display-lg text-[24px] text-[#00694c] font-bold">96.4%</span>
            <span className="text-[12px] text-[#3f4850]">Intervenciones Aceptadas</span>
          </div>
          <span className="font-code-audit text-[10px] text-[#707881] mt-1">
            Suspensiones y Sustituciones Médicas
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#bfc7d2]/50 shadow-xs flex flex-col justify-between">
          <span className="font-label-caps text-[10px] text-[#707881] uppercase font-bold">
            Tiempo Promedio al Ingreso
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display-lg text-[24px] text-[#006194] font-bold">14.2</span>
            <span className="text-[12px] text-[#3f4850]">minutos / paciente</span>
          </div>
          <span className="font-code-audit text-[10px] text-[#707881] mt-1">
            Meta institucional: &lt; 30 minutos
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#bfc7d2]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#707881]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario, hash, evento..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#eff4ff] text-[#0b1c30] rounded-lg text-[12px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006194] border border-[#bfc7d2]/40"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap w-full sm:w-auto">
          {[
            { id: 'ALL', label: <span>Todos los Eventos</span> },
            { id: 'CRITICAL_ALERT', label: <span>Alertas Críticas</span> },
            { id: 'OVERRIDE', label: <span>Overrides <ClinicalTooltip code="PIN" position="bottom">PIN</ClinicalTooltip></span> },
            { id: 'RECONCILIATION', label: <span>Conciliación</span> },
            { id: 'BEDSIDE_5C', label: <span>Pie de Cama <ClinicalTooltip code="5C" position="bottom">5C</ClinicalTooltip></span> },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                filterType === f.id
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#3f4850] hover:bg-[#dce9ff]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table / Timeline List */}
      <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#bfc7d2]/50 font-label-caps text-[#3f4850] text-[10px] uppercase">
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-4">Usuario & Rol</th>
                <th className="py-3 px-4">Evento Clínico</th>
                <th className="py-3 px-4">Detalle / Justificación</th>
                <th className="py-3 px-4">Protocolo</th>
                <th className="py-3 px-4 text-right">Hash Criptográfico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc7d2]/30">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#707881] text-[13px]">
                    No se encontraron registros de auditoría que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isCritical = log.tipo === 'CRITICAL_ALERT';
                  const isOverride = log.tipo === 'OVERRIDE';
                  const is5C = log.tipo === 'BEDSIDE_5C';

                  return (
                    <tr key={log.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="py-3 px-4 font-code-audit text-[11px] text-[#3f4850] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-[#0b1c30]">{log.usuario}</div>
                        <div className="text-[10px] text-[#707881]">{log.rol}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-caps text-[9px] font-bold ${
                            isCritical
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : isOverride
                              ? 'bg-[#cce5ff] text-[#001d31]'
                              : is5C
                              ? 'bg-[#97f5cc] text-[#002115]'
                              : 'bg-[#eff4ff] text-[#3f4850]'
                          }`}
                        >
                          {log.evento}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs sm:max-w-md text-[#3f4850]">
                        {log.detalles}
                      </td>
                      <td className="py-3 px-4 font-code-audit text-[11px] text-[#707881] whitespace-nowrap">
                        {log.protocolo}
                      </td>
                      <td className="py-3 px-4 font-code-audit text-[11px] text-[#006194] text-right font-bold whitespace-nowrap">
                        {log.hashTransaccion}
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
