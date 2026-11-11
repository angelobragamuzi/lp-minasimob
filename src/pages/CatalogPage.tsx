import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyGrid } from '../components/PropertyGrid';
import { SearchFilters } from '../components/SearchFilters';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { site } from '../config/site';
import { listProperties } from '../data/repository';
import { useAsync } from '../hooks/useAsync';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { Filters } from '../lib/filters';
import {
  activeFilterChips,
  applyFilters,
  emptyFilters,
  filtersFromParams,
  filtersToParams,
  searchSummary,
  sortOptions,
} from '../lib/filters';
import type { TipoImovel } from '../types/property';

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const state = useAsync(listProperties, []);
  const all = state.status === 'ready' ? state.data : [];

  // Opções de tipo e bairro limitadas ao que existe na finalidade escolhida (mantendo a seleção atual)
  const base = useMemo(() => all.filter((p) => !filters.finalidade || p.finalidade === filters.finalidade), [all, filters.finalidade]);
  const tipos = useMemo(() => {
    const set = new Set<TipoImovel>(base.map((p) => p.tipo));
    if (filters.tipo) set.add(filters.tipo);
    return [...set].sort();
  }, [base, filters.tipo]);
  const bairros = useMemo(() => {
    const set = new Set(base.map((p) => p.bairro));
    if (filters.bairro) set.add(filters.bairro);
    return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [base, filters.bairro]);
  const results = useMemo(() => applyFilters(all, filters), [all, filters]);
  const chips = activeFilterChips(filters);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...filters, ...patch };
      // Faixas de preço de venda e aluguel são diferentes: ao trocar a finalidade, zera o preço.
      if ('finalidade' in patch && patch.finalidade !== filters.finalidade) {
        next.precoMin = null;
        next.precoMax = null;
      }
      setParams(filtersToParams(next), { replace: 'q' in patch });
    },
    [filters, setParams],
  );

  const reset = () => setParams(filtersToParams({ ...emptyFilters, ordem: filters.ordem }));

  const heading =
    filters.finalidade === 'venda'
      ? `Imóveis à venda em ${site.cidade}`
      : filters.finalidade === 'aluguel'
        ? `Imóveis para alugar em ${site.cidade}`
        : `Imóveis disponíveis em ${site.cidade}`;

  useDocumentMeta(
    `${heading} | ${site.nome}`,
    `Consulte casas, apartamentos, terrenos e salas ${
      filters.finalidade === 'aluguel' ? 'para alugar' : filters.finalidade === 'venda' ? 'à venda' : 'para comprar ou alugar'
    } em ${site.cidade}–${site.uf} com a ${site.nome}.`,
  );

  const count = results.length;

  return (
    <main id="conteudo" className="container catalog">
      <h1 className="page-title">{heading}</h1>

      <SearchFilters
        filters={filters}
        onChange={update}
        onReset={reset}
        tipos={tipos}
        bairros={bairros}
        resultCount={count}
        activeCount={chips.length}
      />

      <div className="results-bar">
        <p className="results-count" aria-live="polite">
          {state.status === 'loading' ? 'Carregando…' : `${count} ${count === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`}
        </p>
        <div className="sort">
          <label htmlFor="ordem">Ordenar</label>
          <select id="ordem" value={filters.ordem} onChange={(e) => update({ ordem: e.target.value as Filters['ordem'] })}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="chips" aria-label="Filtros ativos">
          {chips.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                className="chip"
                onClick={() => update({ [c.key]: emptyFilters[c.key] } as Partial<Filters>)}
                aria-label={`Remover filtro ${c.label}`}
              >
                {c.label} <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {state.status === 'error' ? (
        <div className="empty">
          <h2>Não foi possível carregar os imóveis.</h2>
          <p>Atualize a página ou fale com a equipe pelo WhatsApp.</p>
        </div>
      ) : state.status === 'ready' && count === 0 ? (
        <div className="empty">
          <h2>Nenhum imóvel encontrado com esses filtros.</h2>
          <p>
            Remova algum filtro acima ou peça à equipe da {site.nome}: nem todos os imóveis disponíveis estão publicados
            no site.
          </p>
          <div className="empty-actions">
            <button type="button" className="btn btn-dark" onClick={reset}>
              Limpar filtros
            </button>
            <WhatsAppButton
              variant="outline"
              label="Pedir pelo WhatsApp"
              message={`Olá! Estou procurando ${searchSummary(filters)} em ${site.cidade}. Vocês têm alguma opção?`}
            />
          </div>
        </div>
      ) : (
        <PropertyGrid items={results} loading={state.status === 'loading'} />
      )}
    </main>
  );
}
