import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ProjectReadmeContent } from './project-readme-content';
import type { ProjectReadme } from '../lib/project-readme';
const readme: ProjectReadme = { repository: { owner: 'knowprasad', name: 'demo', url: 'https://github.com/knowprasad/demo' }, path: 'README.md', rawBase: 'https://raw.githubusercontent.com/knowprasad/demo/HEAD/', sourceUrl: 'https://github.com/knowprasad/demo/blob/HEAD/README.md', markdown: '' };
function render(markdown: string) { return renderToStaticMarkup(createElement(ProjectReadmeContent, { readme: { ...readme, markdown } })); }
it('renders useful Markdown/HTML but strips scripts, embeds, event handlers and styles', () => {
  const html = render('<div style="position:fixed"><h1>Guide</h1><p onclick="alert(1)">Useful text</p><script>alert(1)</script><iframe src="https://evil.test"></iframe></div>\n\n[Bad](javascript:alert(1))');
  expect(html).toContain('Useful text');
  expect(html).toContain('<h3 id="readme-guide">Guide</h3>');
  for (const unsafe of ['<script', '<iframe', 'onclick', 'position:fixed', 'javascript:']) expect(html).not.toContain(unsafe);
});
it('supports tables, code, repository links and namespaced duplicate heading anchors', () => {
  const html = render('# Guide\n\n## Setup\n\n[Setup](#setup) · [Source](src/main.ts)\n\n| Tool | Version |\n| --- | --- |\n| Node | 24 |\n\n```bash\nnpm install\n```\n\n## Setup');
  expect(html).toContain('id="readme-setup"');
  expect(html).toContain('id="readme-setup-1"');
  expect(html).toContain('href="#readme-setup"');
  expect(html).toContain('https://github.com/knowprasad/demo/blob/HEAD/src/main.ts');
  expect(html).toContain('<th>Tool</th>');
  expect(html).toContain('npm install');
});
it('keeps hand-written table-of-contents anchors working with emoji headings', () => {
  const html = render('## 🧠 About\n\n[About](#about)\n\n<a id="custom"></a>\n\n[Custom](#custom)');
  expect(html).toContain('id="readme-about"');
  expect(html).toContain('href="#readme-about"');
  expect(html).toContain('id="readme-custom"');
  expect(html).toContain('href="#readme-custom"');
});
it('exposes roadmap completion as readable states and makes code/tables keyboard-scrollable', () => {
  const html = render('- [x] Shipped\n- [ ] Planned\n\n```text\na very long line\n```\n\n| A |\n| - |\n| B |');
  expect(html).not.toContain('<input');
  expect(html).toContain('aria-label="Completed"');
  expect(html).toContain('aria-label="Not completed"');
  expect(html).toContain('tabindex="0" role="group" aria-label="Scrollable code example"');
  expect(html).toContain('aria-label="Scrollable repository table"');
});

it('uses existing row labels for README tables with blank column headings', () => {
  const html = render('| | |\n| - | - |\n| **Banner** | A preview |');
  expect(html).not.toContain('<thead>');
  expect(html).toContain('<th scope="row"><strong>Banner</strong></th>');
});
it('keeps unavailable linked images as text inside the original link', () => {
  const html = render('[![Logo](https://tracker.example/pixel.png)](https://example.com)');
  expect(html).toContain('<span class="readme-image-fallback">Logo</span></a>');
  expect(html).not.toContain('https://tracker.example');
});
