import type { Finalidade, Imovel, TipoImovel } from '../types/property';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export const formatBRL = (v: number) => brl.format(v);

export function formatPrice(p: Pick<Imovel, 'preco' | 'finalidade'>): string {
  return p.finalidade === 'aluguel' ? `${formatBRL(p.preco)}/mês` : formatBRL(p.preco);
}

/** Rótulo curto para filtros: 150 mil, 1,2 mi, R$ 1.500 */
export function formatShortBRL(v: number): string {
  if (v >= 1_000_000) {
    return `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  }
  if (v >= 10_000) return `R$ ${Math.round(v / 1000)} mil`;
  return formatBRL(v);
}

export const finalidadeLabel: Record<Finalidade, string> = {
  venda: 'Venda',
  aluguel: 'Aluguel',
};

export const tipoLabel: Record<TipoImovel, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  'sala-comercial': 'Sala comercial',
  loja: 'Loja',
};

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export function locationLabel(p: Pick<Imovel, 'bairro' | 'cidade' | 'uf'>): string {
  return `${p.bairro}, ${p.cidade} – ${p.uf}`;
}

/** Remove acentos e caixa para busca */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
