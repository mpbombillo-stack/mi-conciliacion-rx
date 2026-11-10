---
name: Clinical High-Reliability CDSS
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00694c'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e8462'
  on-tertiary-container: '#f5fff7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#97f5cc'
  tertiary-fixed-dim: '#7bd8b1'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-base:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  body-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  body-dense:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
  label-mono-metric:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  code-audit:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 2px
  space-xs: 4px
  space-sm: 8px
  space-md: 12px
  space-base: 16px
  space-lg: 20px
  space-xl: 24px
  space-2xl: 32px
  gutter-dense: 8px
  gutter-default: 12px
  banner-inset: 12px 16px
---

## Brand & Style
This design system is engineered for high-stakes inpatient reconciliation and clinical decision support systems (CDSS). The brand personality conveys total precision, calm authority, clinical rigor, and zero-ambiguity safety verification. Designed specifically for hospital clinical pharmacists, attending physicians, and intensive care clinicians operating under intense cognitive load, the visual environment prioritizes rapid perceptual scanning, clear triage paths, and fail-safe interaction feedback.

The aesthetic fuses **Corporate / Modern High-Reliability** with ergonomic clinical data density:
- **Zero Ambiguity:** Strict differentiation between observation, standard workflow, clinical warnings, and critical safety blocks.
- **Dense Ergonomics:** Maximum data visibility without visual exhaustion; scannable tabular views, tightly engineered typography, and compact metadata structures.
- **Fail-safe Interactions:** Dangerous actions require intentional, verified confirmation sequences; critical alerts cannot be silently dismissed.

## Colors
The color architecture complies strictly with ISO/IEC medical device usability and WCAG 2.1 AAA contrast benchmarks for critical information delivery.

### Functional Medical Spectrum
- **Primary Clinical Blue (`#0284C7`):** Directs active primary workflows, focus states, verified reconciliation links, and non-emergent selections.
- **Slate Anchor (`#0F172A` / `#1E293B`):** Establishes solid structural contrast for clinical headers, fixed navigation panels, patient ID bars, and deep metric typography.
- **Critical Block / MAR Contraindication (`#B91C1C` / bg `#FEF2F2` / border `#FCA5A5`):** Reserved solely for hard stop alerts, fatal drug-drug interactions, severe anaphylaxis risks, and lethal dosage discrepancies.
- **Warning Override (`#D97706` / bg `#FFFBEB` / border `#FCD34D`):** Applied to caution-level checks, renal/hepatic dose titration warnings, duplicate therapy notices, and items demanding mandatory clinical reason overrides.
- **Success Validated (`#047857` / bg `#ECFDF5` / border `#A7F3D0`):** Indicates reconciled items, verified home regimens, cleared CDSS rules, and authenticated digital signatures.

### Surface Architecture
- **App Canvas Base:** `#F8FAFC` (Slate 50) delivers an anti-glare, clinical neutral background.
- **Card & Panel Surfaces:** `#FFFFFF` (Pure White) with crisp perimeter containment (`#E2E8F0` / Slate 200).
- **Muted Inactive Surface:** `#F1F5F9` (Slate 100) for unselected tabs, secondary columns, and table header rows.

## Typography
Typography is anchored to **Inter** (with system fallback to `-apple-system, BlinkMacSystemFont, "Segoe UI"`), chosen for its tall x-height, unambiguous numeral rendering, open counters, and high performance in complex data grids.

- **Tabular Figures:** All numeric readouts, dosages, body surface area (BSA) measurements, lab values, and timestamps must leverage `font-feature-settings: "tnum" 1, "cv05" 1` to prevent baseline shifting across clinical tables.
- **Dosage Distinction:** Active drug compounds use medium/semibold tracking, while dosing figures (`mg`, `mcg`, `mL/h`) are styled with strict tabular numerals and unit locks to avoid trailing zero misinterpretation.
- **Micro-labels (`label-caps`):** Rendered in uppercase with +0.05em tracking for clinical taxonomy (e.g., `MAR STATUS`, `ATC CODE`, `DUBOIS BSA`, `CrCl`).

## Layout & Spacing
The layout model employs a responsive, dense clinical workspace split across functional panes:
1. **Persistent Top Patient Banner (Fixed 64px):** Displays immutable patient identifiers (Name, MRN, Bed, Age/Sex, Weight, Height, DuBois BSA, eGFR, Allergies) with zero horizontal drift.
2. **Reconciliation Tri-Pane Workspace:**
   - Left (Col 1-3): Pre-admission home medication regimen and source history.
   - Center (Col 4-8): Inpatient prescription comparison, CDSS validation pipeline, and reconciliation decisions.
   - Right (Col 9-12): Real-time CDSS interaction panel, clinical alert queue, and electronic signature authorization pane.

