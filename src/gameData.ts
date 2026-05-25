// ============================================================
// GAME DATA - Easy to edit: candidates, proposals, categories
// ============================================================

export type CategoryKey = 'salud' | 'economia' | 'seguridad' | 'educacion' | 'ambiental';

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
  image: string; // path relative to /public
  color: string; // tailwind bg class
  hex: string;   // raw hex for inline styles
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
    key: 'educacion',
    label: 'Educación',
    icon: 'BookOpen',
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
    color: 'bg-[#F5C800]',
    hex: '#F5C800',
    proposals: {
      salud:
        'Prioriza gestión eficiente, menos burocracia y acceso más rápido con participación del sector privado.',
      economia:
        'Libre mercado, empresa privada fuerte, atraer inversión y reducir presión estatal sobre sectores productivos.',
      seguridad:
        'Mano dura, fortalecimiento institucional y combate fuerte contra criminalidad.',
      educacion:
        'Educación con enfoque en competitividad, mérito y fortalecimiento de habilidades útiles para empleo.',
      ambiental:
        'Protección ambiental sin frenar sectores económicos estratégicos.',
    },
  },
  {
    id: 2,
    name: 'Roy Barreras',
    image: 'candidates/WhatsApp_Image_2026-05-24_at_7.05.34_PM.jpeg',
    color: 'bg-[#D91E18]',
    hex: '#D91E18',
    proposals: {
      salud:
        'Mantener cobertura pero mejorar gestión, más prevención y fortalecer personal médico.',
      economia:
        'Reactivar economía con infraestructura, empleo y atraer inversión sin romper programas sociales.',
      seguridad:
        'Seguridad tecnológica: drones, cámaras conectadas y reforma institucional.',
      educacion:
        'Educación conectada al empleo, formación práctica y acceso ampliado.',
      ambiental:
        'Equilibrio entre sostenibilidad y desarrollo económico; transición gradual.',
    },
  },
  {
    id: 3,
    name: 'Santiago Botero',
    image: 'candidates/WhatsApp_Image_2026-05-24_at_7.06.20_PM.jpeg',
    color: 'bg-[#1A3A8F]',
    hex: '#1A3A8F',
    proposals: {
      salud:
        'Enfatiza eficiencia del sistema, reducir trámites y enfoque de administración más austera.',
      economia:
        'Más libertad económica, impulso al emprendimiento y reducción de intervención estatal.',
      seguridad:
        'Estado más fuerte frente al delito y énfasis en autoridad.',
      educacion:
        'Formación enfocada en productividad y preparación para mercado laboral.',
      ambiental:
        'Desarrollo económico con menor carga regulatoria ambiental.',
    },
  },
];
