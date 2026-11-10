export type TabView =
  | 'dashboard-pacientes'
  | 'matriz-de-conciliacion'
  | 'verificacion-pie-de-cama-5c'
  | 'hoja-de-alta-oms'
  | 'auditoria-cdss'
  | 'configuracion';

export type UserRole = 'farmaceutico' | 'medico' | 'enfermero';

export interface Patient {
  id: string;
  pid: string;
  nombre: string;
  edad: number;
  sexo: 'M' | 'F';
  servicio: string;
  cama: string;
  fechaIngreso: string;
  pesoKg: number;
  tallaCm: number;
  creatinina: number; // mg/dL
  clCr: number; // mL/min (Cockcroft-Gault)
  bsaDuBois: number; // m2
  alergias: Array<{ sustancia: string; severidad: string; reaccion: string }>;
  diagnosticos: string[];
  rfidPulsera: string;
  medicoTratante: string;
  farmaceuticoAsignado: string;
  // Estado de conciliación y paciente
  estadoConciliacion?: 'conciliado' | 'en_progreso' | 'bloqueado' | 'pendiente';
  nivelDiscrepancias?: 'ninguna' | 'leve' | 'moderada' | 'critica';
  estadoClinico?: 'estable' | 'cuidado_intermedio' | 'critico' | 'alta_pendiente';
  discrepanciasCount?: {
    total: number;
    criticas: number;
    omisiones: number;
    duplicidades: number;
    interacciones: number;
  };
  ultimaActualizacion?: string;
}

export type PreAdmissionDrugStatus = 'Prescrito' | 'Automedicado' | 'Especialidad' | 'Fitoterapia';

export interface Room {
  id: number;
  name: string; // e.g., "101", "412-B"
  type: 'Individual' | 'Shared';
}

export interface ClinicalUnit {
  id: number;
  name: string;
  code: string; // e.g., "UCI", "MED-INT"
  rooms: Room[];
}

export interface Specialty {
  id: number;
  name: string;
  type: 'Medical' | 'Surgical';
}

export interface PreAdmissionMedication {
  id: string;
  nombre: string;
  dosis: string;
  via: string;
  posologia: string;
  atc: string;
  atcGrupo: 'ATC-C' | 'ATC-A' | 'ATC-M' | 'ATC-L' | 'ATC-N';
  esMAR: boolean; // Medicamento de Alto Riesgo
  tipo: PreAdmissionDrugStatus;
  indicacion: string;
  adherencia?: string;
  ultimaToma?: string;
  alerta?: string;
  cumInvima?: string;
  // Campos clínicos extendidos
  fechaInicio?: string;
  prescritoPor?: string; // Quién lo formuló
  fechaFinEstimada?: string; // Si se sabe cuándo finaliza o si es crónico/indefinido
  esTratamientoCronico?: boolean;
}

export type OrderActionType = 'continuar' | 'suspender' | 'modificar' | 'sustituir';

export interface InpatientOrder {
  id: string;
  numeroOrden: string;
  nombre: string;
  dosis: string;
  via: string;
  posologia: string;
  indicacion: string;
  prescriptor: string;
  accionSeleccionada: OrderActionType;
  motivoAccion?: string;
  estadoValidacion: 'Validado' | 'Acción Requerida' | 'Alta Severidad' | 'Pauta Especial' | 'Concordante';
  etiquetaAlerta?: string;
  esBloqueoFatal?: boolean;
  horario?: string[];
  cumInvima?: string;
  // Campos clínicos extendidos
  fechaInicio?: string;
  fechaFinEstimada?: string;
  duracionDias?: number;
}

export interface CdssAlert {
  id: string;
  tipo: 'bloqueo-fatal' | 'protocolo-seguridad' | 'interaccion-fitoterapia';
  titulo: string;
  subtitulo: string;
  triada?: Array<{ etapa: string; farmacos: string }>;
  mecanismo: string;
  estado: 'bloqueado' | 'superado_con_override' | 'resuelto_por_suspension';
  justificacionOverride?: string;
  pinFirma?: string;
}

export interface Verification5CState {
  paciente: {
    nombre: string;
    rfid: string;
    verificado: boolean;
    detalle: string;
  };
  medicamento: {
    nombre: string;
    orden: string;
    verificado: boolean;
    detalle: string;
    cum: string;
    lote: string;
    vencimiento: string;
    gtinGs1: string;
  };
  dosis: {
    pautada: string;
    detectada: string;
    verificado: boolean;
    detalle: string;
  };
  via: {
    descripcion: string;
    sitio: string;
    verificado: boolean;
    detalle: string;
  };
  hora: {
    programada: string;
    actual: string;
    ventanaSegura: string;
    verificado: boolean;
    detalle: string;
  };
  administracionConfirmada: boolean;
  horaConfirmacion?: string;
  operador: string;
  registroMar: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  usuario: string;
  rol: string;
  evento: string;
  tipo: 'CRITICAL_ALERT' | 'OVERRIDE' | 'RECONCILIATION' | 'BEDSIDE_5C' | 'FHIR_EXPORT';
  detalles: string;
  protocolo: string;
  hashTransaccion: string;
}
