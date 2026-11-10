import React, { useState } from 'react';

export interface AcronymDefinition {
  title: string;
  spanish: string;
  english?: string;
  description: string;
  targetOrFormula?: string;
  badgeColor?: string;
}

export const ACRONYMS_GLOSSARY: Record<string, AcronymDefinition> = {
  'CDSS': {
    title: 'CDSS',
    spanish: 'Sistema de Soporte para la Decisión Clínica',
    english: 'Clinical Decision Support System',
    description: 'Sistema computarizado interactivo de salud que vincula observaciones clínicas con conocimiento médico estructurado para generar recomendaciones personalizadas y alertas en tiempo real.',
    badgeColor: 'bg-[#006194]',
  },
  'OMS': {
    title: 'OMS / WHO',
    spanish: 'Organización Mundial de la Salud',
    english: 'World Health Organization',
    description: 'Autoridad directiva y coordinadora de la acción sanitaria en el sistema de las Naciones Unidas. Promueve el Reto Mundial por la Seguridad del Paciente: "Medicación sin Daño".',
    badgeColor: 'bg-[#0284c7]',
  },
  'ISMP': {
    title: 'ISMP',
    spanish: 'Instituto para el Uso Seguro de los Medicamentos',
    english: 'Institute for Safe Medication Practices',
    description: 'Organización global sin fines de lucro dedicada a la prevención de errores de medicación y la promoción de prácticas seguras en la farmacoterapia.',
    badgeColor: 'bg-[#00694c]',
  },
  'INVIMA': {
    title: 'INVIMA',
    spanish: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos',
    description: 'Entidad de vigilancia y control en Colombia que regula la calidad, efectividad y seguridad de medicamentos, CUM y dispositivos médicos.',
    badgeColor: 'bg-[#705d00]',
  },
  '5C': {
    title: 'Las 5C (Regla de las 5C)',
    spanish: 'Verificación de Seguridad en Administración de Medicamentos',
    english: '5 Rights of Medication Administration',
    description: 'Protocolo de validación a pie de cama: 1) Paciente Correcto, 2) Medicamento Correcto, 3) Dosis Correcta, 4) Vía Correcta, y 5) Horario Correcto.',
    badgeColor: 'bg-[#6750a4]',
  },
  'MAR': {
    title: 'MAR',
    spanish: 'Medicamentos de Alto Riesgo / Registro Electrónico de Administración',
    english: 'High-Alert Medications / Medication Administration Record',
    description: 'Fármacos con un riesgo elevado de causar daños graves o fatales si ocurre un error en su administración (ej. anticoagulantes, opioides, citostáticos, insulinas).',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'eMAR': {
    title: 'eMAR',
    spanish: 'Registro Electrónico de Administración de Medicamentos',
    english: 'Electronic Medication Administration Record',
    description: 'Módulo hospitalario digital donde el personal de enfermería documenta en tiempo real la administración de cada fármaco con escaneo de código de barras.',
    badgeColor: 'bg-[#00694c]',
  },
  'CUM': {
    title: 'CUM',
    spanish: 'Código Único de Medicamentos',
    description: 'Identificador estandarizado emitido por el INVIMA para cada presentación comercial de medicamentos autorizada en Colombia.',
    badgeColor: 'bg-[#565e74]',
  },
  'ATC': {
    title: 'ATC',
    spanish: 'Clasificación Anatómica, Terapéutica y Química',
    english: 'Anatomical Therapeutic Chemical Classification',
    description: 'Sistema internacional de códigos de la OMS que cataloga los principios activos según el órgano o sistema sobre el que actúan y sus propiedades terapéuticas.',
    badgeColor: 'bg-[#0284c7]',
  },
  'ClCr': {
    title: 'ClCr / CrCl',
    spanish: 'Aclaramiento de Creatinina Estimado',
    english: 'Creatinine Clearance (Cockcroft-Gault)',
    description: 'Estimación de la tasa de filtración glomerular renal calculada mediante la ecuación de Cockcroft-Gault para ajustar posologías y evitar acumulación tóxica.',
    targetOrFormula: 'ClCr = [((140 - Edad) × Peso(kg)) / (72 × Creatinina)] × (0.85 si mujer)',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'CrCl': {
    title: 'CrCl / ClCr',
    spanish: 'Aclaramiento de Creatinina Estimado',
    english: 'Creatinine Clearance',
    description: 'Estimación de la tasa de filtración glomerular renal calculada para ajuste posológico.',
    targetOrFormula: 'Cockcroft-Gault: ClCr en mL/min',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'ASC': {
    title: 'ASC / BSA',
    spanish: 'Área de Superficie Corporal',
    english: 'Body Surface Area (DuBois)',
    description: 'Superficie externa calculada del cuerpo humano, fundamental para dosificación exacta de citostáticos y agentes de estrecho margen terapéutico.',
    targetOrFormula: 'Fórmula DuBois: ASC = 0.007184 × Peso(kg)^0.425 × Talla(cm)^0.725',
    badgeColor: 'bg-[#006194]',
  },
  'BSA': {
    title: 'BSA / ASC',
    spanish: 'Área de Superficie Corporal',
    english: 'Body Surface Area',
    description: 'Área de superficie corporal calculada según peso y talla (m²).',
    targetOrFormula: 'DuBois & DuBois (m²)',
    badgeColor: 'bg-[#006194]',
  },
  'SRAA': {
    title: 'SRAA / RAAS',
    spanish: 'Sistema Renina-Angiotensina-Aldosterona',
    english: 'Renin-Angiotensin-Aldosterone System',
    description: 'Complejo hormonal que regula la presión arterial, volemia y resistencia vascular. El bloqueo dual (IECA + ARA-II) está contraindicado por riesgo de hiperpotasemia y falla renal.',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'IECA': {
    title: 'IECA',
    spanish: 'Inhibidor de la Enzima Convertidora de Angiotensina',
    english: 'ACE Inhibitor',
    description: 'Grupo antihipertensivo y nefroprotector (ej. Enalapril, Captopril, Ramipril) que bloquea la síntesis de angiotensina II.',
    badgeColor: 'bg-[#0284c7]',
  },
  'ARA-II': {
    title: 'ARA-II / ARB',
    spanish: 'Antagonista de los Receptores de Angiotensina II',
    english: 'Angiotensin Receptor Blocker',
    description: 'Fármacos que bloquean específicamente el receptor AT1 de la angiotensina II (ej. Losartán, Valsartán, Telmisartán).',
    badgeColor: 'bg-[#0284c7]',
  },
  'AINE': {
    title: 'AINE / NSAID',
    spanish: 'Antiinflamatorio No Esteroideo',
    english: 'Nonsteroidal Anti-inflammatory Drug',
    description: 'Agentes analgésicos y antiinflamatorios (ej. Ketorolaco, Ibuprofeno, Diclofenaco) que inhiben la ciclooxigenasa (COX) y reducen la vasodilatación de la arteriola aferente renal.',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'FEVI': {
    title: 'FEVI / LVEF',
    spanish: 'Fracción de Eyección del Ventrículo Izquierdo',
    english: 'Left Ventricular Ejection Fraction',
    description: 'Porcentaje de sangre expulsada por el ventrículo izquierdo con cada contracción. Clave para estadificar insuficiencia cardíaca.',
    badgeColor: 'bg-[#006194]',
  },
  'ERC': {
    title: 'ERC / CKD',
    spanish: 'Enfermedad Renal Crónica',
    english: 'Chronic Kidney Disease',
    description: 'Pérdida progresiva e irreversible de la función renal glomerular a lo largo del tiempo, clasificada en estadios 1 a 5 según la TFG.',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'TFG': {
    title: 'TFG / GFR',
    spanish: 'Tasa de Filtración Glomerular',
    english: 'Glomerular Filtration Rate',
    description: 'Volumen de fluido filtrado por los capilares glomerulares renales en los túbulos por unidad de tiempo.',
    badgeColor: 'bg-[#006194]',
  },
  'HL7': {
    title: 'HL7',
    spanish: 'Health Level Seven',
    description: 'Conjunto internacional de estándares de mensajería y comunicación interoperable para transferir datos clínicos y administrativos entre sistemas de salud.',
    badgeColor: 'bg-[#3f4850]',
  },
  'FHIR': {
    title: 'FHIR (Fast Healthcare Interoperability Resources)',
    spanish: 'Recursos Rápidos de Interoperabilidad en Salud',
    description: 'Estándar de interoperabilidad de última generación creado por HL7, basado en tecnologías web modernas (JSON, RESTful API, OAuth) para intercambio de historias clínicas.',
    badgeColor: 'bg-[#0284c7]',
  },
  'RFID': {
    title: 'RFID',
    spanish: 'Identificación por Radiofrecuencia',
    english: 'Radio-Frequency Identification',
    description: 'Tecnología de rastreo inalámbrico que utiliza campos electromagnéticos para identificar etiquetas en pulseras de pacientes y medicamentos.',
    badgeColor: 'bg-[#6750a4]',
  },
  'GS1': {
    title: 'GS1-128 / GTIN',
    spanish: 'Estándar Global de Trazabilidad Farmacéutica',
    description: 'Estándar internacional de códigos de barras bidimensionales o lineales que incluye GTIN (código de producto), lote, fecha de caducidad y número de serie.',
    badgeColor: 'bg-[#00694c]',
  },
  'GTIN': {
    title: 'GTIN',
    spanish: 'Número Global de Artículo Comercial',
    english: 'Global Trade Item Number',
    description: 'Identificador único global para productos comerciales de salud en empaques primarios y secundarios.',
    badgeColor: 'bg-[#00694c]',
  },
  'PROA': {
    title: 'PROA',
    spanish: 'Programa de Optimización de Antimicrobianos',
    english: 'Antimicrobial Stewardship Program (ASP)',
    description: 'Estrategia institucional para optimizar el uso de antimicrobianos, garantizando eficacia terapéutica, minimizando toxicidad y combatiendo la resistencia bacteriana.',
    badgeColor: 'bg-[#006194]',
  },
  'PIN': {
    title: 'PIN',
    spanish: 'Número de Identificación Personal',
    english: 'Personal Identification Number',
    description: 'Clave criptográfica confidencial utilizada para firma digital e inviolabilidad en aprobaciones de override clínico.',
    badgeColor: 'bg-[#3f4850]',
  },
  'IPS': {
    title: 'IPS',
    spanish: 'Institución Prestadora de Servicios de Salud',
    description: 'Entidad de salud acreditada en Colombia (clínica u hospital) encargada de la atención médica directa de pacientes.',
    badgeColor: 'bg-[#006194]',
  },
  'PID': {
    title: 'PID',
    spanish: 'Identificador Único del Paciente',
    english: 'Patient Identifier',
    description: 'Número de historia clínica o identificación institucional asignado unívocamente al paciente en el sistema HIS/EMR.',
    badgeColor: 'bg-[#006194]',
  },
  'VO': {
    title: 'VO',
    spanish: 'Vía Oral',
    description: 'Administración del fármaco por la boca para su deglución y absorción gastrointestinal.',
    badgeColor: 'bg-[#565e74]',
  },
  'IV': {
    title: 'IV',
    spanish: 'Vía Intravenosa',
    english: 'Intravenous',
    description: 'Administración directa del medicamento al torrente sanguíneo mediante punción o catéter venoso.',
    badgeColor: 'bg-[#ba1a1a]',
  },
  'SC': {
    title: 'SC',
    spanish: 'Vía Subcutánea',
    english: 'Subcutaneous',
    description: 'Administración en el tejido adiposo situado inmediatamente por debajo de la dermis.',
    badgeColor: 'bg-[#565e74]',
  },
  'CIE-10': {
    title: 'CIE-10 / ICD-10',
    spanish: 'Clasificación Internacional de Enfermedades, 10ª Revisión',
    english: 'International Classification of Diseases 10th Revision',
    description: 'Sistema estandarizado de la OMS para la codificación diagnóstica y morbilidad médica hospitalaria.',
    badgeColor: 'bg-[#006194]',
  },
};

interface ClinicalTooltipProps {
  code: string;
  children?: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
}

export const ClinicalTooltip: React.FC<ClinicalTooltipProps> = ({
  code,
  children,
  className = '',
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const def = ACRONYMS_GLOSSARY[code] || {
    title: code,
    spanish: `Término / Sigla: ${code}`,
    description: 'Parámetro clínico, abreviatura institucional o índice farmacoterapéutico.',
  };

  return (
    <span
      className={`relative inline-flex items-center group cursor-help ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
    >
      <span className="border-b border-dotted border-current group-hover:text-[#006194] dark:group-hover:text-blue-400 transition-colors">
        {children || code}
      </span>

      {/* Hover Tooltip Popup Card */}
      {isVisible && (
        <span
          className={`absolute left-1/2 -translate-x-1/2 z-[100] w-72 p-3.5 bg-slate-900/95 dark:bg-black/95 text-white rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md text-left transition-all duration-200 pointer-events-none animate-in fade-in zoom-in-95 ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          role="tooltip"
        >
          {/* Header */}
          <span className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${def.badgeColor || 'bg-blue-500'}`} />
              <span className="text-xs font-black tracking-wider text-blue-400 uppercase">
                {def.title}
              </span>
            </span>
            {def.english && (
              <span className="text-[10px] text-slate-400 italic font-mono truncate max-w-[130px]">
                {def.english}
              </span>
            )}
          </span>

          {/* Spanish Full Name */}
          <span className="block text-xs font-extrabold text-white leading-tight mb-1">
            {def.spanish}
          </span>

          {/* Clinical Explanation */}
          <span className="block text-[11px] text-slate-300 font-normal leading-relaxed">
            {def.description}
          </span>

          {/* Formula or Target Meta if any */}
          {def.targetOrFormula && (
            <span className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">tune</span>
              <span>{def.targetOrFormula}</span>
            </span>
          )}

          {/* Small arrow triangle */}
          <span
            className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${
              position === 'top'
                ? 'top-full border-t-4 border-t-slate-900/95'
                : 'bottom-full border-b-4 border-b-slate-900/95'
            }`}
          />
        </span>
      )}
    </span>
  );
};

export default ClinicalTooltip;
