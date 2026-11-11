import type { Imovel } from '../types/property';
import { properties } from './properties';

/**
 * Camada de acesso aos imóveis. Hoje lê o arquivo local; para conectar a um
 * painel administrativo, troque a implementação destas funções por chamadas à API
 * mantendo as mesmas assinaturas.
 */
const visiveis = (lista: Imovel[]) =>
  lista.filter((p) => p.status === 'disponivel' || p.status === 'reservado');

export async function listProperties(): Promise<Imovel[]> {
  return visiveis(properties);
}

/** Aceita o slug completo (min-001-casa-3-quartos-centro) ou apenas o código (min-001). */
export async function getProperty(slugOrCode: string): Promise<Imovel | undefined> {
  const key = slugOrCode.toLowerCase();
  return visiveis(properties).find(
    (p) => propertyPath(p).endsWith(`/${key}`) || p.id.toLowerCase() === key || key.startsWith(`${p.id.toLowerCase()}-`),
  );
}

export function propertyPath(p: Imovel): string {
  return `/imovel/${p.id.toLowerCase()}-${p.slug}`;
}
