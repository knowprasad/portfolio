import Image from 'next/image';
import type { ContentBlock, RichText } from '@/lib/content-model';
import { ReaderCode, ReaderImage } from './reader-controls';
function Text({ value }: { value: RichText[] }) {
  return value.map((part, i) => { let content: React.ReactNode = part.text; if (part.code) content = <code>{content}</code>; if (part.bold) content = <strong>{content}</strong>; if (part.italic) content = <em>{content}</em>; if (part.strike) content = <s>{content}</s>; return part.href ? <a key={i} href={part.href} target="_blank" rel="noreferrer">{content}</a> : <span key={i}>{content}</span>; });
}
export function headingId(block: ContentBlock) { return `heading-${block.id}`; }
export function ContentBlocks({ blocks, reader = false }: { blocks: ContentBlock[]; reader?: boolean }) {
  const output: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i], text = <Text value={block.text}/>;
    const children = block.children.length ? <ContentBlocks blocks={block.children} reader={reader}/> : null;
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const items: React.ReactNode[] = []; const type = block.type;
      do { const item = blocks[i]; items.push(<li key={item.id}><Text value={item.text}/><ContentBlocks blocks={item.children} reader={reader}/></li>); i++; } while (i < blocks.length && blocks[i].type === type);
      i--; output.push(type === 'bulleted_list_item' ? <ul key={block.id}>{items}</ul> : <ol key={block.id}>{items}</ol>); continue;
    }
    switch (block.type) {
      case 'heading_1': case 'heading_2': output.push(<h2 id={headingId(block)} key={block.id}>{reader ? <a href={`#${headingId(block)}`}>{text}</a> : text}</h2>); break;
      case 'heading_3': output.push(<h3 id={headingId(block)} key={block.id}>{reader ? <a href={`#${headingId(block)}`}>{text}</a> : text}</h3>); break;
      case 'quote': output.push(<blockquote key={block.id}>{text}{children}</blockquote>); break;
      case 'callout': output.push(<aside className="article-callout" key={block.id}>{text}{children}</aside>); break;
      case 'code': output.push(reader ? <ReaderCode key={block.id} text={block.text.map(t => t.text).join('')} language={block.language}/> : <pre key={block.id} tabIndex={0} role="group" aria-label="Code example"><code>{block.text.map(t => t.text).join('')}</code></pre>); break;
      case 'image': if (block.url) output.push(reader ? <ReaderImage key={block.id} src={block.url} alt={block.text.map(t => t.text).join('')} caption={block.text.map(t => t.text).join('')}/> : <figure key={block.id}><Image src={block.url} unoptimized width={1200} height={800} alt={block.text.map(t => t.text).join('')} style={{ width: '100%', height: 'auto' }}/>{block.text.length > 0 && <figcaption>{text}</figcaption>}</figure>); break;
      case 'divider': output.push(<hr key={block.id}/>); break;
      case 'toggle': output.push(<details key={block.id}><summary>{text}</summary>{children}</details>); break;
      case 'table': {
        const rows = block.children.flatMap(row => row.rows || []);
        const header = block.tableHeaderRow ? rows[0] : undefined;
        output.push(<div className="article-table" key={block.id} tabIndex={0} role="group" aria-label="Article table"><table>{header && <thead><tr>{header.map((cell, c) => <th key={c} scope="col">{cell}</th>)}</tr></thead>}<tbody>{rows.slice(header ? 1 : 0).map((row, n) => <tr key={n}>{row.map((cell, c) => block.tableHeaderColumn && c === 0 ? <th key={c} scope="row">{cell}</th> : <td key={c}>{cell}</td>)}</tr>)}</tbody></table></div>); break;
      }
      case 'unsupported': output.push(<p className="message-note" key={block.id}>This content format is not available in the web edition.</p>); break;
      default: output.push(<div key={block.id}><p>{text}</p>{children}</div>);
    }
  }
  return output;
}
