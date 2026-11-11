import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { instagramUrl, site } from '../config/site';
import { generalMessage } from '../lib/whatsapp';
import { InstagramIcon } from './Icons';
import { WhatsAppButton } from './WhatsAppButton';

export function Header() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const finalidade = pathname === '/' ? params.get('finalidade') ?? '' : null;

  const nav = [
    { to: '/', label: 'Imóveis', active: finalidade === '' },
    { to: '/?finalidade=venda', label: 'Comprar', active: finalidade === 'venda' },
    { to: '/?finalidade=aluguel', label: 'Alugar', active: finalidade === 'aluguel' },
  ];

  return (
    <header className="site-header">
      {site.modoDemonstracao && (
        <p className="demo-bar">
          <strong>Demonstração.</strong> Os imóveis, valores e fotos deste site são fictícios e ilustrativos — não são
          ofertas reais.
        </p>
      )}
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${site.nome} — página inicial`}>
          <img src="/assets/minas-logo.png" alt={site.nome} width={150} height={150} />
        </Link>

        <nav className="main-nav" aria-label="Principal">
          {nav.map((item) => (
            <Link key={item.label} to={item.to} className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="nav-instagram" aria-label={`Instagram @${site.instagramUsuario} (abre em nova aba)`}>
            <InstagramIcon size={16} />
            <span>Instagram</span>
          </a>
        </nav>

        <WhatsAppButton message={generalMessage} label="WhatsApp" variant="compact" className="header-wa" ariaLabel="Falar com a Minas Imobiliária pelo WhatsApp" />
      </div>
    </header>
  );
}
