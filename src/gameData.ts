// ============================================================
// GAME DATA - Easy to edit: candidates, proposals, categories
// ============================================================

export type CategoryKey = 'salud' | 'economia' | 'seguridad' | 'social' | 'ambiental';

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string; // lucide-react icon name
  color: string; // tailwind bg color class
  textColor: string;
}

export interface Candidate {
  id: number;
  name: string;
  image: sring; // path relative to /public
  color: string; // accent color for candidate badge
  proposals: Record<CategoryKey, string>;
}

// ── CATEGORIES ──────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  {
    key: 'salud',
    label: 'Salud',
    icon: 'Heart',
    color: 'bg-rose-500',
    textColor: 'text-rose-600',
  },
  {
    key: 'economia',
    label: 'Economía',
    icon: 'TrendingUp',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
  },
  {
    key: 'seguridad',
    label: 'Seguridad',
    icon: 'Shield',
    color: 'bg-blue-600',
    textColor: 'text-blue-700',
  },
  {
    key: 'social',
    label: 'Social',
    icon: 'Users',
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
  },
  {
    key: 'ambiental',
    label: 'Ambiental',
    icon: 'Leaf',
    color: 'bg-green-600',
    textColor: 'text-green-700',
  },
];

// ── CANDIDATES ──────────────────────────────────────────────
export const CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: 'Abelardo de la Espriella',
    image: 'candidates/WhatsApp_Image_2026-05-24_at_7.04.46_PM.jpeg',
    color: 'bg-red-700',
    proposals: {
      salud:
        'Garantizaré acceso universal a la salud con un sistema robusto de atención primaria en todos los municipios del país.',
      economia:
        'Impulsaré la reactivación económica con incentivos a las pymes y reducción de trámites para los nuevos emprendedores.',
      seguridad:
        'Implementaré una política de seguridad ciudadana basada en inteligencia y prevención del delito en las comunidades.',
      social:
        'Crearé programas de vivienda digna para las familias más vulnerables y fortaleceré la educación pública de calidad.',
      ambiental:
        'Promoveré la transición energética con energías renovables y protección de los ecosistemas estratégicos nacionales.',
    },
  },
  {
    id: 2,
    name: 'Roy Barreras',
    image: 'candidates/WhatsApp_Image_2026-05-24_at_7.05.34_PM.jpeg',
    color: 'bg-sky-700',
    proposals: {
      salud:
        'Reformaré el sistema de salud para eliminar las EPS intermediarias y garantizar atención directa y oportuna a todos.',
      economia:
        'Fomentaré la economía popular y el comercio justo, priorizando a los agricultores y pequeños productores locales.',
      seguridad:
        'Apostaré por la paz total y la reinserción social como alternativa real a la violencia en los territorios.',
      social:
        'Ampliaré las transferencias sociales y garantizaré el ingreso mínimo vital para las familias en condición de pobreza.',
      ambiental:
        'Lideraré una agenda ambiental ambiciosa con moratoria a la minería en páramos y protección de la biodiversidad.',
    },
  },
  {
    id: 3,
    name: 'Santiago Botero',
    image: 'candidates/WhatsApp_Image_2026-05-24_at_7.06.20_PM.jpeg',
    color: 'bg-orange-600',
    proposals: {
      salud:
        'Modernizaré la infraestructura hospitalaria e impulsaré la medicina preventiva con tecnología e innovación social.',
      economia:
        'Atraeré inversión extranjera responsable y desarrollaré el sector tecnológico para generar empleos de calidad.',
      seguridad:
        'Fortalaceré las fuerzas de seguridad del Estado con equipamiento moderno y formación en derechos humanos.',
      social:
        'Invertí en educación técnica y superior gratuita para que los jóvenes accedan a oportunidades de desarrollo real.',
      ambiental:
        'Impulsaré la economía circular y proyectos de reforestación masiva para combatir el cambio climático en Colombia.',
    },
  },
];
