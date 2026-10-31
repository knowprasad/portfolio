import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { readmeHeadings, rehypeReadme } from '../lib/readme-markup';
import { readmeUrl, type ProjectReadme } from '../lib/project-readme';
import { ReadmeImage } from './readme-image';
import { ReaderCode } from './reader-controls';

export function ProjectReadmeContent({ readme }: { readme: ProjectReadme }) {
  const headings = readmeHeadings(readme.markdown);
  return <section id="readme" className="project-detail-section article-prose readme-document"><h2>From the README</h2><p className="readme-source"><a href={readme.sourceUrl} target="_blank" rel="noreferrer">{readme.repository.owner}/{readme.repository.name} · {readme.path} ↗</a><span>Synced from the public repository</span></p>{headings.length >= 4 && <details className="readme-toc"><summary>In this README <span>{headings.length} sections</span></summary><nav aria-label="README contents">{headings.map(heading => <a className={heading.depth > 2 ? 'readme-toc-nested' : undefined} href={`#${heading.id}`} key={`${heading.id}-${heading.depth}`}>{heading.title}</a>)}</nav></details>}<Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeReadme]} urlTransform={(url, key) => readmeUrl(url, readme, key === 'src')} components={{
    a: ({ href, children, id, title, 'aria-label': label }) => href ? <a id={id} title={title} aria-label={label} href={href} target={href.startsWith('#') ? undefined : '_blank'} rel={href.startsWith('#') ? undefined : 'noreferrer'}>{children}</a> : <span id={id}>{children}</span>,
    img: ({ src, alt }) => <ReadmeImage src={typeof src === 'string' ? src : undefined} alt={alt}/>,
    input: ({ checked }) => <span className="readme-task-state" role="img" aria-label={checked ? 'Completed' : 'Not completed'}>{checked ? '☑' : '☐'}</span>,
    pre: ({ children, node }) => {
      const code = node?.children.find(child => child.type === 'element' && child.tagName === 'code');
      const text = code?.type === 'element' ? code.children.map(child => child.type === 'text' ? child.value : '').join('') : '';
      const className = code?.type === 'element' && typeof code.properties.className === 'string' ? code.properties.className : '';
      const language = className.match(/language-([\w+-]+)/)?.[1];
      return text ? <ReaderCode text={text} language={language} ariaLabel="Scrollable code example"/> : <pre tabIndex={0} role="group" aria-label="Scrollable code example">{children}</pre>;
    },
    table: ({ children }) => <div className="article-table" tabIndex={0} role="group" aria-label="Scrollable repository table"><table>{children}</table></div>,
  }}>{readme.markdown}</Markdown></section>;
}
