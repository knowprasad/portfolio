import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ContentBlocks } from './content-blocks';
import type { ContentBlock } from '@/lib/content-model';

const table: ContentBlock = { id: 'table', type: 'table', text: [], children: [
  { id: 'header', type: 'table_row', text: [], children: [], rows: [['Record', 'Purpose']] },
  { id: 'row', type: 'table_row', text: [], children: [], rows: [['MX', 'Mail delivery']] },
] };
const render = (block: ContentBlock) => renderToStaticMarkup(createElement(ContentBlocks, { blocks: [block] }));

it('preserves native Notion column and row headers without duplicating the first row', () => {
  const html = render({ ...table, tableHeaderRow: true, tableHeaderColumn: true });
  expect(html).toContain('<thead><tr><th scope="col">Record</th>');
  expect(html).toContain('<th scope="row">MX</th>');
  expect(html.match(/Mail delivery/g)).toHaveLength(1);
  expect(html).toContain('tabindex="0" role="group" aria-label="Article table"');
});
it('does not invent headers when a Notion table is explicitly headerless', () => {
  const html = render(table);
  expect(html).not.toContain('<thead>');
  expect(html).not.toContain('<th ');
  expect(html).toContain('<td>Record</td>');
});
it('keeps code literal and keyboard reachable for horizontal scrolling', () => {
  const html = render({ id: 'code', type: 'code', text: [{ text: '<script>example()</script>' }], children: [] });
  expect(html).toContain('tabindex="0" role="group" aria-label="Code example"');
  expect(html).toContain('&lt;script&gt;example()&lt;/script&gt;');
  expect(html).not.toContain('<script>');
});
