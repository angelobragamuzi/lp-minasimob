import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PriceBox, PropertyDetails, PropertyHeader } from '../components/PropertyDetails';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyGrid } from '../components/PropertyGrid';
import { site } from '../config/site';
import { getProperty, listProperties, propertyPath } from '../data/repository';
import { useAsync } from '../hooks/useAsync';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatPrice } from '../lib/format';
import { imageUrl } from '../lib/images';
import type { Imovel } from '../types/property';
import { NotFoundPage } from './NotFoundPage';

/** Mesma finalidade; prioriza mesmo tipo, depois mesmo bairro, depois preço próximo. */
function similares(atual: Imovel, todos: Imovel[], limite = 3): Imovel[] {
  return todos
    .filter((p) => p.id !== atual.id && p.finalidade === atual.finalidade)
    .map((p) => ({
      p,
      score:
        (p.tipo === atual.tipo ? 4 : 0) +
        (p.bairro === atual.bairro ? 2 : 0) +
        (Math.abs(p.preco - atual.preco) / atual.preco < 0.35 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((x) => x.p);
}

export function PropertyPage() {
  const { slug = '' } = useParams();
  const state = useAsync(async () => {
    const [imovel, todos] = await Promise.all([getProperty(slug), listProperties()]);
    return { imovel, todos };
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const imovel = state.status === 'ready' ? state.data.imovel : undefined;
  const relacionados = useMemo(
    () => (state.status === 'ready' && imovel ? similares(imovel, state.data.todos) : []),
    [state, imovel],
  );

  useDocumentMeta(
    imovel ? `${imovel.titulo} – ${imovel.bairro}, ${imovel.cidade} · ${imovel.id} | ${site.nome}` : site.nome,
    imovel ? `${formatPrice(imovel)} · ${imovel.descricao.slice(0, 140)}` : undefined,
    imovel?.fotos[0] ? imageUrl(imovel.fotos[0].src, 1200) : undefined,
  );

  if (state.status === 'loading') {
    return (
      <main id="conteudo" className="container property" aria-busy="true">
        <div className="property-skeleton" />
      </main>
    );
  }
  if (!imovel) return <NotFoundPage message="Este imóvel não está mais disponível ou o link está incorreto." />;

  const path = propertyPath(imovel);
  // Normaliza a URL (ex.: /imovel/min-001 -> /imovel/min-001-casa-3-quartos-centro)
  if (`/imovel/${slug.toLowerCase()}` !== path) return <Navigate to={path} replace />;

  const voltar = imovel.finalidade === 'venda' ? '/?finalidade=venda' : '/?finalidade=aluguel';

  return (
    <main id="conteudo" className="container property">
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Imóveis</Link>
        <span aria-hidden="true">/</span>
        <Link to={voltar}>{imovel.finalidade === 'venda' ? 'Comprar' : 'Alugar'}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{imovel.id}</span>
      </nav>

      <div className="property-layout">
        <div className="area-head">
          <PropertyHeader imovel={imovel} />
        </div>
        <div className="area-gallery">
          <PropertyGallery fotos={imovel.fotos} titulo={imovel.titulo} />
        </div>
        <div className="area-side">
          <PriceBox imovel={imovel} path={path} />
        </div>
        <div className="area-details">
          <PropertyDetails imovel={imovel} />
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="related" aria-labelledby="semelhantes">
          <div className="related-head">
            <h2 id="semelhantes">Imóveis semelhantes</h2>
            <Link to={voltar} className="btn btn-link">
              Ver todos para {imovel.finalidade === 'venda' ? 'comprar' : 'alugar'}
            </Link>
          </div>
          <PropertyGrid items={relacionados} />
        </section>
      )}
    </main>
  );
}
