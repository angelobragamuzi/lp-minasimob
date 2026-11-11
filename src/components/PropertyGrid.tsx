import type { Imovel } from '../types/property';
import { PropertyCard } from './PropertyCard';

interface Props {
  items: Imovel[];
  loading?: boolean;
}

export function PropertyGrid({ items, loading }: Props) {
  if (loading) {
    return (
      <div className="grid" aria-busy="true" aria-label="Carregando imóveis">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card card-skeleton" aria-hidden="true">
            <div className="card-media" />
            <div className="card-body">
              <div className="sk sk-sm" />
              <div className="sk sk-lg" />
              <div className="sk sk-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((p, i) => (
        <PropertyCard key={p.id} imovel={p} eager={i < 3} />
      ))}
    </div>
  );
}
