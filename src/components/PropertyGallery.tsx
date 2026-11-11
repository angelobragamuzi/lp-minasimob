import { useCallback, useEffect, useRef, useState } from 'react';
import { imageUrl } from '../lib/images';
import type { FotoImovel } from '../types/property';
import { ChevronIcon, CloseIcon, ExpandIcon } from './Icons';
import { SmartImage } from './SmartImage';

interface Props {
  fotos: FotoImovel[];
  titulo: string;
}

export function PropertyGallery({ fotos, titulo }: Props) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const total = fotos.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + total) % total), [total]);

  // Mantém a miniatura ativa visível
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [index]);

  // Lightbox: <dialog> nativo cuida do foco e do Esc
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (zoom && !d.open) d.showModal();
    if (!zoom && d.open) d.close();
    document.body.classList.toggle('no-scroll', zoom);
  }, [zoom]);

  useEffect(
    () => () => {
      document.body.classList.remove('no-scroll');
    },
    [],
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current == null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touchX.current = null;
    },
  };

  if (total === 0) {
    return (
      <div className="gallery">
        <div className="gallery-main">
          <div className="img-fallback">
            <span>Fotos em breve</span>
          </div>
        </div>
      </div>
    );
  }

  const atual = fotos[index];

  return (
    <section className="gallery" aria-roledescription="galeria" aria-label={`Fotos de ${titulo}`} onKeyDown={onKey}>
      <div className="gallery-main" {...swipe}>
        <SmartImage
          key={atual.src}
          src={atual.src}
          alt={atual.alt}
          width={1400}
          widths={[640, 1000, 1400, 1800]}
          sizes="(max-width: 1024px) 100vw, 760px"
          eager
        />
        <button
          ref={openerRef}
          type="button"
          className="gallery-expand"
          onClick={() => setZoom(true)}
          aria-label="Ampliar foto"
        >
          <ExpandIcon />
          <span>Ampliar</span>
        </button>
        {total > 1 && (
          <>
            <button type="button" className="gallery-nav prev" onClick={() => go(-1)} aria-label="Foto anterior">
              <ChevronIcon dir="left" />
            </button>
            <button type="button" className="gallery-nav next" onClick={() => go(1)} aria-label="Próxima foto">
              <ChevronIcon />
            </button>
          </>
        )}
        <span className="gallery-counter" aria-live="polite">
          {index + 1} / {total}
        </span>
      </div>

      {total > 1 && (
        <div className="gallery-thumbs" ref={thumbsRef}>
          {fotos.map((f, i) => (
            <button
              key={`${f.src}-${i}`}
              type="button"
              className={i === index ? 'is-active' : undefined}
              aria-label={`Ver foto ${i + 1}: ${f.alt}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            >
              <SmartImage src={f.src} alt="" width={200} />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`Fotos ampliadas de ${titulo}`}
        onClose={() => {
          setZoom(false);
          openerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setZoom(false);
        }}
      >
        {zoom && (
          <div className="lightbox-inner" {...swipe}>
            <img src={imageUrl(atual.src, 2000)} alt={atual.alt} />
            <p className="lightbox-caption">
              {atual.alt} — {index + 1} de {total}
            </p>
            <button type="button" className="lightbox-close" onClick={() => setZoom(false)} aria-label="Fechar">
              <CloseIcon />
            </button>
            {total > 1 && (
              <>
                <button type="button" className="gallery-nav prev" onClick={() => go(-1)} aria-label="Foto anterior">
                  <ChevronIcon dir="left" />
                </button>
                <button type="button" className="gallery-nav next" onClick={() => go(1)} aria-label="Próxima foto">
                  <ChevronIcon />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
