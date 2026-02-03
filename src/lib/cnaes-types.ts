export interface CNAE {
  cnae: string;
  descricao: string;
  anexo: 'I' | 'II' | 'III' | 'IV' | 'V';
  fator_r: 'Sim' | 'Não';
  aliquota: string;
}

export type AnexoType = 'I' | 'II' | 'III' | 'IV' | 'V';

export const ANEXO_COLORS: Record<AnexoType, { bg: string; text: string; border: string }> = {
  'I': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'II': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'III': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'IV': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'V': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

export const ANEXO_BUTTON_COLORS: Record<AnexoType, { active: string; inactive: string }> = {
  'I': { active: 'bg-blue-600 text-white', inactive: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  'II': { active: 'bg-emerald-600 text-white', inactive: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  'III': { active: 'bg-violet-600 text-white', inactive: 'bg-violet-100 text-violet-700 hover:bg-violet-200' },
  'IV': { active: 'bg-orange-600 text-white', inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  'V': { active: 'bg-pink-600 text-white', inactive: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
};
