export type Finalidade = 'venda' | 'aluguel';

export type TipoImovel =
  | 'casa'
  | 'apartamento'
  | 'cobertura'
  | 'terreno'
  | 'sala-comercial'
  | 'loja';

export type StatusImovel = 'disponivel' | 'reservado' | 'vendido' | 'alugado';

export interface FotoImovel {
  /** URL base da foto. Pode ser um CDN com redimensionamento (ver lib/images.ts) ou um caminho local. */
  src: string;
  alt: string;
}

export interface Imovel {
  /** Código de referência exibido ao cliente, ex.: MIN-001 */
  id: string;
  /** Parte legível da URL. A rota final é /imovel/{slug} */
  slug: string;
  titulo: string;
  finalidade: Finalidade;
  tipo: TipoImovel;
  /** Venda: valor total. Aluguel: valor mensal. Em reais. */
  preco: number;
  condominio?: number;
  iptu?: number;
  bairro: string;
  cidade: string;
  uf: string;
  /** Área em m². Para casas, área construída; para terrenos, área do lote. */
  area: number;
  areaTerreno?: number;
  quartos: number;
  suites?: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  caracteristicas: string[];
  fotos: FotoImovel[];
  destaque: boolean;
  status: StatusImovel;
  /** ISO date — usado na ordenação "mais recentes" */
  publicadoEm: string;
  /** true = anúncio de demonstração, não é oferta real */
  demonstrativo: boolean;
}
