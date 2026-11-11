import { useState } from 'react';
import { site } from '../config/site';
import { finalidadeLabel, formatBRL, formatPrice, locationLabel, tipoLabel } from '../lib/format';
import { absoluteUrl, propertyMessage } from '../lib/whatsapp';
import type { Imovel } from '../types/property';
import { Specs } from './Specs';
import { WhatsAppButton } from './WhatsAppButton';

interface Props {
  imovel: Imovel;
  path: string;
}

/** Título, tipo, código e localização. */
export function PropertyHeader({ imovel: p }: { imovel: Imovel }) {
  return (
    <header className="details-head">
      <p className="details-kicker">
        <span className={`badge badge-${p.finalidade} badge-inline`}>{finalidadeLabel[p.finalidade].toUpperCase()}</span>
        <span>{tipoLabel[p.tipo]}</span>
        <span className="ref">Cód. {p.id}</span>
      </p>
      <h1 className="details-title">{p.titulo}</h1>
      <p className="details-location">{locationLabel(p)}</p>
    </header>
  );
}

/** Características, descrição, diferenciais e localização. */
export function PropertyDetails({ imovel: p }: { imovel: Imovel }) {
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${p.bairro}, ${p.cidade} - ${p.uf}`,
  )}`;

  return (
    <div className="details">
      <Specs imovel={p} />

      <section className="details-section">
        <h2>Descrição</h2>
        <p>{p.descricao}</p>
      </section>

      {p.caracteristicas.length > 0 && (
        <section className="details-section">
          <h2>Diferenciais</h2>
          <ul className="features">
            {p.caracteristicas.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="details-section">
        <h2>Localização</h2>
        <p>
          <strong>{p.bairro}</strong>, {p.cidade} – {p.uf}
        </p>
        <p className="muted">Localização aproximada. O endereço completo é informado pelo corretor no atendimento.</p>
        <a className="btn btn-outline btn-sm" href={mapa} target="_blank" rel="noopener noreferrer">
          Ver o bairro no mapa
        </a>
      </section>
    </div>
  );
}

/** Cartão de preço e contato (coluna direita, fixo no desktop). */
export function PriceBox({ imovel: p, path }: Props) {
  const [copiado, setCopiado] = useState(false);
  const url = absoluteUrl(path);
  const mensagem = propertyMessage(p, url);

  const compartilhar = async () => {
    const dados = { title: `${p.titulo} — ${p.id}`, url };
    try {
      if (navigator.share) {
        await navigator.share(dados);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* usuário cancelou o compartilhamento */
    }
  };

  return (
    <>
      <aside className="price-box" aria-label="Valores e contato">
        <p className="price-box-label">{p.finalidade === 'venda' ? 'Valor de venda' : 'Aluguel mensal'}</p>
        <p className="price price-lg">{formatPrice(p)}</p>
        {(p.condominio || p.iptu) && (
          <dl className="costs">
            {p.condominio ? (
              <div>
                <dt>Condomínio</dt>
                <dd>{formatBRL(p.condominio)}/mês</dd>
              </div>
            ) : null}
            {p.iptu ? (
              <div>
                <dt>IPTU</dt>
                <dd>
                  {formatBRL(p.iptu)}
                  {p.finalidade === 'aluguel' ? '/mês' : '/ano'}
                </dd>
              </div>
            ) : null}
          </dl>
        )}
        {p.status === 'reservado' && <p className="status-note">Imóvel com proposta em andamento. Consulte a disponibilidade.</p>}

        <WhatsAppButton message={mensagem} label="Tenho interesse" className="btn-block" ariaLabel={`Tenho interesse no imóvel ${p.id}`} />
        <p className="price-box-hint">Abre o WhatsApp com a referência {p.id} já preenchida.</p>

        <button type="button" className="btn btn-link btn-block" onClick={compartilhar}>
          {copiado ? 'Link copiado' : 'Compartilhar imóvel'}
        </button>

        {p.demonstrativo && site.modoDemonstracao && (
          <p className="demo-note">Anúncio fictício de demonstração. Fotos ilustrativas.</p>
        )}
      </aside>

      {/* Barra fixa no celular */}
      <div className="mobile-cta" role="region" aria-label="Contato rápido">
        <div>
          <p className="price">{formatPrice(p)}</p>
          <p className="mobile-cta-ref">{p.id}</p>
        </div>
        <WhatsAppButton message={mensagem} label="Consultar" variant="compact" ariaLabel={`Consultar o imóvel ${p.id} pelo WhatsApp`} />
      </div>
    </>
  );
}
