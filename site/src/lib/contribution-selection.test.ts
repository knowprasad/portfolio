import { expect, it } from 'vitest';
import { selectContributionSamples } from './contribution-selection';
const pr = (number: number, repository: string) => ({ number, repository, title: `Actual PR ${number}`, url: `https://github.com/${repository}/pull/${number}`, date:'2026-10-26', state:'merged' });
it('shows concrete work across repositories before repeating a repository', () => {
  const items = [pr(1,'a/one'),pr(2,'a/one'),pr(3,'b/two'),pr(4,'c/three')];
  expect(selectContributionSamples(items).map(p=>p.number)).toEqual([1,3,4]);
  expect(items.map(p=>p.number)).toEqual([1,2,3,4]);
});
it('uses available real PRs without inventing entries for small or empty histories', () => {
  expect(selectContributionSamples([])).toEqual([]);
  expect(selectContributionSamples([pr(1,'a/one'),pr(2,'a/one')]).map(p=>p.number)).toEqual([1,2]);
});
