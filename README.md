# Minas Imobiliária — catálogo de imóveis

Catálogo de imóveis da Minas Imobiliária (Caratinga–MG). React + TypeScript + Vite.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Antes de publicar

| Item | Onde | Situação |
| --- | --- | --- |
| Número de WhatsApp | `src/config/site.ts` → `whatsapp` | `+55 33 3321-5824` veio de diretório público. **Confirmar se recebe WhatsApp.** |
| Instagram | `src/config/site.ts` → `instagramUsuario` | `@minas_imobiliaria` — **confirmar o perfil.** |
| Endereço | `src/config/site.ts` → `endereco` | Travessa Coronel Santos Mestres, 97, sala 02 — **confirmar.** |
| Anúncios | `src/data/properties.ts` | **Todos fictícios.** Substituir pelos imóveis reais. |
| Aviso de demonstração | `src/config/site.ts` → `modoDemonstracao` | Mudar para `false` só quando restarem apenas anúncios reais. |
| Logotipo | `public/assets/minas-logo.png` | Arquivo original fornecido (150×150 px). Uma versão maior ou em SVG melhora a nitidez. |
| Domínio | `src/config/site.ts` → `urlPublica` | Preencher com o domínio final para os links enviados no WhatsApp. |

## Rotas

- `/` — catálogo. Filtros ficam na URL (`?finalidade=venda&tipo=casa&bairro=Centro&precoMax=500000…`), então qualquer busca pode ser compartilhada.
- `/?finalidade=venda` e `/?finalidade=aluguel` — Comprar e Alugar (`/comprar` e `/alugar` redirecionam).
- `/imovel/{codigo}-{slug}` — página do imóvel, ex.: `/imovel/min-001-casa-3-quartos-centro`. O link só com o código (`/imovel/min-001`) também funciona.

Hospedagem estática precisa redirecionar todas as rotas para `index.html` (já incluídos `public/_redirects` para Netlify e `vercel.json` para Vercel).

## Cadastrar um imóvel

Adicione um objeto em `src/data/properties.ts` seguindo o tipo `Imovel` (`src/types/property.ts`):

- `id`: código exibido ao cliente (`MIN-013`). Ele vai na mensagem do WhatsApp.
- `finalidade`: `venda` ou `aluguel`. Em aluguel, `preco` é o valor mensal.
- `area`: área construída (ou do lote, em terrenos). `areaTerreno` é opcional.
- `caracteristicas`: só o que o imóvel realmente tem; a seção "Diferenciais" some se a lista estiver vazia.
- `fotos`: caminho local (coloque os arquivos em `public/fotos/` e use `/fotos/arquivo.jpg`) ou URL. A primeira é a capa.
- `status`: `disponivel` e `reservado` aparecem no site; `vendido` e `alugado` ficam ocultos.
- O bairro aparece com link para o mapa do **bairro**, nunca o endereço exato.

## Painel administrativo (futuro)

Toda leitura de dados passa por `src/data/repository.ts` (`listProperties`, `getProperty`). Para ligar a uma API ou a um painel, troque a implementação dessas funções mantendo as assinaturas; as páginas já tratam carregamento e erro.

## Estrutura

```
src/
  config/site.ts          dados institucionais e contatos
  data/properties.ts      anúncios (demonstração)
  data/repository.ts      acesso aos dados
  lib/filters.ts          filtros, ordenação e sincronização com a URL
  lib/whatsapp.ts         links wa.me com mensagem por imóvel
  components/             Header, SearchFilters, PropertyCard, PropertyGrid,
                          PropertyGallery, PropertyDetails, WhatsAppButton, Footer
  pages/                  CatalogPage, PropertyPage, NotFoundPage
```
