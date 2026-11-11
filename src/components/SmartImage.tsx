import { useState } from 'react';
import { imageSrcSet, imageUrl } from '../lib/images';

interface Props {
  src: string;
  alt: string;
  width: number;
  widths?: number[];
  sizes?: string;
  eager?: boolean;
  className?: string;
}

/** Imagem com estado de carregamento (fundo neutro) e fallback quando a foto falha. */
export function SmartImage({ src, alt, width, widths, sizes, eager, className }: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (state === 'error') {
    return (
      <div className={`img-fallback ${className ?? ''}`} role="img" aria-label={`${alt} — foto indisponível`}>
        <span>Foto indisponível</span>
      </div>
    );
  }

  return (
    <img
      className={`smart-img is-${state} ${className ?? ''}`}
      src={imageUrl(src, width)}
      srcSet={widths ? imageSrcSet(src, widths) : undefined}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
    />
  );
}
