import React, { useState, useEffect } from 'react';
import { UserRole, ClinicalUnit, Specialty, Room } from '../types/clinical';
import ClinicalTooltip from './ClinicalTooltip';

interface SystemConfig {
  institutionName: string;
  nit: string;
  sede: string;
  clusterNode: string;
  hl7Endpoint: string;
  fhirEndpoint: string;
  invimaCatalogSync: boolean;
  cdssStrictLevel: 'estricto' | 'intermedio' | 'flexible';
  requirePinForOverride: boolean;
  defaultAdminPin: string;
  allow5cBarcodeScan: boolean;
  enableRfidVerification: boolean;
  autoLogAuditTrails: boolean;
  notificarAlergiasCrossmatch: boolean;
  diasVigenciaConciliacion: number;
}

const DEFAULT_UNITS: ClinicalUnit[] = [
  {
    id: 1,
    name: 'Medicina Interna',
    code: 'MED-INT',
    rooms: [
      { id: 101, name: '412-A', type: 'Shared' },
      { id: 102, name: '412-B', type: 'Shared' },
      { id: 103, name: '414', type: 'Individual' },
      { id: 104, name: '415', type: 'Individual' },
    ],
  },
  {
    id: 2,
    name: 'UCI Adultos',
    code: 'UCI-ADU',
    rooms: [
      { id: 201, name: 'BOX-01', type: 'Individual' },
      { id: 202, name: 'BOX-02', type: 'Individual' },
      { id: 203, name: 'BOX-03', type: 'Individual' },
    ],
  },
  {
    id: 3,
    name: 'Cardiología',
    code: 'CARDIO',
    rooms: [
      { id: 301, name: '301', type: 'Individual' },
      { id: 302, name: '302', type: 'Individual' },
    ],
  },
  {
    id: 4,
    name: 'Cirugía General',
    code: 'CX-GEN',
    rooms: [
      { id: 401, name: '501-A', type: 'Shared' },
      { id: 402, name: '501-B', type: 'Shared' },
    ],
  },
  {
    id: 5,
    name: 'Urgencias y Observación',
    code: 'URG',
    rooms: [
      { id: 501, name: 'OBS-01', type: 'Shared' },
      { id: 502, name: 'OBS-02', type: 'Shared' },
      { id: 503, name: 'REANIMACION', type: 'Individual' },
    ],
  },
];

const DEFAULT_SPECIALTIES: Specialty[] = [
  { id: 1, name: 'Farmacia Clínica / Conciliación', type: 'Medical' },
  { id: 2, name: 'Medicina Interna', type: 'Medical' },
  { id: 3, name: 'Infectología & PROA', type: 'Medical' },
  { id: 4, name: 'Cardiología Clínica', type: 'Medical' },
  { id: 5, name: 'Cirugía General', type: 'Surgical' },
  { id: 6, name: 'Medicina Crítica y Cuidado Intensivo', type: 'Medical' },
  { id: 7, name: 'Ortopedia y Traumatología', type: 'Surgical' },
];

const DEFAULT_CONFIG: SystemConfig = {
  institutionName: 'Centro Médico de Especialistas Clínica Santillana',
  nit: '900.245.819-3',
  sede: 'Sede Principal - Manizales, Caldas',
  clusterNode: 'RXE-SANTILLANA-CLUSTER-01',
  hl7Endpoint: 'mllp://hl7.santillana.salud:2575',
  fhirEndpoint: 'https://fhir.santillana.salud/r4',
  invimaCatalogSync: true,
  cdssStrictLevel: 'estricto',
  requirePinForOverride: true,
  defaultAdminPin: '1234',
  allow5cBarcodeScan: true,
  enableRfidVerification: true,
  autoLogAuditTrails: true,
  notificarAlergiasCrossmatch: true,
  diasVigenciaConciliacion: 30,
};

interface ConfiguracionViewProps {
  currentRole: UserRole;
  currentUser?: { name: string; role: string; medicalReg?: string; ips?: string; email?: string } | null;
  onUpdateIpsName?: (name: string) => void;
}

