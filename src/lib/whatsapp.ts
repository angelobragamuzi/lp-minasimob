import { site } from '../config/site';
import type { Imovel } from '../types/property';
import { finalidadeLabel } from './format';

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

const noBairro = (bairro: string) => (bairro === 'Centro' ? 'no Centro' : `no bairro ${bairro}`);

export function propertyMessage(p: Imovel, pageUrl?: string): string {
  const base =
    `Olá! Tenho interesse no imóvel ${p.id}, ${p.titulo} ${noBairro(p.bairro)} ` +
    `(${finalidadeLabel[p.finalidade].toLowerCase()}), que encontrei no site da ${site.nome}. ` +
    'Poderia me informar a disponibilidade?';
  return pageUrl ? `${base}\n\n${pageUrl}` : base;
}

export const generalMessage = `Olá! Encontrei o site da ${site.nome} e gostaria de atendimento sobre imóveis em ${site.cidade}.`;

export function absoluteUrl(path: string): string {
  const origin = site.urlPublica || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}${path}`;
}
