import { Link } from 'react-router-dom';
import { instagramUrl, site } from '../config/site';
import { generalMessage, whatsappUrl } from '../lib/whatsapp';

export function Footer() {
  const { endereco } = site;
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${endereco.logradouro}, ${endereco.cidade} - ${endereco.uf}`,
  )}`;

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-brand" aria-label={`${site.nome} — página inicial`}>
          <img src="/assets/minas-logo.png" alt={site.nome} width={150} height={150} loading="lazy" />
        </Link>

        <address className="footer-col">
          <strong>{site.nome}</strong>
          <a href={mapa} target="_blank" rel="noopener noreferrer">
            {endereco.logradouro}
            <br />
            {endereco.cidade}–{endereco.uf}
          </a>
        </address>

        <div className="footer-col">
          <strong>Atendimento</strong>
          <a href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer">
            WhatsApp {site.telefoneExibicao}
          </a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram @{site.instagramUsuario}
          </a>
        </div>

        <nav className="footer-col" aria-label="Rodapé">
          <strong>Imóveis</strong>
          <Link to="/?finalidade=venda">Comprar</Link>
          <Link to="/?finalidade=aluguel">Alugar</Link>
        </nav>
      </div>
      <div className="container footer-legal">
        <span>© {new Date().getFullYear()} {site.nome}</span>
        {site.modoDemonstracao && <span>Versão de demonstração — anúncios fictícios.</span>}
      </div>
    </footer>
  );
}
