import type { PrGroup } from './activity';

export function selectContributionSamples(items: PrGroup['items'], limit = 3): PrGroup['items'] {
  const selected: PrGroup['items'] = [];
  const repositories = new Set<string>();
  for (const item of items) {
    if (selected.length >= limit) break;
    if (!repositories.has(item.repository)) { selected.push(item); repositories.add(item.repository); }
  }
  for (const item of items) {
    if (selected.length >= limit) break;
    if (!selected.some(existing => existing.url === item.url)) selected.push(item);
  }
  return selected;
}
