import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function NotFoundPage({ message = 'A página que você procurou não existe.' }: { message?: string }) {
  useDocumentMeta(`Página não encontrada | ${site.nome}`);
  return (
    <main id="conteudo" className="container">
      <div className="empty empty-page">
        <h1>Página não encontrada</h1>
        <p>{message}</p>
        <Link to="/" className="btn btn-dark">
          Ver imóveis disponíveis
        </Link>
      </div>
    </main>
  );
}
