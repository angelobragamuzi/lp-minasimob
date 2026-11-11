import { Link } from 'react-router-dom';
import { propertyPath } from '../data/repository';
import { finalidadeLabel, formatBRL, formatPrice, tipoLabel } from '../lib/format';
import type { Imovel } from '../types/property';
import { SmartImage } from './SmartImage';
import { Specs } from './Specs';

interface Props {
  imovel: Imovel;
  eager?: boolean;
}

export function PropertyCard({ imovel: p, eager }: Props) {
  const href = propertyPath(p);
  const capa = p.fotos[0];

  return (
    <article className="card">
      <div className="card-media">
        {capa ? (
          <SmartImage
            src={capa.src}
            alt={capa.alt}
            width={800}
            widths={[480, 800, 1100]}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            eager={eager}
          />
        ) : (
          <div className="img-fallback" role="img" aria-label="Sem fotos">
            <span>Sem fotos</span>
          </div>
        )}
        <span className={`badge badge-${p.finalidade}`}>{finalidadeLabel[p.finalidade].toUpperCase()}</span>
        {p.status === 'reservado' && <span className="badge badge-status">Reservado</span>}
        {p.fotos.length > 1 && <span className="photo-count">{p.fotos.length} fotos</span>}
      </div>

      <div className="card-body">
        <p className="card-kicker">
          {tipoLabel[p.tipo]} · {p.bairro}
        </p>
        <h3 className="card-title">
          <Link to={href} className="stretched">
            {p.titulo}
          </Link>
        </h3>
        <p className="card-location">
          {p.bairro}, {p.cidade} – {p.uf}
        </p>

        <Specs imovel={p} compact />

        <div className="card-footer">
          <div>
            <p className="price">{formatPrice(p)}</p>
            {p.condominio ? <p className="price-extra">Cond. {formatBRL(p.condominio)}</p> : null}
          </div>
          <div className="card-ref">
            <span className="ref">{p.id}</span>
            <span className="card-cta" aria-hidden="true">
              Ver imóvel
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
