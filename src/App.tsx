/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TabView,
  UserRole,
  Patient,
  PreAdmissionMedication,
  InpatientOrder,
  CdssAlert,
  Verification5CState,
  AuditEvent,
  OrderActionType,
} from './types/clinical';
import {
  PATIENT_CARLOS,
  INITIAL_PRE_ADMISSION_MEDS,
  INITIAL_INPATIENT_ORDERS,
  INITIAL_CDSS_ALERTS,
  INITIAL_VERIFICATION_5C,
  INITIAL_AUDIT_LOGS,
} from './data/mockClinicalData';
import { Header } from './components/Header';
import { PatientBanner } from './components/PatientBanner';
import { MatrizConciliacionView } from './components/MatrizConciliacionView';
import { Verificacion5CView } from './components/Verificacion5CView';
import { HojaAltaOMSView } from './components/HojaAltaOMSView';
import { AuditoriaCDSSView } from './components/AuditoriaCDSSView';
import { ConfiguracionView } from './components/ConfiguracionView';
import { PharmacokineticsModal } from './components/PharmacokineticsModal';
import { ConsolidationModal } from './components/ConsolidationModal';
import { LoginPage } from './components/LoginPage';
import { PatientModal } from './components/PatientModal';
import ClinicalTooltip from './components/ClinicalTooltip';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    specialty?: string;
    medicalReg?: string;
    ips?: string;
  } | null>(() => {
    const saved = localStorage.getItem('miconciliacion_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Multiple Patients management
  const [patients, setPatients] = useState<Patient[]>(() => {
    const savedPatients = localStorage.getItem('miconciliacion_patients');
    if (savedPatients) {
      try {
        return JSON.parse(savedPatients);
      } catch (e) {
        return [PATIENT_CARLOS];
      }
    }
    return [PATIENT_CARLOS];
  });

  const [activePatientId, setActivePatientId] = useState<string>(() => {
    return patients[0]?.id || PATIENT_CARLOS.id;
  });

  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0] || PATIENT_CARLOS;

  const [activeTab, setActiveTab] = useState<TabView>('matriz-de-conciliacion');
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'farmaceutico');
  const [preAdmissionMeds, setPreAdmissionMeds] = useState<PreAdmissionMedication[]>(INITIAL_PRE_ADMISSION_MEDS);
  const [orders, setOrders] = useState<InpatientOrder[]>(INITIAL_INPATIENT_ORDERS);
  const [cdssAlerts, setCdssAlerts] = useState<CdssAlert[]>(INITIAL_CDSS_ALERTS);
  const [verificationState, setVerificationState] = useState<Verification5CState>(INITIAL_VERIFICATION_5C);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);

  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);
  const [isPharmacokineticsModalOpen, setIsPharmacokineticsModalOpen] = useState<boolean>(false);
  const [isConsolidationModalOpen, setIsConsolidationModalOpen] = useState<boolean>(false);

  // Sync patients to localStorage
  useEffect(() => {
    localStorage.setItem('miconciliacion_patients', JSON.stringify(patients));
  }, [patients]);

  const handleAddNewPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setActivePatientId(newPatient.id);
    setIsConsolidated(false);

    // Create custom starting orders/meds based on patient condition
    const customPreMed: PreAdmissionMedication = {
      id: `pre-${Date.now()}-1`,
      nombre: 'Metformina 850 mg',
      dosis: '850 mg',
      via: 'Vía Oral',
      posologia: '1 comp c/12h VO con alimentos',
      atc: 'A10BA02',
      atcGrupo: 'ATC-A',
      esMAR: false,
      tipo: 'Prescrito',
      indicacion: 'Diabetes Mellitus Tipo 2',
      adherencia: '92%',
      cumInvima: '19951230-01',
    };
    setPreAdmissionMeds([customPreMed, ...INITIAL_PRE_ADMISSION_MEDS.slice(0, 2)]);

    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' COT',
      usuario: currentUser?.name || 'Profesional de Guardia',
      rol: 'Ingreso Clínico',
      evento: 'NUEVO PACIENTE INGRESADO AL CDSS',
      tipo: 'RECONCILIATION',
      detalles: `Paciente ${newPatient.nombre} (${newPatient.pid}) admitido en Cama ${newPatient.cama} (${newPatient.servicio}). ClCr: ${newPatient.clCr} mL/min.`,
      protocolo: 'Protocolo de Ingreso y Conciliación Clínica Santillana',
      hashTransaccion: 'adm.' + Math.random().toString(16).substring(2, 6) + '.2026',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem('miconciliacion_user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(u) => { setCurrentUser(u); setCurrentRole(u.role); }} />;
  }

  // Check if there is an active fatal CDSS block
  const ketorolacoOrder = orders.find((o) => o.id === 'ord-3');
  const tripleWhammyAlert = cdssAlerts.find((a) => a.id === 'cdss-alert-1');
  const isTripleWhammyActive =
    ketorolacoOrder?.accionSeleccionada !== 'suspender' &&
    tripleWhammyAlert?.estado !== 'superado_con_override';

  const criticalAlertCount = isTripleWhammyActive ? 1 : 0;
  const unresolvedDiscrepancies = orders.filter((o) => o.estadoValidacion === 'Acción Requerida').length;

  // Handle changing an order's reconciliation action
  const handleUpdateOrderAction = (orderId: string, action: OrderActionType) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        let motivo = ord.motivoAccion;
        let estadoValidacion = ord.estadoValidacion;

        if (orderId === 'ord-3') {
          // Ketorolaco
          if (action === 'suspender') {
            motivo =
              'Intervención Clínica: Suspensión inmediata. Proponer analgesia con Paracetamol 1g IV + rescate opioide débil.';
            estadoValidacion = 'Validado';
          } else if (action === 'continuar') {
            motivo = '¡ADVERTENCIA! Uso concomitante de AINE con Losartán y Furosemida en paciente con ClCr 42 mL/min.';
            estadoValidacion = 'Alta Severidad';
          } else {
            motivo = 'Ajuste de esquema analgésico solicitado a Medicina Interna.';
            estadoValidacion = 'Acción Requerida';
          }
        } else if (orderId === 'ord-1') {
          // Losartán
          if (action === 'suspender') {
            motivo = 'Motivo de Suspensión: Bloqueo dual del eje SRAA ineficaz con riesgo hiperpotasemia severa.';
          } else if (action === 'continuar') {
            motivo = 'Decisión: Mantener Losartán como terapia principal antihipertensiva. Enalapril suspendido.';
            estadoValidacion = 'Validado';
          }
        } else if (orderId === 'ord-4') {
          // Metotrexato
          if (action === 'sustituir' || action === 'continuar') {
            motivo = 'Acción: Pautar 15 mg VO única dosis los Viernes a las 08:00 + Ácido Fólico 5 mg los Domingos.';
            estadoValidacion = 'Pauta Especial';
          }
        }

        return {
          ...ord,
          accionSeleccionada: action,
          motivoAccion: motivo,
          estadoValidacion,
        };
      })
    );

    // If ketorolaco was suspended, log to audit trail
    if (orderId === 'ord-3' && action === 'suspender') {
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' COT',
        usuario: 'Dra. Marcela Cardona H. (Reg. #8492)',
        rol: 'Farmacéutica Clínica',
        evento: 'SUSPENSIÓN AINE RECONCILIADA',
        tipo: 'RECONCILIATION',
        detalles: 'Ketorolaco suspendido en orden ORD-88223. Riesgo de Triple Whammy eliminado.',
        protocolo: 'Guía Institucional Clínica Santillana CDSS',
        hashTransaccion: '8492.' + Math.random().toString(16).substring(2, 6) + '.ff01',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  // Handle CDSS Override validation
  const handleValidateOverride = (justification: string, pin: string) => {
    setCdssAlerts((prev) =>
      prev.map((al) =>
        al.id === 'cdss-alert-1'
          ? {
              ...al,
              estado: 'superado_con_override',
              justificacionOverride: justification,
              pinFirma: pin,
            }
          : al
      )
    );

    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' COT',
      usuario: 'Dra. Marcela Cardona H. / Dr. F. Morales',
      rol: 'Validación Colegiada',
      evento: 'OVERRIDE CDSS APROBADO CON PIN',
      tipo: 'OVERRIDE',
      detalles: `Sobreescritura justificada: "${justification}". PIN digital autenticado en nodo institucional.`,
      protocolo: 'HL7 FHIR AuditEvent Provenance',
      hashTransaccion: 'ovrd.' + Math.random().toString(16).substring(2, 6) + '.9920',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Handle Bedside 5C administration confirmation
  const handleConfirmAdministration = () => {
    const timeNow = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setVerificationState((prev) => ({
      ...prev,
      administracionConfirmada: true,
      horaConfirmacion: timeNow,
      registroMar: `Hoy, ${timeNow}`,
    }));

    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: `${timeNow} COT`,
      usuario: 'Enf. S. Valencia (Reg. #49201)',
      rol: 'Enfermera Bedside',
      evento: 'ADMINISTRACIÓN 5C REGISTRADA EN MAR',
      tipo: 'BEDSIDE_5C',
      detalles: 'Furosemida 40 mg/4 mL IV administrada a Carlos Restrepo Gómez (Cama 412-B). Match RFID & GS1 OK.',
      protocolo: 'GS1-128 eMAR Bedside Administration',
      hashTransaccion: 'emar.' + Math.random().toString(16).substring(2, 6) + '.4920',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Handle reporting discrepancy from bedside 5C
  const handleReportDiscrepancy = (reason: string) => {
    const timeNow = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: `${timeNow} COT`,
      usuario: 'Enf. S. Valencia (Reg. #49201)',
      rol: 'Enfermera Bedside',
      evento: 'DESVIACIÓN / RETENCIÓN REPORTADA',
      tipo: 'CRITICAL_ALERT',
      detalles: `Motivo de retención: "${reason}". Notificación transmitida a Farmacia Clínica y Médico de Guardia.`,
      protocolo: 'Protocolo de Seguridad del Paciente OMS',
      hashTransaccion: 'ret.' + Math.random().toString(16).substring(2, 6) + '.warn',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
    alert(`Alerta CDSS generada: "${reason}". Notificación transmitida a Farmacia Clínica y Médico de Guardia.`);
  };

  // Confirm overall consolidation and sign
  const handleConfirmConsolidation = () => {
    setIsConsolidated(true);
    const timeNow = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: `${timeNow} COT`,
      usuario: 'Dra. Marcela Cardona H. (Reg. #8492)',
      rol: 'Farmacéutica Clínica',
      evento: 'CONSOLIDACIÓN DIGITAL EMITIDA',
      tipo: 'FHIR_EXPORT',
      detalles: 'Plan farmacoterapéutico oficial firmado electrónicamente. FHIR Bundle R4 transmitido a Clínica Santillana.',
      protocolo: 'HL7 FHIR R4 Bundle / Cryptographic Signature',
      hashTransaccion: '9a7f.e23b.cc81.049f',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-body-base antialiased">
      {/* Universal Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalAlertCount={criticalAlertCount}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        isMobileDeviceView={isMobileDeviceView}
        setIsMobileDeviceView={setIsMobileDeviceView}
        patients={patients}
        activePatient={activePatient}
        onSelectPatient={(pid) => {
          setActivePatientId(pid);
          setIsConsolidated(false);
        }}
        onOpenNewPatientModal={() => setIsPatientModalOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        {/* Persistent Patient Banner shown on Matriz and Auditoria views */}
        {activeTab !== 'verificacion-pie-de-cama-5c' && activeTab !== 'hoja-de-alta-oms' && (
          <PatientBanner
            patient={activePatient}
            hasCriticalBlock={isTripleWhammyActive}
            unresolvedCount={unresolvedDiscrepancies}
            isConsolidated={isConsolidated}
            onOpenConsolidationModal={() => setIsConsolidationModalOpen(true)}
            onOpenNewPatientModal={() => setIsPatientModalOpen(true)}
          />
        )}

        {/* Dynamic Views */}
        {activeTab === 'matriz-de-conciliacion' && (
          <MatrizConciliacionView
            patient={activePatient}
            preAdmissionMeds={preAdmissionMeds}
            orders={orders}
            cdssAlerts={cdssAlerts}
            onUpdateOrderAction={handleUpdateOrderAction}
            onValidateOverride={handleValidateOverride}
            onOpenPharmacokineticsModal={() => setIsPharmacokineticsModalOpen(true)}
            isConsolidated={isConsolidated}
            onOpenConsolidationModal={() => setIsConsolidationModalOpen(true)}
          />
        )}

        {activeTab === 'verificacion-pie-de-cama-5c' && (
          <Verificacion5CView
            patient={activePatient}
            verificationState={verificationState}
            onConfirmAdministration={handleConfirmAdministration}
            onReportDiscrepancy={handleReportDiscrepancy}
            onNavigateTab={setActiveTab}
            isMobileDeviceView={isMobileDeviceView}
          />
        )}

        {activeTab === 'hoja-de-alta-oms' && <HojaAltaOMSView patient={activePatient} />}

        {activeTab === 'auditoria-cdss' && <AuditoriaCDSSView auditLogs={auditLogs} />}

        {activeTab === 'configuracion' && (
          <ConfiguracionView
            currentRole={currentRole}
            currentUser={currentUser}
            onUpdateIpsName={(newIps) => {
              if (currentUser) {
                const updated = { ...currentUser, ips: newIps };
                setCurrentUser(updated);
                localStorage.setItem('miconciliacion_user', JSON.stringify(updated));
              }
            }}
          />
        )}
      </main>

      {/* Institutional Clinical Footer */}
      <footer className="w-full bg-white border-t border-[#bfc7d2]/50 py-3 px-4 sm:px-6 print:hidden mt-auto">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 text-[#3f4850] font-label-mono-metric text-[11px]">
          <div>
            Mi Conciliación RX by Quimera RX (Version 1.0) | {currentUser?.ips || 'Centro Médico de Especialistas Clínica Santillana'}
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>
              Seguridad Farmacológica: Validado <ClinicalTooltip code="OMS">OMS</ClinicalTooltip> /{' '}
              <ClinicalTooltip code="ISMP">ISMP</ClinicalTooltip> / <ClinicalTooltip code="INVIMA">INVIMA</ClinicalTooltip>
            </span>
            <span className="font-code-audit text-[#006194] font-bold">
              Nodo Activo: RXE-SANTILLANA-CLUSTER-01
            </span>
          </div>
        </div>
      </footer>

      {/* Pharmacokinetics Information Modal */}
      <PharmacokineticsModal
        isOpen={isPharmacokineticsModalOpen}
        onClose={() => setIsPharmacokineticsModalOpen(false)}
      />

      {/* Digital Signature & Consolidation Modal */}
      <ConsolidationModal
        isOpen={isConsolidationModalOpen}
        onClose={() => setIsConsolidationModalOpen(false)}
        patient={activePatient}
        orders={orders}
        isAlreadyConsolidated={isConsolidated}
        onConfirmConsolidation={handleConfirmConsolidation}
      />

      {/* New Patient Entry Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSavePatient={handleAddNewPatient}
        currentPatientCount={patients.length}
      />
    </div>
  );
}
