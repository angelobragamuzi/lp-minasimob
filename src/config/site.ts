/**
 * Configuração institucional. Edite aqui antes de publicar.
 *
 * PENDENTE DE VALIDAÇÃO COM A IMOBILIÁRIA:
 *  - whatsapp: número obtido em diretório público (+55 33 3321-5824).
 *    Confirmar se recebe WhatsApp; se não, trocar pelo celular do atendimento.
 *  - instagram: confirmar o perfil oficial.
 *  - endereco: confirmar endereço comercial.
 */
export const site = {
  nome: 'Minas Imobiliária',
  cidade: 'Caratinga',
  uf: 'MG',
  /** Somente dígitos, com DDI e DDD. */
  whatsapp: '553333215824',
  telefoneExibicao: '(33) 3321-5824',
  instagramUsuario: 'minas_imobiliaria',
  endereco: {
    logradouro: 'Travessa Coronel Santos Mestres, 97, sala 02',
    cidade: 'Caratinga',
    uf: 'MG',
  },
  /** URL pública do site (usada nos links enviados pelo WhatsApp). Vazio = usa o domínio atual. */
  urlPublica: '',
  /**
   * Enquanto true, o site exibe o aviso de que os imóveis são fictícios.
   * Desligue apenas quando o catálogo contiver somente anúncios reais.
   */
  modoDemonstracao: true,
} as const;

export const instagramUrl = `https://www.instagram.com/${site.instagramUsuario}/`;
