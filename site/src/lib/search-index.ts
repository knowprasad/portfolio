export type SearchEntry = { title: string; subtitle: string; href?: string; action?: string; body?: string };
export function mergeSearchEntries(base: SearchEntry[], content: SearchEntry[], fallbackProjectPaths: ReadonlySet<string>, source: 'loading' | 'live' | 'fallback') {
  const visibleBase = source === 'fallback' ? base : base.filter(entry => !entry.href || !fallbackProjectPaths.has(entry.href));
  return [...visibleBase.filter(entry => !content.some(item => item.href && item.href === entry.href)), ...content];
}
