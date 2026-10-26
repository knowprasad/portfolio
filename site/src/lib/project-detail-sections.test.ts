import { expect, it } from 'vitest';
import { groupProjectBlocks } from './project-detail-sections';
import type { ContentBlock } from './content-model';
const block = (id: string, type: string, text: string): ContentBlock => ({ id, type, text: [{ text }], children: [] });

it('groups existing project prose into inspection sections without duplicate headings or lost text', () => {
  const body = [block('a','heading_2','About the project'),block('b','paragraph','Original overview.'),block('c','heading_2','My role & ownership'),block('d','paragraph','Original role.'),block('e','heading_2','Current service note'),block('f','paragraph','The demo backend is paused.')];
  const before = JSON.stringify(body);
  const result = groupProjectBlocks(body);
  expect(result.overview.map(b => b.id)).toEqual(['b']);
  expect(result.ownership.map(b => b.id)).toEqual(['d']);
  expect(result.limitations.map(b => b.id)).toEqual(['f']);
  expect(result.architecture).toEqual([]);
  expect(JSON.stringify(body)).toBe(before);
});

it('retains unrecognized headings, nested blocks and images instead of dropping custom content', () => {
  const child = block('child','paragraph','Nested explanation.');
  const heading = { ...block('a','heading_2','Architecture'), children: [child] };
  const result = groupProjectBlocks([heading,block('b','heading_2','A custom decision'),{ ...block('c','image','Actual screen'), url:'https://images.unsplash.com/example' }]);
  expect(result.architecture.map(b => b.id)).toEqual(['child','b','c']);
  expect(result.architecture[1].type).toBe('heading_3');
  expect(result.architecture[2].url).toBe('https://images.unsplash.com/example');
});
