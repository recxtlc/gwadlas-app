import photos from '../content/photos.json';

export type PhotoKey = keyof typeof photos;

/** Prefix an internal path with the site's base path (needed on GitHub Pages project URLs). */
export function url(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

type PhotoEntry = { src: string; credit: string; href: string };
const photoMap = photos as Record<string, PhotoEntry>;

/**
 * Look up a photo either by key in src/content/photos.json (e.g. "photo-03")
 * or by image path (e.g. "/images/new-gown.jpg", as saved by the /admin editor).
 * A path that matches a photos.json entry keeps that entry's credit.
 */
export function photo(keyOrPath: string) {
  let p: PhotoEntry | undefined = photoMap[keyOrPath];
  if (!p && keyOrPath.startsWith('/')) {
    p = Object.values(photoMap).find((e) => e.src === keyOrPath) ?? { src: keyOrPath, credit: '', href: '' };
  }
  if (!p) throw new Error(`Unknown photo "${keyOrPath}". Add it to src/content/photos.json or use an /images/ path.`);
  return { ...p, src: url(p.src) };
}

/** True when the current page matches a nav link. */
export function isCurrent(pathname: string, href: string): boolean {
  const clean = (s: string) => s.replace(/\/+$/, '') || '/';
  const here = clean(pathname);
  const target = clean(url(href));
  return target === clean(url('/')) ? here === target : here.startsWith(target);
}
