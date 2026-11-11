import { useEffect, useId, useRef, useState } from 'react';
import type { Filters } from '../lib/filters';
import { areaOptions, priceSteps, quartosOptions } from '../lib/filters';
import { formatShortBRL, tipoLabel } from '../lib/format';
import type { TipoImovel } from '../types/property';
import { SearchIcon, SlidersIcon } from './Icons';

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  tipos: TipoImovel[];
  bairros: string[];
  resultCount: number;
  activeCount: number;
}

const finalidades: { value: Filters['finalidade']; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'venda', label: 'Comprar' },
  { value: 'aluguel', label: 'Alugar' },
];

const toNum = (v: string) => (v ? Number(v) : null);

export function SearchFilters({ filters, onChange, onReset, tipos, bairros, resultCount, activeCount }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(filters.q);
  const enviado = useRef(filters.q);

  // Sincroniza o campo apenas quando a URL muda por outro motivo ("Limpar filtros", voltar do navegador)
  useEffect(() => {
    if (filters.q !== enviado.current) {
      enviado.current = filters.q;
      setQ(filters.q);
    }
  }, [filters.q]);

  // Busca com pequeno atraso para não reescrever a URL a cada tecla
  useEffect(() => {
    if (q === filters.q) return;
    const t = window.setTimeout(() => {
      enviado.current = q;
      onChange({ q });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const steps = priceSteps(filters.finalidade);
  const advancedCount = activeCount - (filters.finalidade ? 1 : 0) - (filters.q.trim() ? 1 : 0);

  return (
    <section className="search-panel" aria-label="Buscar imóveis">
      <div className="search-row">
        <div className="segmented" role="group" aria-label="Finalidade">
          {finalidades.map((f) => (
            <button
              key={f.label}
              type="button"
              aria-pressed={filters.finalidade === f.value}
              onClick={() => onChange({ finalidade: f.value })}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form
          className="search-field"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            enviado.current = q;
            onChange({ q });
          }}
        >
          <label htmlFor={`${id}-q`} className="sr-only">
            Buscar por nome, bairro ou código
          </label>
          <SearchIcon className="search-icon" />
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Bairro, tipo ou código"
            title="Busque por bairro, tipo de imóvel ou código de referência (ex.: MIN-004)"
            autoComplete="off"
            enterKeyHint="search"
          />
        </form>

        <button
          type="button"
          className="btn btn-outline filters-toggle"
          aria-expanded={open}
          aria-controls={`${id}-adv`}
          onClick={() => setOpen((o) => !o)}
        >
          <SlidersIcon />
          <span>Filtros{advancedCount > 0 ? ` (${advancedCount})` : ''}</span>
        </button>
      </div>

      <div id={`${id}-adv`} className={`filters-grid ${open ? 'is-open' : ''}`}>
        <div className="field">
          <label htmlFor={`${id}-tipo`}>Tipo</label>
          <select id={`${id}-tipo`} value={filters.tipo} onChange={(e) => onChange({ tipo: e.target.value as Filters['tipo'] })}>
            <option value="">Todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {tipoLabel[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${id}-bairro`}>Bairro</label>
          <select id={`${id}-bairro`} value={filters.bairro} onChange={(e) => onChange({ bairro: e.target.value })}>
            <option value="">Todos</option>
            {bairros.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${id}-pmin`}>Preço mínimo</label>
          <select id={`${id}-pmin`} value={filters.precoMin ?? ''} onChange={(e) => onChange({ precoMin: toNum(e.target.value) })}>
            <option value="">Sem mínimo</option>
            {steps.map((v) => (
              <option key={v} value={v} disabled={filters.precoMax != null && v > filters.precoMax}>
                {formatShortBRL(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${id}-pmax`}>Preço máximo</label>
          <select id={`${id}-pmax`} value={filters.precoMax ?? ''} onChange={(e) => onChange({ precoMax: toNum(e.target.value) })}>
            <option value="">Sem máximo</option>
            {steps.map((v) => (
              <option key={v} value={v} disabled={filters.precoMin != null && v < filters.precoMin}>
                {formatShortBRL(v)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${id}-quartos`}>Quartos</label>
          <select id={`${id}-quartos`} value={filters.quartos ?? ''} onChange={(e) => onChange({ quartos: toNum(e.target.value) })}>
            <option value="">Qualquer</option>
            {quartosOptions.map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${id}-area`}>Área mínima</label>
          <select id={`${id}-area`} value={filters.areaMin ?? ''} onChange={(e) => onChange({ areaMin: toNum(e.target.value) })}>
            <option value="">Qualquer</option>
            {areaOptions.map((n) => (
              <option key={n} value={n}>
                {n} m²+
              </option>
            ))}
          </select>
        </div>

        <div className="filters-actions">
          <button type="button" className="btn btn-link" onClick={onReset} disabled={activeCount === 0}>
            Limpar filtros
          </button>
          <button type="button" className="btn btn-dark filters-apply" onClick={() => setOpen(false)}>
            Ver {resultCount} {resultCount === 1 ? 'imóvel' : 'imóveis'}
          </button>
        </div>
      </div>
    </section>
  );
}