### Responsive Behavior & Reflow Rules
- **Desktop (>= 1280px):** Full tri-pane side-by-side view with synchronized row-height scrolling between home regimens and inpatient orders.
- **Tablet / Clinical Cart (1024px - 1279px):** Center and left panes side-by-side; right CDSS pane collapses into a slide-out drawer pinned with count indicators.
- **Mobile Handheld (< 1024px):** Stacks into a linear tabbed reconciliation sequence: Regimen View -> CDSS Discrepancies -�[�[�Yۋ[ٙ������[]�][ۈ	�\�\�\�Yۈ�\�[H]��Y�X�ܘ]]�H�\��Y���Y���[��]�܈و
��ܚ\���[�\�H�۝Z[�Y[�
��[�
��ۘ[��]Y�X�][ۊ���[��\�H�X�[�\�]H[�\�\����][�[ܙ\��[�[[Z[�][ێ���H
��]�[
\�[��\�N���Y�][�]HL
ю�Q��
K��H
��]�[H
�[�X�[�\��	�[�[\�N���\�H�]H�[
ё�����
K[��ܙY�HH\��X�\�[����H
�L�N�
H[�[�[X�Y[��]�Y��
\��ؘJMK����JX
K��H
��]�[�
X�]�K��[X�Y�\�	��ݙ\��N���\�H�]H�[�ܙ\�[]�]Y��[X\�H�[�X�[�YH
����
H܈�\��[����[�\�Y\��]H�X[�ٙ��]��L\�ؘJMK����
K�L��ؘJMK����
X��H
��]�[�
[Y\��[��Hݙ\��Y\�	�[�[��\�N���[�[ݙ\�^H�]��Y�X�����ܚ[H
�ؘJMK�����JX
K[�[�ܙ\�]�ܚ]X�[ۙK[�ܚ\�[]�]Y���LM\L��ؘJMK����M�X������\\H�۝��Y
���ٝ
��\�[H�Y�][
J���ܛ�\��Y]\�\�[��ܘ�Y��Y��]H[�\�H�\�[K���H
��
��[�Y
N����[�\��܈�ܛH[�]�X�HX�[ۈ�]ۜ��Y�H�]\��۝Z[�\����Y�X�][ۈ�[��\��[��]YYX�][ۈ���ˈXZ[�Z[��H�ٙ\��[ۘ[�[�X�[���]�\�\��\�[��HܚY[YۛY[���H
���
��[�Y[Y
N����\�\��Y�܈��][��X[������[\��[�]�[�XZ[��[�X�[�X�[ۈ[�[˂�H
���[[
��[�YY�[
N�����X�H[Z]Y�]Y[�[\��H�\�[���[��Y�\�[��YHX�˂������\ۙ[�����YYX�][ۈX�[ۈ�]ۈ]XY�[���[�\�^�YX�[ۈ�]ۜ��܈YYX�][ۈ�X�ۘ�[X][ێ��H
���۝[�X\�
�۝[�YJN����]]�[\��]]�H�][�H܈��YܙY[�[�
��V��Pё�WH^V���M�H�ܙ\�V��Mь�X
K��ۙ�\�\��۝[�X][ۈو�Y�[Y[��]�][\�][ۜ˂�H
���\�[�\�
\�\�ܚX�H��
N���ܚ]X�[]�\��[��[�Y
��V�ёQ����H^V�ЎLP�P�H�ܙ\�V�ѐ�MPMWX
K�[�\�\N��\]Z\�\�ۙKX�X��[�X�][ۈ���ۋ��H
��[�Y�X�\�
[�Y�H��H���]JN����[X\�H�YH�][�H
��V�ь�Q��H^V�����H�ܙ\�V�АQM��X
K��[��[�[�H��[��ٜ�\]Y[��HY]܋��H
���\�]Z\�
\�\]]X��X��]][ۊN���[X�\��]][ۈ�][�H
��V�ё���P�H^V��M���H�ܙ\�V�ёM�WX
K���\��ܛ][\�H[\��]]�H���\����������Y�]H�[��\�K�
��ܚ]X�[�۝�Z[�X�][ۈ�[��\�����H�ܙ\�����YЎLP�P��[�ёQ������HXY\��Y�X�۝�\��Y�Y�H
ԒUP�SPT�T��Ԉ��USX
K���][ۘ[H^[�����Y�ۙ�\�X][ۈ�]ۈ[�[X[�]ܞH\��[][ۈ\����Y����
���\��[��ݙ\��YH�[��\�����H�ܙ\��\��Yѐ���[�ё���P���H��N�\�^\�[�\�X�[ۈYX�[�\�H
K�ˋ��T�M[�X�][ۈH�\��وU��ۙ�][ۈ�K��HX�[ێ�[��Y\�[�[X�YY�\�Y�X�][ۈ�[X�܈
��[�Y�]�]�ZY���\�ȋ���HY�\�Y��[\ܘ\�H��XYZ[�\��][ۈ[ۚ]ܙY�H��\Y�][�[X��ۚX��Yۘ]\�HS��Y[������]Y[��[�X�[�[��\�
�^YXY\�B�H��\X�ܚYܛ�\[�΂�H]Y[�Y[�]H
�[YH[�M\��T���][ۘ[Q�^�Y�JK��H�][�	�Y]�X�ΈZY��ZY�[��[�[]Y
��P��\���J��
K�ˋ��N�K�p���P��\�X
HZ\�Y�]ܐ��Qє�[�X�[\�����H[\��H��\��Y[Y��
��V�ёQ����H^V�ЎLP�P�H�ܙ\�V�ю�M�WX
H�]ݙ\���\]Z[[���X�Y�X��XX�[ۈ\\�
K�ˋ�[�X�[[�H[�\[^\ȊK�������[�X�[�Y�\�	��]\��\H[܈��[�Y^�������]��L\\��\�H\N��H�SQUQ���Y��M�܈�ٝ[Y\�[Y\���HT�ԑTS��X�[X�\��M����X��ܛ�[��]�\��[��X�ۋ��HS��P�Ӑ�SQ��]H͍���][�K��HQ��T��QQ�Y\�YЎLP�P��[�]�]H^
K�ˋ[��[[�\\�[��[�Y�K�������ܛH�۝���	�[�]�Y[H^X�]Y�X�۝�\��ܙ\��
�БQLX
K̜ZY��܈Y�[��]K��H���\��[��Έ���Y�����]ٙ��]��H�[Y][ۈ�]\��\X�H�[�\��ܙ\���]K�\ЎLP�P�
\��܊H܈��M�
�\�Y�YY
K