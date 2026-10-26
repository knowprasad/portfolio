import type { Root, RootContent } from 'hast';

// Runs after HTML sanitization. Namespace IDs away from site controls and keep
// Markdown headings inside the README section's h2 without skipping levels.
export function rehypeReadme() {
  return (tree: Root) => {
    const counts = new Map<string, number>();
    function text(node: RootContent): string {
      if (node.type === 'text') return node.value;
      return 'children' in node ? node.children.map(text).join('') : '';
    }
    function visit(node: Root | RootContent) {
      if (node.type === 'element') {
        if (node.tagName === 'table') {
          const header = node.children.find(child => child.type === 'element' && child.tagName === 'thead');
          if (header && !text(header).trim()) {
            node.children = node.children.filter(child => child !== header);
            for (const body of node.children) {
              if (body.type !== 'element' || body.tagName !== 'tbody') continue;
              for (const row of body.children) {
                if (row.type !== 'element' || row.tagName !== 'tr') continue;
                const first = row.children.find(child => child.type === 'element' && child.tagName === 'td');
                if (first?.type === 'element' && text(first).trim()) { first.tagName = 'th'; first.properties.scope = 'row'; }
              }
            }
          }
        }
        if (/^h[1-6]$/.test(node.tagName)) {
          const slug = text(node).toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, '').trim().replace(/\s/g, '-') || 'section';
          const occurrence = counts.get(slug) || 0;
          counts.set(slug, occurrence + 1);
          node.properties.id = `readme-${slug}${occurrence ? `-${occurrence}` : ''}`;
          node.tagName = `h${Math.min(Math.max(Number(node.tagName.slice(1)) + 1, 3), 6)}`;
        } else if (typeof node.properties.id === 'string') node.properties.id = `readme-${node.properties.id.replace(/^user-content-/, '')}`;
      }
      if ('children' in node) node.children.forEach(visit);
    }
    visit(tree);
  };
}
