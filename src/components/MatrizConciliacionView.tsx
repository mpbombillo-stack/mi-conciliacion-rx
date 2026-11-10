import React, { useState } from 'react';
import {
  Patient,
  PreAdmissionMedication,
  InpatientOrder,
  CdssAlert,
  OrderActionType,
} from '../types/clinical';

interface MatrizConciliacionViewProps {
  patient: Patient;
  preAdmissionMeds: PreAdmissionMedication[];
  orders: InpatientOrder[];
  cdssAlerts: CdssAlert[];
  onUpdateOrderAction: (orderId: string, action: OrderActionType, customReason?: string) => void;
  onValidateOverride: (justification: string, pin: string) => void;
  onOpenPharmacokineticsModal: () => void;
  isConsolidated: boolean;
  onOpenConsolidationModal: () => void;
}

export const MatrizConciliacionView: React.FC<MatrizConciliacionViewProps> = ({
  preAdmissionMeds,
  orders,
  cdssAlerts,
  onUpdateOrderAction,
  onValidateOverride,
  onOpenPharmacokineticsModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAtcFilter, setSelectedAtcFilter] = useState<'Todos' | 'ATC-C' | 'ATC-A' | 'ATC-M'>('Todos');
  const [onlyMar, setOnlyMar] = useState(true);

  // CDSS override form state
  const [selectedJustification, setSelectedJustification] = useState('');
  const [overridePin, setOverridePin] = useState('');
  const [overrideMessage, setOverrideMessage] = useState<string | null>(null);

  // Filtered pre-admission medications
  const filteredMeds = preAdmissionMeds.filter((med) => {
    const matchesSearch =
      med.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.atc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.indicacion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAtc = selectedAtcFilter === 'Todos' || med.atcGrupo === selectedAtcFilter;
    const matchesMar = !onlyMar || med.esMAR;

    return matchesSearch && matchesAtc && matchesMar;
  });

  const tripleWhammyAlert = cdssAlerts.find((a) => a.id === 'cdss-alert-1');
  const isTripleWhammyOverridden = tripleWhammyAlert?.estado === 'superado_con_override';
  const isKetorolacoSuspended = orders.find((o) => o.id === 'ord-3')?.accionSeleccionada === 'suspender';

  const handleExecuteOverride = () => {
    if (!selectedJustification) {
      alert('Debe seleccionar una justificación clínica institucional aprobada.');
      return;
    }
    if (!overridePin || overridePin.length < 4) {
      alert('Debe ingresar un PIN de firma digital válido (4 dígitos, ej: 8492).');
      return;
    }

    onValidateOverride(selectedJustification, overridePin);
    setOverrideMessage(
      'Sobreescritura registrada en Bitácora HL7 FHIR (Auditoría ID: AUD-99201). Bloqueo liberado con supervisión de Farmacia Clínica.'
    );
    setTimeout(() => setOverrideMessage(null), 5000);
  };

  return (
    <div className="w-full flex flex-col text-[#0b1c30]">
      {/* 3-Pane Medical Bento Grid */}
      <div className="w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-12">
        {/* ======================================================= */}
        {/* COLUMNA IZQUIERDA: Medicación Pre-Ingreso (30%)         */}
        {/* ======================================================= */}
        <section className="lg:col-span-4 xl:col-span-4 flex flex-col gap-3">
          {/* Header de Columna */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[20px]">inventory_2</span>
                <h2 className="font-semibold text-[15px] text-[#0b1c30]">Medicación Pre-Ingreso</h2>
              </div>
              <span className="font-label-caps text-[10px] bg-[#cce5ff] text-[#001d31] px-2 py-0.5 rounded-full font-bold">
                {preAdmissionMeds.length} Fármacos
              </span>
            </div>
            <p className="font-body-dense text-[12px] text-[#3f4850]">
              Historia clínica electrónica ambulatoria, entrevista a familiar y fitoterapia activa.
            </p>

            {/* Filtros y Búsqueda */}
            <div className="mt-1 flex flex-col gap-2">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#707881]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar principio activo, ATC..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#eff4ff] text-[#0b1c30] rounded-lg font-body-dense text-[12px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006194] shadow-xs placeholder:text-[#707881]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1">
                  {(['Todos', 'ATC-C', 'ATC-A', 'ATC-M'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedAtcFilter(filter)}
                      className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-colors ${
                        selectedAtcFilter === filter
                          ? 'bg-[#006194] text-white shadow-xs'
                          : 'bg-[#e5eeff] text-[#3f4850] hover:bg-[#dce9ff]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyMar}
                    onChange={(e) => setOnlyMar(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-[#ba1a1a] cursor-pointer"
                  />
                  <span className="font-label-caps text-[10px] text-[#ba1a1a] font-bold uppercase">Solo MAR</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lista de Fármacos Pre-Ingreso */}
          <div className="flex flex-col gap-2">
            {filteredMeds.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-dashed border-[#bfc7d2] text-center text-[#707881] text-[12px]">
                No se encontraron fármacos con los filtros aplicados.
              </div>
            ) : (
              filteredMeds.map((med) => {
                const isAutomedicado = med.tipo === 'Automedicado';
                const isEspecialidad = med.tipo === 'Especialidad';
                const isFitoterapia = med.tipo === 'Fitoterapia';

                return (
                  <div
                    key={med.id}
                    className={`bg-white p-3 rounded-xl shadow-xs border border-[#bfc7d2]/40 hover:shadow-md transition-all relative overflow-hidden ${
                      isAutomedicado ? 'bg-[#ffdad6]/10' : isEspecialidad ? 'bg-[#cce5ff]/15' : ''
                    }`}
                  >
                    {/* Color status bar on left */}
                    <div
                      className={`w-1 absolute left-0 top-0 bottom-0 ${
                        isAutomedicado
                          ? 'bg-[#ba1a1a]'
                          : med.esMAR
                          ? 'bg-[#ba1a1a]'
                          : isFitoterapia
                          ? 'bg-[#1e8462]'
                          : 'bg-[#bfc7d2]'
                      }`}
                    ></div>

                    <div className="pl-2 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {med.esMAR && (
                            <span className="px-1.5 py-0.5 bg-[#ffdad6] text-[#93000a] font-label-caps text-[9px] rounded font-bold">
                              MAR
                            </span>
                          )}
                          {isAutomedicado && (
                            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">
                              report_problem
                            </span>
                          )}
                          <span
                            className={`font-body-bold text-[13px] ${
                              isAutomedicado ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                            }`}
                          >
                            {med.nombre}
                          </span>
                        </div>
                        <span
                          className={`font-label-caps text-[10px] px-2 py-0.5 rounded font-semibold ${
                            isAutomedicado
                              ? 'bg-[#ffdad6] text-[#93000a] uppercase font-bold'
                              : isFitoterapia
                              ? 'bg-[#97f5cc] text-[#002115] uppercase font-bold'
                              : 'bg-[#e5eeff] text-[#006194]'
                          }`}
                        >
                          {med.tipo}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#3f4850] font-body-dense text-[12px]">
                        <span className={isEspecialidad ? 'text-[#006194] font-semibold' : ''}>
                          {med.posologia}
                        </span>
                        <span className="font-code-audit text-[10px] text-[#707881]">ATC: {med.atc}</span>
                      </div>

                      {med.alerta && (
                        <div
                          className={`p-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 mt-1 ${
                            isAutomedicado
                              ? 'bg-[#ffdad6]/50 text-[#93000a]'
                              : isFitoterapia
                              ? 'bg-[#e5eeff] text-[#3f4850]'
                              : 'bg-[#ffdad6]/40 text-[#93000a]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px] shrink-0">
                            {isFitoterapia ? 'eco' : 'warning'}
                          </span>
                          <span>{med.alerta}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px] text-[#707881]">
                        <span className="truncate max-w-[210px]">Indicación: {med.indicacion}</span>
                        {med.adherencia && (
                          <span className="text-[#00694c] font-medium">Adherencia: {med.adherencia}</span>
                        )}
                        {med.ultimaToma && (
                          <span className="text-[#565e74]">Última toma: {med.ultimaToma}</span>
                        )}
                        {isEspecialidad && (
                          <span className="font-label-caps text-[#ba1a1a] uppercase font-bold">
                            Omitido en MAR
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ======================================================= */}
        {/* COLUMNA CENTRAL: Órdenes Hospitalarias Activas (42%)    */}
        {/* ======================================================= */}
        <section className="lg:col-span-8 xl:col-span-5 flex flex-col gap-3">
          {/* Cabecera de Órdenes Activas */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#007bb9] text-[20px]">local_hospital</span>
                <h2 className="font-semibold text-[15px] text-[#0b1c30]">Órdenes Hospitalarias Activas</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-md border border-[#bfc7d2]/40">
                <span className="w-2 h-2 rounded-full bg-[#1e8462]"></span>
                <span className="font-code-audit text-[11px] text-[#0b1c30]">HL7 RXE: Sincronizado hace 3 min</span>
              </div>
            </div>

            {/* Banner de Alerta de Omisiones Involuntarias */}
            <div className="p-2.5 bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] shrink-0 mt-0.5">
                notification_important
              </span>
              <div className="flex flex-col text-[12px] leading-tight">
                <span className="font-body-bold text-[#ba1a1a]">Omisiones Involuntarias Detectadas por CDSS</span>
                <span className="text-[#0b1c30] mt-0.5">
                  Atorvastatina 40mg y Metotrexato 15mg no figuran en las órdenes de ingreso del Servicio de Medicina Interna.
                </span>
              </div>
            </div>
          </div>

          {/* Tarjetas de Órdenes con Cuadrante de Decisiones */}
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const isKetorolaco = order.id === 'ord-3';
              const isMetotrexato = order.id === 'ord-4';
              const isLosartan = order.id === 'ord-1';

              return (
                <div
                  key={order.id}
                  className={`bg-white p-4 rounded-xl shadow-xs border transition-all flex flex-col gap-3 relative ${
                    isMetotrexato
                      ? 'border-l-4 border-l-[#006194] border-[#bfc7d2]/50'
                      : isKetorolaco && order.accionSeleccionada !== 'suspender' && !isTripleWhammyOverridden
                      ? 'border-l-4 border-l-[#ba1a1a] border-[#bfc7d2]/50 bg-[#ffdad6]/10'
                      : 'border-[#bfc7d2]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-body-bold text-[13px] ${
                            isKetorolaco && order.accionSeleccionada !== 'suspender'
                              ? 'text-[#ba1a1a]'
                              : isMetotrexato
                              ? 'text-[#006194]'
                              : 'text-[#0b1c30]'
                          }`}
                        >
                          {order.nombre}
                        </span>
                        <span className="font-code-audit text-[11px] text-[#707881]">
                          {order.numeroOrden}
                        </span>
                      </div>
                      <span className="font-body-dense text-[12px] text-[#3f4850] mt-0.5">
                        {order.posologia}
                      </span>

                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {order.etiquetaAlerta && (
                          <span
                            className={`font-label-caps text-[9px] px-2 py-0.5 rounded font-bold ${
                              order.esBloqueoFatal
                                ? 'bg-[#ffdad6] text-[#93000a] animate-pulse'
                                : isMetotrexato
                                ? 'bg-[#cce5ff] text-[#001d31]'
                                : isLosartan
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : 'bg-[#e5eeff] text-[#00694c]'
                            }`}
                          >
                            {order.etiquetaAlerta}
                          </span>
                        )}
                        <span className="font-label-caps text-[9px] bg-[#eff4ff] text-[#3f4850] px-2 py-0.5 rounded">
                          {order.prescriptor}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-label-caps uppercase text-[10px] font-bold ${
                          order.estadoValidacion === 'Validado'
                            ? 'text-[#00694c]'
                            : order.estadoValidacion === 'Concordante'
                            ? 'text-[#00694c]'
                            : order.estadoValidacion === 'Pauta Especial'
                            ? 'text-[#006194]'
                            : 'text-[#ba1a1a]'
                        }`}
                      >
                        {order.estadoValidacion}
                      </span>
                    </div>
                  </div>

                  {/* Selector de Acciones Farmacoterapéuticas */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[#bfc7d2]/30">
                    <button
                      type="button"
                      onClick={() => onUpdateOrderAction(order.id, 'continuar')}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-label-caps flex flex-col items-center gap-1 transition-all ${
                        order.accionSeleccionada === 'continuar'
                          ? 'bg-[#1e8462] text-white shadow-xs font-bold'
                          : 'bg-[#eff4ff] text-[#3f4850] hover:bg-[#dce9ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Continuar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateOrderAction(order.id, 'suspender')}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-label-caps flex flex-col items-center gap-1 transition-all ${
                        order.accionSeleccionada === 'suspender'
                          ? 'bg-[#ba1a1a] text-white shadow-xs font-bold'
                          : 'bg-[#eff4ff] text-[#3f4850] hover:bg-[#dce9ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Suspender</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateOrderAction(order.id, 'modificar')}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-label-caps flex flex-col items-center gap-1 transition-all ${
                        order.accionSeleccionada === 'modificar'
                          ? 'bg-[#006194] text-white shadow-xs font-bold'
                          : 'bg-[#eff4ff] text-[#3f4850] hover:bg-[#dce9ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>Modificar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateOrderAction(order.id, 'sustituir')}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-label-caps flex flex-col items-center gap-1 transition-all ${
                        order.accionSeleccionada === 'sustituir'
                          ? isMetotrexato
                            ? 'bg-[#006194] text-white shadow-xs font-bold'
                            : 'bg-[#565e74] text-white shadow-xs font-bold'
                          : 'bg-[#eff4ff] text-[#3f4850] hover:bg-[#dce9ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                      <span>{isMetotrexato ? 'Pautar Semanal' : 'Sustituir'}</span>
                    </button>
                  </div>

                  {/* Justificación o Motivo Farmacoterapéutico */}
                  {order.motivoAccion && (
                    <div
                      className={`p-2 rounded-lg text-[11px] flex items-center justify-between ${
                        order.accionSeleccionada === 'suspender'
                          ? 'bg-[#ffdad6]/30 text-[#93000a]'
                          : isMetotrexato
                          ? 'bg-[#cce5ff]/40 text-[#004b73]'
                          : 'bg-[#eff4ff] text-[#3f4850]'
                      }`}
                    >
                      <span>{order.motivoAccion}</span>
                      <span className="material-symbols-outlined text-[15px] shrink-0 ml-1">
                        {order.accionSeleccionada === 'suspender'
                          ? 'gavel'
                          : isMetotrexato
                          ? 'event_repeat'
                          : 'verified'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================= */}
        {/* COLUMNA DERECHA: Motor de Reglas CDSS (28%)              */}
        {/* ======================================================= */}
        <section className="lg:col-span-12 xl:col-span-3 flex flex-col gap-3">
          {/* Cabecera de CDSS */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isKetorolacoSuspended || isTripleWhammyOverridden
                    ? 'text-[#00694c]'
                    : 'text-[#ba1a1a] animate-pulse'
                }`}
              >
                {isKetorolacoSuspended || isTripleWhammyOverridden ? 'task_alt' : 'crisis_alert'}
              </span>
              <div className="flex flex-col">
                <h2 className="font-semibold text-[15px] text-[#0b1c30]">Motor de Reglas CDSS</h2>
                <span className="font-code-audit text-[11px] text-[#707881]">Inferencia Semántica v4.2</span>
              </div>
            </div>
            <span
              className={`font-label-caps text-[10px] px-2 py-0.5 rounded font-bold ${
                isKetorolacoSuspended || isTripleWhammyOverridden
                  ? 'bg-[#97f5cc] text-[#002115]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }`}
            >
              {isKetorolacoSuspended || isTripleWhammyOverridden ? 'RESOLVIENDO' : '1 CRÍTICO'}
            </span>
          </div>

          {/* WIDGET 1: CriticalBlockAlert (Triple Whammy) */}
          <div
            className={`bg-white p-4 rounded-xl shadow-md border transition-all flex flex-col gap-3 relative overflow-hidden ${
              isKetorolacoSuspended
                ? 'border-[#00694c]/40 bg-[#97f5cc]/10'
                : isTripleWhammyOverridden
                ? 'border-[#006194]/40 bg-[#cce5ff]/15'
                : 'border-[#ba1a1a]/40 bg-[#ffdad6]/15'
            }`}
          >
            <div className="flex items-start gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isKetorolacoSuspended
                    ? 'bg-[#1e8462] text-white'
                    : isTripleWhammyOverridden
                    ? 'bg-[#006194] text-white'
                    : 'bg-[#ba1a1a] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isKetorolacoSuspended ? 'check_circle' : isTripleWhammyOverridden ? 'lock_open' : 'dangerous'}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-label-caps font-bold uppercase tracking-wider text-[10px] ${
                    isKetorolacoSuspended
                      ? 'text-[#00694c]'
                      : isTripleWhammyOverridden
                      ? 'text-[#006194]'
                      : 'text-[#ba1a1a]'
                  }`}
                >
                  {isKetorolacoSuspended
                    ? 'Bloqueo Resuelto por Suspensión'
                    : isTripleWhammyOverridden
                    ? 'Sobreescritura Aprobada'
                    : 'Bloqueo Farmacológico Crítico'}
                </span>
                <h3
                  className={`font-headline-sm text-[14px] leading-tight mt-0.5 font-bold ${
                    isKetorolacoSuspended ? 'text-[#00694c]' : 'text-[#ba1a1a]'
                  }`}
                >
                  Triple Whammy: Falla Renal Inminente
                </h3>
              </div>
            </div>

            {/* Tríada de Fármacos */}
            <div className="p-2.5 bg-white/80 rounded-lg border border-[#bfc7d2]/40 flex flex-col gap-1 font-code-audit text-[11px] text-[#0b1c30]">
              <div className="flex items-center justify-between">
                <span>[1] SRAA:</span>
                <span className="font-bold">Losartán / Enalapril</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[2] Diurético:</span>
                <span className="font-bold">Furosemida</span>
              </div>
              <div className="flex items-center justify-between text-[#ba1a1a]">
                <span>[3] AINE:</span>
                <span className="font-bold">Ketorolaco / Ibuprofeno</span>
              </div>
            </div>

            {/* Fisiopatología Detallada */}
            <p className="font-body-dense text-[12px] text-[#0b1c30] leading-relaxed">
              <span className="font-body-bold text-[#ba1a1a]">Mecanismo:</span> Bloqueo de prostaglandinas renales
              (AINEs reduce perfusión aferente) + vasodilatación eferente (IECA/ARA) + hipovolemia inducida por
              diurético de asa. Tasa de filtrado basal reducida a <strong>42 mL/min</strong> susceptible a necrosis
              tubular aguda.
            </p>

            {overrideMessage && (
              <div className="p-2 bg-[#97f5cc] text-[#002115] rounded-lg text-[11px] font-medium animate-in fade-in">
                {overrideMessage}
              </div>
            )}

            {/* Override Form Obligatorio */}
            {!isKetorolacoSuspended && !isTripleWhammyOverridden ? (
              <div className="pt-2 flex flex-col gap-2 bg-white/90 p-2.5 rounded-lg border border-[#bfc7d2]/50">
                <span className="font-label-caps text-[#0b1c30] font-bold uppercase text-[10px]">
                  Sobreescritura Clínica Mandatoria
                </span>
                <select
                  value={selectedJustification}
                  onChange={(e) => setSelectedJustification(e.target.value)}
                  className="w-full text-[12px] bg-[#eff4ff] text-[#0b1c30] rounded-md p-1.5 border border-[#bfc7d2]/60 focus:outline-none focus:bg-white"
                >
                  <option value="">Seleccionar Justificación Clínica...</option>
                  <option value="Ketorolaco retirado; control con analgésico menor">
                    Ketorolaco retirado; control con analgésico menor
                  </option>
                  <option value="Monitoreo continuo en UCI / Gasometría horaria">
                    Monitoreo continuo en UCI / Gasometría horaria
                  </option>
                  <option value="Decisión colegiada Médico Tratante - Farmacéutico">
                    Decisión colegiada Médico Tratante - Farmacéutico
                  </option>
                </select>

                <div className="flex gap-1.5">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="PIN Firma"
                    value={overridePin}
                    onChange={(e) => setOverridePin(e.target.value)}
                    className="w-24 text-[12px] font-mono bg-[#eff4ff] text-[#0b1c30] rounded-md px-2 py-1 border border-[#bfc7d2]/60 focus:outline-none placeholder:text-[#707881]"
                  />
                  <button
                    type="button"
                    onClick={handleExecuteOverride}
                    className="flex-1 py-1 px-2 bg-[#ba1a1a] text-white rounded-md font-label-caps text-[10px] font-bold hover:bg-[#93000a] transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    <span>Validar Override</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 bg-[#97f5cc]/40 rounded-lg text-[11px] text-[#00513a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#00694c]">task_alt</span>
                <span>
                  {isKetorolacoSuspended
                    ? 'Ketorolaco suspendido en el centro de órdenes. Se prescribió analgesia segura.'
                    : 'Override validado criptográficamente por Farmacia Clínica.'}
                </span>
              </div>
            )}
          </div>

          {/* WIDGET 2: MethotrexateFrequencyEnforcer */}
          <div className="bg-white p-4 rounded-xl shadow-xs border border-[#bfc7d2]/50 flex flex-col gap-2.5 relative">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#006194] flex items-center justify-center text-white shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[#006194] font-bold uppercase tracking-wider text-[10px]">
                  Protocolo de Seguridad ISMP
                </span>
                <h3 className="font-headline-sm text-[14px] text-[#0b1c30] leading-tight mt-0.5 font-bold">
                  Bloqueo Pauta Diaria: Metotrexato
                </h3>
              </div>
            </div>

            <div className="p-2.5 bg-[#eff4ff] rounded-lg text-[12px] text-[#0b1c30] leading-relaxed">
              Riesgo de <strong>pancitopenia fatal</strong> por confusión de intervalo. En indicaciones no
              oncológicas (Artritis Reumatoide), la administración DEBE ser semanal.
            </div>

            {/* UI Lock Selector Forzado Semanal */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-label-caps text-[10px] text-[#3f4850] uppercase font-semibold">
                Pauta Forzada por Sistema (Semanal)
              </span>
              <div className="grid grid-cols-7 gap-1 text-center font-bold">
                <span className="text-[10px] text-[#707881] py-1 bg-[#eff4ff] rounded">L</span>
                <span className="text-[10px] text-[#707881] py-1 bg-[#eff4ff] rounded">M</span>
                <span className="text-[10px] text-[#707881] py-1 bg-[#eff4ff] rounded">X</span>
                <span className="text-[10px] text-[#707881] py-1 bg-[#eff4ff] rounded">J</span>
                <span
                  className="text-[10px] text-white py-1 bg-[#006194] rounded shadow-xs"
                  title="Toma única semanal: 6 pastillas de 2.5 mg = 15 mg"
                >
                  V
                </span>
                <span className="text-[10px] text-[#707881] py-1 bg-[#eff4ff] rounded">S</span>
                <span
                  className="text-[10px] text-[#002115] py-1 bg-[#97f5cc] rounded font-bold"
                  title="Rescate obligatorio con Ácido Fólico 5 mg (48h después)"
                >
                  D
                </span>
              </div>

              <div className="p-2 bg-[#cce5ff]/30 rounded-lg flex items-center justify-between text-[11px] text-[#004b73] font-medium mt-1">
                <span>Día MTX: Viernes (15 mg)</span>
                <span>Ác. Fólico: Domingo (5 mg)</span>
              </div>
            </div>
          </div>

          {/* WIDGET 3: Interacción Fitoterapia-Anticoagulación */}
          <div className="bg-white p-4 rounded-xl shadow-xs border border-[#bfc7d2]/50 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00694c] text-[20px]">psychiatry</span>
              <h3 className="font-body-bold text-[13px] text-[#0b1c30]">Fitoterapia: Ginkgo Biloba</h3>
            </div>
            <p className="font-body-dense text-[12px] text-[#3f4850]">
              Inhibición del factor activador de plaquetas (PAF). Si se introduce profilaxis de tromboembolismo
              venoso (HBPM/Enoxaparina), suspender fitoterapia 48h antes por riesgo de sangrado mayor.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-[#bfc7d2]/30 text-[#3f4850] font-label-caps text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e8462]"></span> Monitorización MAR
              </span>
              <button
                type="button"
                onClick={onOpenPharmacokineticsModal}
                className="text-[#006194] font-bold hover:underline"
              >
                Ver Farmacocinética
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
