import Image from 'next/image';
const marks = new Set(['merix', 'platewise', 'pulse', 'yourtomo']);
export function ProjectIcon({ slug, size = 36 }: { slug: string; size?: number }) {
  return <Image src={marks.has(slug) ? `/project-icons/${slug}.svg` : '/site-avatar.webp'} width={size} height={size} alt="" data-project-icon={slug} />;
}