export const ConfiguracionView: React.FC<ConfiguracionViewProps> = ({
  currentRole,
  currentUser,
  onUpdateIpsName,
}) => {
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('miconciliacion_system_config');
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [activeSubTab, setActiveSubTab] = useState<
    'general' | 'servicios-camas' | 'cdss' | 'interoperabilidad' | 'seguridad'
  >('general');

  // Units and Rooms (Servicios y Habitaciones - Arquitectura PROA RX)
  const [units, setUnits] = useState<ClinicalUnit[]>(() => {
    const saved = localStorage.getItem('proa_units');
    return saved ? JSON.parse(saved) : DEFAULT_UNITS;
  });

  const [specialties, setSpecialties] = useState<Specialty[]>(() => {
    const saved = localStorage.getItem('proa_specialties');
    return saved ? JSON.parse(saved) : DEFAULT_SPECIALTIES;
  });

  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(() => {
    return DEFAULT_UNITS[0]?.id || null;
  });

  // Local Form states for Units & Rooms
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitCode, setNewUnitCode] = useState('');
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'Individual' | 'Shared'>('Shared');
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  // Local Form states for Specialties
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecType, setNewSpecType] = useState<'Medical' | 'Surgical'>('Medical');
  const [editingSpecId, setEditingSpecId] = useState<number | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('proa_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('proa_specialties', JSON.stringify(specialties));
  }, [specialties]);

  // Handlers for Units
  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim() || !newUnitCode.trim()) return;

    if (editingUnitId) {
      setUnits(
        units.map((u) =>
          u.id === editingUnitId
            ? { ...u, name: newUnitName.trim(), code: newUnitCode.trim().toUpperCase() }
            : u
        )
      );
      setEditingUnitId(null);
    } else {
      const createdUnit: ClinicalUnit = {
        id: Date.now(),
        name: newUnitName.trim(),
        code: newUnitCode.trim().toUpperCase(),
        rooms: [],
      };
      setUnits([...units, createdUnit]);
      setSelectedUnitId(createdUnit.id);
    }
    setNewUnitName('');
    setNewUnitCode('');
  };

  const handleStartEditUnit = (unit: ClinicalUnit) => {
    setEditingUnitId(unit.id);
    setNewUnitName(unit.name);
    setNewUnitCode(unit.code);
    setSelectedUnitId(unit.id);
  };

  const handleDeleteUnit = (id: number) => {
    if (window.confirm('¿Eliminar servicio clínico y todas sus habitaciones asociadas?')) {
      setUnits(units.filter((u) => u.id !== id));
      if (selectedUnitId === id) setSelectedUnitId(null);
    }
  };

  // Handlers for Rooms
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !newRoomName.trim()) return;

    if (editingRoomId) {
      setUnits(
        units.map((u) => {
          if (u.id === selectedUnitId) {
            return {
              ...u,
              rooms: u.rooms.map((r) =>
                r.id === editingRoomId
                  ? { ...r, name: newRoomName.trim(), type: newRoomType }
                  : r
              ),
            };
          }
          return u;
        })
      );
      setEditingRoomId(null);
    } else {
      setUnits(
        units.map((u) => {
          if (u.id === selectedUnitId) {
            return {
              ...u,
              rooms: [
                ...u.rooms,
                { id: Date.now(), name: newRoomName.trim(), type: newRoomType },
              ],
            };
          }
          return u;
        })
      );
    }
    setNewRoomName('');
  };

  const handleStartEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setNewRoomName(room.name);
    setNewRoomType(room.type);
  };

  const handleDeleteRoom = (unitId: number, roomId: number) => {
    setUnits(
      units.map((u) => {
        if (u.id === unitId) {
          return { ...u, rooms: u.rooms.filter((r) => r.id !== roomId) };
        }
        return u;
      })
    );
  };

  // Handlers for Specialties
  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;

    if (editingSpecId) {
      setSpecialties(
        specialties.map((s) =>
          s.id === editingSpecId ? { ...s, name: newSpecName.trim(), type: newSpecType } : s
        )
      );
      setEditingSpecId(null);
    } else {
      setSpecialties([
        ...specialties,
        { id: Date.now(), name: newSpecName.trim(), type: newSpecType },
      ]);
    }
    setNewSpecName('');
  };

  const handleDeleteSpecialty = (id: number) => {
    if (window.confirm('¿Eliminar esta especialidad clínica?')) {
      setSpecialties(specialties.filter((s) => s.id !== id));
    }
  };
  const isSuperUser =
    currentRole === 'farmaceutico' ||
    currentUser?.name?.includes('Mauricio') ||
    currentUser?.email === 'mausugu' ||
    currentUser?.email === 'mauriciosuazag@hotmail.com';

  useEffect(() => {
    localStorage.setItem('miconciliacion_system_config', JSON.stringify(config));
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('miconciliacion_system_config', JSON.stringify(config));
    if (onUpdateIpsName) {
      onUpdateIpsName(config.institutionName);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('¿Desea restaurar todos los parámetros de configuración institucional por defecto?')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('miconciliacion_system_config', JSON.stringify(DEFAULT_CONFIG));
      if (onUpdateIpsName) {
        onUpdateIpsName(DEFAULT_CONFIG.institutionName);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#bfc7d2] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[26px]">tune</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0b1c30]">Parámetros y Configuración del Sistema</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#cce5ff] text-[#001d31]">
                Módulo Superusuario
              </span>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              Gestión de nodos interoperables HL7 FHIR, umbrales de alerta clínica CDSS y directrices institucionales
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6]/40 hover:bg-[#ffdad6] rounded-xl border border-[#ba1a1a]/30 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Restablecer</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-[#006194] hover:bg-[#007bb9] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Guardar Parámetros</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-[#97f5cc]/30 border border-[#00694c]/40 text-[#00694c] p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Parámetros de configuración actualizados y persistidos en nodo local exitosamente.</span>
        </div>
      )}

      {/* Sub tabs navigation */}
      <div className="flex items-center gap-2 border-b border-[#bfc7d2]/70 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'general'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'text-[#565e74] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
          <span>Institución & Sede</span>
        </button>

        <button
          onClick={() => setActiveSubTab('servicios-camas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'servicios-camas'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'text-[#565e74] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">meeting_room</span>
          <span>Servicios y Habitaciones</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cdss')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'cdss'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'text-[#565e74] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
          <span>Motor CDSS & Seguridad</span>
        </button>

        <button
          onClick={() => setActiveSubTab('interoperabilidad')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'interoperabilidad'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'text-[#565e74] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">hub</span>
          <span>Interoperabilidad HL7 / FHIR</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seguridad')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'seguridad'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'text-[#565e74] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">encrypted</span>
          <span>Firma Digital & Overrides</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SUBTAB 1: GENERAL */}
        {activeSubTab === 'general' && (
          <div className="bg-white border border-[#bfc7d2] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#006194] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">apartment</span>
              Datos de la Institución Prestadora de Salud (IPS)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  Razón Social / Nombre IPS
                </label>
                <input
                  type="text"
                  value={config.institutionName}
                  onChange={(e) => setConfig({ ...config, institutionName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  NIT Institucional
                </label>
                <input
                  type="text"
                  value={config.nit}
                  onChange={(e) => setConfig({ ...config, nit: e.target.value })}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  Sede y Ciudad
                </label>
                <input
                  type="text"
                  value={config.sede}
                  onChange={(e) => setConfig({ ...config, sede: e.target.value })}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  Identificador de Cluster Local
                </label>
                <input
                  type="text"
                  value={config.clusterNode}
                  onChange={(e) => setConfig({ ...config, clusterNode: e.target.value })}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#bfc7d2]/40">
              <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                Vigencia Máxima de la Conciliación Pre-Admisión (Días)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={config.diasVigenciaConciliacion}
                  onChange={(e) => setConfig({ ...config, diasVigenciaConciliacion: Number(e.target.value) })}
                  className="w-32 h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                />
                <span className="text-xs text-[#565e74]">
                  Días tras los cuales se exige reconciliación por nueva consulta externa o reingreso.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: SERVICIOS Y HABITACIONES (PROA RX SUITE ARCHITECTURE) */}
        {activeSubTab === 'servicios-camas' && (
          <div className="space-y-6">
            {/* Units & Rooms Panel */}
            <div className="bg-white border border-[#bfc7d2] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#bfc7d2]/50">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#006194] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">domain</span>
                    Servicios Clínicos y Habitaciones / Camas
                  </h3>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    Estructura asistencial sincronizada para la asignación de pacientes en conciliación y bedside 5C
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#cce5ff] text-[#001d31] font-bold text-xs rounded-lg">
                  {units.reduce((acc, u) => acc + u.rooms.length, 0)} Camas en {units.length} Servicios
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left col: Add/List Units */}
                <div className="lg:col-span-5 border-r lg:border-[#bfc7d2]/60 pr-0 lg:pr-6 space-y-4">
                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#bfc7d2]/50">
                    <h4 className="text-xs font-black uppercase text-[#0b1c30] mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#006194]">
                        {editingUnitId ? 'edit_note' : 'add_circle'}
                      </span>
                      <span>{editingUnitId ? 'Editar Servicio' : 'Nuevo Servicio Clínico'}</span>
                    </h4>
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        placeholder="Nombre (ej. UCI Adultos, Medicina Interna)"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}
                        className="w-full h-9 px-3 bg-white border border-[#bfc7d2] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Cód (ej. UCI-ADU)"
                          value={newUnitCode}
                          onChange={(e) => setNewUnitCode(e.target.value)}
                          className="w-full h-9 px-3 bg-white border border-[#bfc7d2] rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#006194] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddUnit}
                          className={`h-9 px-4 ${
                            editingUnitId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#006194] hover:bg-[#007bb9]'
                          } text-white font-bold text-xs rounded-lg flex items-center justify-center transition-all shadow-sm`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {editingUnitId ? 'check' : 'add'}
                          </span>
                        </button>
                        {editingUnitId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUnitId(null);
                              setNewUnitName('');
                              setNewUnitCode('');
                            }}
                            className="h-9 px-3 bg-slate-200 text-slate-700 rounded-lg text-xs hover:bg-slate-300 font-bold"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Units List */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {units.map((unit) => {
                      const isSelected = selectedUnitId === unit.id;
                      return (
                        <div
                          key={unit.id}
                          onClick={() => setSelectedUnitId(unit.id)}
                          className={`p-3 rounded-xl cursor-pointer border transition-all ${
                            isSelected
                              ? 'bg-[#dce9ff] border-[#006194] shadow-sm ring-1 ring-[#006194]'
                              : 'bg-white border-[#bfc7d2]/70 hover:bg-[#eff4ff]'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-xs text-[#0b1c30]">{unit.name}</p>
                              <span className="text-[10px] bg-white border border-[#bfc7d2] text-[#006194] px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block">
                                {unit.code}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEditUnit(unit);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#565e74] hover:bg-white transition-colors"
                                title="Editar Servicio"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUnit(unit.id);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                                title="Eliminar Servicio"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </div>
                          <div className="text-[11px] text-[#565e74] mt-2 flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[14px] text-[#006194]">bed</span>
                            <span>{unit.rooms.length} Habitaciones / Camas</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right col: Rooms & Beds Management */}
                <div className="lg:col-span-7 space-y-4">
                  {selectedUnitId ? (
                    <div>
                      <div className="flex items-center justify-between mb-3 bg-[#f0f4f9] p-3 rounded-xl border border-[#bfc7d2]/50">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006194] text-[20px]">meeting_room</span>
                          <span className="text-xs font-bold text-[#0b1c30]">
                            Habitaciones asignadas a:{' '}
                            <span className="text-[#006194] font-black">
                              {units.find((u) => u.id === selectedUnitId)?.name}
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#565e74]">
                          {units.find((u) => u.id === selectedUnitId)?.rooms.length} registradas
                        </span>
                      </div>

                      {/* Add Room Bar */}
                      <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#bfc7d2]/50 mb-4 flex flex-wrap gap-2 items-center">
                        <input
                          type="text"
                          placeholder="N° Cama / Hab (ej. 412-B)"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          className="h-9 px-3 bg-white border border-[#bfc7d2] rounded-lg text-xs font-bold text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#006194] grow"
                        />
                        <select
                          value={newRoomType}
                          onChange={(e) => setNewRoomType(e.target.value as any)}
                          className="h-9 px-2 bg-white border border-[#bfc7d2] rounded-lg text-xs font-semibold text-[#0b1c30] outline-none"
                        >
                          <option value="Shared">Compartida (Bipersonal)</option>
                          <option value="Individual">Individual (Aislamiento)</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAddRoom}
                          disabled={!newRoomName.trim()}
                          className={`h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                            editingRoomId
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-[#006194] hover:bg-[#007bb9] text-white disabled:opacity-40'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {editingRoomId ? 'save' : 'add'}
                          </span>
                          <span>{editingRoomId ? 'Guardar' : 'Agregar Cama'}</span>
                        </button>
                        {editingRoomId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRoomId(null);
                              setNewRoomName('');
                            }}
                            className="h-9 px-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>

                      {/* Rooms Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto p-1">
                        {units
                          .find((u) => u.id === selectedUnitId)
                          ?.rooms.map((room) => (
                            <div
                              key={room.id}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center relative group transition-all ${
                                editingRoomId === room.id
                                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400'
                                  : 'bg-white border-[#bfc7d2]/70 hover:border-[#006194] shadow-xs'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[#006194] text-[20px] mb-1">
                                single_bed
                              </span>
                              <span className="font-bold text-xs text-[#0b1c30]">{room.name}</span>
                              <span className="text-[9px] text-[#565e74] font-medium mt-0.5">
                                {room.type === 'Individual' ? 'Individual' : 'Compartida'}
                              </span>

                              {/* Hover actions */}
                              <div className="absolute -top-1 -right-1 hidden group-hover:flex items-center shadow-md rounded-lg overflow-hidden bg-white border border-[#bfc7d2]">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditRoom(room)}
                                  className="p-1 hover:bg-[#dce9ff] text-[#006194]"
                                  title="Editar Cama"
                                >
                                  <span className="material-symbols-outlined text-[13px]">edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRoom(selectedUnitId, room.id)}
                                  className="p-1 hover:bg-[#ffdad6] text-[#ba1a1a]"
                                  title="Eliminar Cama"
                                >
                                  <span className="material-symbols-outlined text-[13px]">delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#bfc7d2] rounded-2xl text-[#565e74]">
                      <span className="material-symbols-outlined text-[32px] text-[#bfc7d2] mb-1">domain</span>
                      <p className="text-xs font-semibold">Seleccione un servicio para ver y administrar sus camas.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specialties Section (Arquitectura PROA RX) */}
            <div className="bg-white border border-[#bfc7d2] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#bfc7d2]/50">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#006194] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">medical_services</span>
                    Especialidades Clínicas y Asistenciales
                  </h3>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    Especialidades médicas y quirúrgicas habilitadas en la institución
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form to add specialty */}
                <div className="md:col-span-1 bg-[#eff4ff] p-4 rounded-xl border border-[#bfc7d2]/50 space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#0b1c30]">
                    {editingSpecId ? 'Editar Especialidad' : 'Nueva Especialidad'}
                  </h4>
                  <input
                    type="text"
                    placeholder="Ej. Infectología, Farmacia Clínica"
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#bfc7d2] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  />
                  <select
                    value={newSpecType}
                    onChange={(e) => setNewSpecType(e.target.value as any)}
                    className="w-full h-9 px-2 bg-white border border-[#bfc7d2] rounded-lg text-xs font-semibold outline-none"
                  >
                    <option value="Medical">Médica / Clínica</option>
                    <option value="Surgical">Quirúrgica</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    disabled={!newSpecName.trim()}
                    className="w-full h-9 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>{editingSpecId ? 'Actualizar' : 'Agregar Especialidad'}</span>
                  </button>
                </div>

                {/* List of Specialties */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {specialties.map((spec) => (
                    <div
                      key={spec.id}
                      className="p-3 bg-white border border-[#bfc7d2]/70 rounded-xl flex items-center justify-between hover:bg-[#eff4ff] transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0b1c30]">{spec.name}</div>
                        <span className="text-[10px] font-semibold text-[#565e74]">
                          {spec.type === 'Medical' ? 'Clínica' : 'Quirúrgica'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpecialty(spec.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                        title="Eliminar Especialidad"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: CDSS & SEGURIDAD */}
        {activeSubTab === 'cdss' && (
          <div className="bg-white border border-[#bfc7d2] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#006194] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Parámetros del Motor de Soporte a Decisiones Clínicas (CDSS)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  Nivel de Rigurosidad del CDSS
                </label>
                <select
                  value={config.cdssStrictLevel}
                  onChange={(e) => setConfig({ ...config, cdssStrictLevel: e.target.value as any })}
                  className="w-full max-w-md h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                >
                  <option value="estricto">Estricto: Bloquea dispensación ante interacciones D-X y Triple Whammy</option>
                  <option value="intermedio">Intermedio: Alerta severa con opción de confirmación simple</option>
                  <option value="flexible">Flexible: Modo consultivo sin bloqueo automático</option>
                </select>
                <p className="text-[11px] text-[#565e74] mt-1">
                  Recomendado: <b>Estricto</b> para cumplimiento de estándares <ClinicalTooltip code="OMS">OMS</ClinicalTooltip> y <ClinicalTooltip code="ISMP">ISMP</ClinicalTooltip>.
                </p>
              </div>

              <div className="pt-3 border-t border-[#bfc7d2]/40 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.invimaCatalogSync}
                    onChange={(e) => setConfig({ ...config, invimaCatalogSync: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded focus:ring-[#006194]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30]">Sincronización Automática CUM INVIMA</span>
                    <p className="text-[11px] text-[#565e74]">
                      Verificación en tiempo real de registros sanitarios vigentes y alertas de retiro de mercado.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.notificarAlergiasCrossmatch}
                    onChange={(e) => setConfig({ ...config, notificarAlergiasCrossmatch: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded focus:ring-[#006194]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30]">Cross-matching de Alergias y Reacciones Cruzadas</span>
                    <p className="text-[11px] text-[#565e74]">
                      Cruce automático de beta-lactámicos, sulfas y AINEs contra el perfil de hipersensibilidad del paciente.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.allow5cBarcodeScan}
                    onChange={(e) => setConfig({ ...config, allow5cBarcodeScan: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded focus:ring-[#006194]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30]">Habilitar Escaneo Código GS1-128 en Pie de Cama (5C)</span>
                    <p className="text-[11px] text-[#565e74]">
                      Permite el matcheo óptico de lote y caducidad previo a la administración.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableRfidVerification}
                    onChange={(e) => setConfig({ ...config, enableRfidVerification: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded focus:ring-[#006194]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30]">Autenticación de Pulsera RFID del Paciente</span>
                    <p className="text-[11px] text-[#565e74]">
                      Verificación automática del sensor RFID de cabecera antes de habilitar el botón de Confirmar 5C.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: INTEROPERABILIDAD */}
        {activeSubTab === 'interoperabilidad' && (
          <div className="bg-white border border-[#bfc7d2] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#006194] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
              Parámetros de Interoperabilidad HL7 & FHIR R4
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  Servidor HL7 v2.x MLLP (Mensajería RXE/OMP)
                </label>
                <input
                  type="text"
                  value={config.hl7Endpoint}
                  onChange={(e) => setConfig({ ...config, hl7Endpoint: e.target.value })}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
                <span className="text-[10px] text-[#565e74] mt-1 block">
                  Protocolo estándar de comunicación directa con HIS hospitalario.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  Endpoint FHIR R4 (MedicationStatement / Bundle)
                </label>
                <input
                  type="text"
                  value={config.fhirEndpoint}
                  onChange={(e) => setConfig({ ...config, fhirEndpoint: e.target.value })}
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
                <span className="text-[10px] text-[#565e74] mt-1 block">
                  API RESTful para intercambio con historia clínica electrónica nacional.
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#bfc7d2]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#1e8462] animate-pulse"></span>
                <div>
                  <div className="text-xs font-bold text-[#0b1c30]">Estado del Bridge Interoperable</div>
                  <div className="text-[11px] text-[#565e74]">HL7 Listener activo y respondiendo ACK en puerto 2575</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#97f5cc]/40 text-[#00694c] border border-[#00694c]/30 text-[10px] font-bold rounded-lg uppercase">
                Conectado
              </span>
            </div>
          </div>
        )}

        {/* SUBTAB 4: SEGURIDAD & FIRMA */}
        {activeSubTab === 'seguridad' && (
          <div className="bg-white border border-[#bfc7d2] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#006194] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">key</span>
              Seguridad, Sobreescritura (Override) y Firma Digital
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.requirePinForOverride}
                  onChange={(e) => setConfig({ ...config, requirePinForOverride: e.target.checked })}
                  className="w-4 h-4 text-[#006194] rounded focus:ring-[#006194]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0b1c30]">Exigir PIN Digital Criptográfico en Overrides CDSS</span>
                  <p className="text-[11px] text-[#565e74]">
                    Obliga al farmacéutico o médico tratante a ingresar su credencial PIN para levantar bloqueos críticos.
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] mb-1.5">
                  PIN Maestro de Sobreescritura de Emergencia
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={config.defaultAdminPin}
                  onChange={(e) => setConfig({ ...config, defaultAdminPin: e.target.value })}
                  className="w-48 h-10 px-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-xl text-xs font-mono font-bold tracking-widest focus:ring-2 focus:ring-[#006194] outline-none"
                  required
                />
                <p className="text-[11px] text-[#565e74] mt-1">
                  PIN utilizado para desbloqueos asistenciales por el superusuario (por defecto: 1234).
                </p>
              </div>

              <div className="pt-3 border-t border-[#bfc7d2]/40">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoLogAuditTrails}
                    onChange={(e) => setConfig({ ...config, autoLogAuditTrails: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded focus:ring-[#006194]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30]">Custodia Inmutable de Auditoría HL7 Provenance</span>
                    <p className="text-[11px] text-[#565e74]">
                      Genera hashes criptográficos SHA para cada conciliación, firma y administración 5C.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#006194] hover:bg-[#007bb9] rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Aplicar y Guardar Todos los Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default ConfiguracionView;
