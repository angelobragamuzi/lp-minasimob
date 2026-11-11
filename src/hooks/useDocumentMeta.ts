import { useEffect } from 'react';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** SEO básico em SPA: título, description e Open Graph por página. */
export function useDocumentMeta(title: string, description?: string, image?: string) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
    if (image) setMeta('meta[property="og:image"]', 'property', 'og:image', image);
  }, [title, description, image]);
}
