import type { ContentBlock } from './content-model';

// Plain public source, not executable HTML. Only the published article route calls this.
export function articleMarkdown(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    const text = block.text.map(part => part.text).join('');
    const children = block.children.length ? `\n${articleMarkdown(block.children)}` : '';
    switch (block.type) {
      case 'heading_1': case 'heading_2': return `## ${text}`;
      case 'heading_3': return `### ${text}`;
      case 'code': { const fence = '`'.repeat(Math.max(3, ...(text.match(/`+/g) || []).map(run => run.length + 1))); return `${fence}${(block.language || '').replace(/[^a-zA-Z0-9_+-]/g,'')}\n${text}\n${fence}`; }
      case 'quote': return text.split('\n').map(line => `> ${line}`).join('\n') + children;
      case 'bulleted_list_item': return `- ${text}${children}`;
      case 'numbered_list_item': return `1. ${text}${children}`;
      case 'image': return block.url ? `![${text.replaceAll(']','\\]')}](${block.url})` : '';
      case 'divider': return '---';
      case 'table': {
        const rows = block.children.flatMap(row => row.rows || []);
        return rows.flatMap((row,index) => {
          const line = `| ${row.map(cell => cell.replaceAll('|','\\|').replaceAll('\n',' ')).join(' | ')} |`;
          return index === 0 && block.tableHeaderRow ? [line,`| ${row.map(() => '---').join(' | ')} |`] : [line];
        }).join('\n');
      }
      default: return text + children;
    }
  }).join('\n\n');
}
