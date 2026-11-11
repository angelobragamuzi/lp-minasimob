import { Navigate, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PropertyPage } from './pages/PropertyPage';

export function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/comprar" element={<Navigate to="/?finalidade=venda" replace />} />
        <Route path="/alugar" element={<Navigate to="/?finalidade=aluguel" replace />} />
        <Route path="/imovel/:slug" element={<PropertyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}
