import { expect, it } from 'vitest';
import { articleMarkdown } from './article-markdown';
it('keeps fenced code literal even when the article contains a triple backtick', () => {
  const output = articleMarkdown([{id:'c',type:'code',text:[{text:'```\n<script>example()</script>'}],children:[],language:'html'}]);
  expect(output).toBe('````html\n```\n<script>example()</script>\n````');
});
