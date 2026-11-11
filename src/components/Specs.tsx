import type { Imovel } from '../types/property';

interface Props {
  imovel: Imovel;
  compact?: boolean;
}

/** Quartos, banheiros, vagas e área. Itens com valor zero não são exibidos. */
export function Specs({ imovel: p, compact }: Props) {
  const items: { valor: string; rotulo: string }[] = [];
  if (p.quartos) items.push({ valor: String(p.quartos), rotulo: p.quartos === 1 ? 'quarto' : 'quartos' });
  if (!compact && p.suites) items.push({ valor: String(p.suites), rotulo: p.suites === 1 ? 'suíte' : 'suítes' });
  if (p.banheiros) items.push({ valor: String(p.banheiros), rotulo: p.banheiros === 1 ? 'banheiro' : 'banheiros' });
  if (p.vagas) items.push({ valor: String(p.vagas), rotulo: p.vagas === 1 ? 'vaga' : 'vagas' });
  items.push({
    valor: `${p.area.toLocaleString('pt-BR')} m²`,
    rotulo: compact ? 'área' : p.tipo === 'terreno' ? 'de terreno' : 'de área',
  });
  if (!compact && p.areaTerreno && p.tipo !== 'terreno') {
    items.push({ valor: `${p.areaTerreno.toLocaleString('pt-BR')} m²`, rotulo: 'de terreno' });
  }

  return (
    <ul className={compact ? 'specs specs-compact' : 'specs specs-full'}>
      {items.map((i) => (
        <li key={i.rotulo}>
          <strong>{i.valor}</strong> <span>{i.rotulo}</span>
        </li>
      ))}
    </ul>
  );
}
