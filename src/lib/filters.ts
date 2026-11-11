import type { Finalidade, Imovel, TipoImovel } from '../types/property';
import { finalidadeLabel, formatShortBRL, normalize, tipoLabel } from './format';

export type SortKey = 'recentes' | 'menor-preco' | 'maior-preco' | 'maior-area';

export interface Filters {
  q: string;
  finalidade: Finalidade | '';
  tipo: TipoImovel | '';
  bairro: string;
  precoMin: number | null;
  precoMax: number | null;
  quartos: number | null;
  areaMin: number | null;
  ordem: SortKey;
}

export const emptyFilters: Filters = {
  q: '',
  finalidade: '',
  tipo: '',
  bairro: '',
  precoMin: null,
  precoMax: null,
  quartos: null,
  areaMin: null,
  ordem: 'recentes',
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'maior-area', label: 'Maior área' },
];

const PRECO_VENDA = [100_000, 200_000, 300_000, 400_000, 500_000, 750_000, 1_000_000, 1_500_000];
const PRECO_ALUGUEL = [800, 1_000, 1_500, 2_000, 3_000, 5_000];

export function priceSteps(finalidade: Filters['finalidade']): number[] {
  if (finalidade === 'venda') return PRECO_VENDA;
  if (finalidade === 'aluguel') return PRECO_ALUGUEL;
  return [...PRECO_ALUGUEL, ...PRECO_VENDA];
}

export const quartosOptions = [1, 2, 3, 4];
export const areaOptions = [40, 60, 90, 120, 200, 300];

/* ---------- URL <-> filtros ---------- */

const num = (v: string | null) => {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const isFinalidade = (v: string | null): v is Finalidade => v === 'venda' || v === 'aluguel';
const isTipo = (v: string | null): v is TipoImovel => !!v && v in tipoLabel;
const isSort = (v: string | null): v is SortKey => sortOptions.some((o) => o.value === v);

export function filtersFromParams(params: URLSearchParams): Filters {
  const f = params.get('finalidade');
  const t = params.get('tipo');
  const o = params.get('ordem');
  return {
    q: params.get('q') ?? '',
    finalidade: isFinalidade(f) ? f : '',
    tipo: isTipo(t) ? t : '',
    bairro: params.get('bairro') ?? '',
    precoMin: num(params.get('precoMin')),
    precoMax: num(params.get('precoMax')),
    quartos: num(params.get('quartos')),
    areaMin: num(params.get('areaMin')),
    ordem: isSort(o) ? o : 'recentes',
  };
}

export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q);
  if (f.finalidade) p.set('finalidade', f.finalidade);
  if (f.tipo) p.set('tipo', f.tipo);
  if (f.bairro) p.set('bairro', f.bairro);
  if (f.precoMin) p.set('precoMin', String(f.precoMin));
  if (f.precoMax) p.set('precoMax', String(f.precoMax));
  if (f.quartos) p.set('quartos', String(f.quartos));
  if (f.areaMin) p.set('areaMin', String(f.areaMin));
  if (f.ordem !== 'recentes') p.set('ordem', f.ordem);
  return p;
}

/* ---------- aplicação ---------- */

function matchesQuery(p: Imovel, q: string): boolean {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const digits = p.id.replace(/\D/g, '');
  const haystack = normalize(
    [p.id, p.titulo, p.bairro, p.cidade, tipoLabel[p.tipo], finalidadeLabel[p.finalidade], ...p.caracteristicas].join(' '),
  );
  return terms.every((t) => {
    // "001", "min001" ou "min-1" também encontram MIN-001
    const semPrefixo = t.replace(/^min-?/, '');
    const pareceCodigo = /^\d+$/.test(semPrefixo) && (t.startsWith('min') || semPrefixo.length >= 3);
    if (pareceCodigo && Number(semPrefixo) === Number(digits)) return true;
    return haystack.includes(t);
  });
}

export function applyFilters(list: Imovel[], f: Filters): Imovel[] {
  const result = list.filter((p) => {
    if (f.finalidade && p.finalidade !== f.finalidade) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (f.bairro && p.bairro !== f.bairro) return false;
    if (f.precoMin && p.preco < f.precoMin) return false;
    if (f.precoMax && p.preco > f.precoMax) return false;
    if (f.quartos && p.quartos < f.quartos) return false;
    if (f.areaMin && p.area < f.areaMin) return false;
    return matchesQuery(p, f.q);
  });

  const sorters: Record<SortKey, (a: Imovel, b: Imovel) => number> = {
    recentes: (a, b) => b.publicadoEm.localeCompare(a.publicadoEm),
    'menor-preco': (a, b) => a.preco - b.preco,
    'maior-preco': (a, b) => b.preco - a.preco,
    'maior-area': (a, b) => b.area - a.area,
  };
  return result.sort(sorters[f.ordem]);
}

/** Lista de filtros ativos, para chips removíveis e para o estado vazio. */
export function activeFilterChips(f: Filters): { key: keyof Filters; label: string }[] {
  const chips: { key: keyof Filters; label: string }[] = [];
  if (f.q.trim()) chips.push({ key: 'q', label: `“${f.q.trim()}”` });
  if (f.finalidade) chips.push({ key: 'finalidade', label: f.finalidade === 'venda' ? 'Comprar' : 'Alugar' });
  if (f.tipo) chips.push({ key: 'tipo', label: tipoLabel[f.tipo] });
  if (f.bairro) chips.push({ key: 'bairro', label: f.bairro });
  if (f.precoMin) chips.push({ key: 'precoMin', label: `A partir de ${formatShortBRL(f.precoMin)}` });
  if (f.precoMax) chips.push({ key: 'precoMax', label: `Até ${formatShortBRL(f.precoMax)}` });
  if (f.quartos) chips.push({ key: 'quartos', label: `${f.quartos}+ quartos` });
  if (f.areaMin) chips.push({ key: 'areaMin', label: `${f.areaMin}+ m²` });
  return chips;
}

export function searchSummary(f: Filters): string {
  const partes: string[] = [];
  partes.push(f.tipo ? tipoLabel[f.tipo].toLowerCase() : 'imóvel');
  if (f.finalidade) partes.push(f.finalidade === 'venda' ? 'para comprar' : 'para alugar');
  if (f.bairro) partes.push(`no bairro ${f.bairro}`);
  if (f.quartos) partes.push(`com ${f.quartos} ou mais quartos`);
  if (f.precoMax) partes.push(`até ${formatShortBRL(f.precoMax)}`);
  return partes.join(' ');
}
