/**
 * Gera URLs redimensionadas. Fotos do Unsplash usam os parâmetros do CDN;
 * fotos locais (ex.: /fotos/min-001-1.jpg) são servidas como estão.
 */
const UNSPLASH = 'https://images.unsplash.com/';

export function imageUrl(src: string, width: number): string {
  if (src.startsWith(UNSPLASH)) {
    const base = src.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${width}&q=70`;
  }
  return src;
}

export function imageSrcSet(src: string, widths: number[]): string | undefined {
  if (!src.startsWith(UNSPLASH)) return undefined;
  return widths.map((w) => `${imageUrl(src, w)} ${w}w`).join(', ');
}
