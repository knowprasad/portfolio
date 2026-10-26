import { describe, expect, it } from 'vitest';
import { agentIndex, pageMetadata, profileStructuredData, projectStructuredData, serializeStructuredData, siteOrigin } from './seo';
import { projects } from '../data/site';

describe('search metadata', () => {
  it('gives project pages their own canonical URL and description', () => {
    const result = pageMetadata('/projects/merix', 'Merix', 'Resume matching');
    expect(result.alternates?.canonical).toBe(`${siteOrigin}/projects/merix`);
    expect(result.description).toBe('Resume matching');
  });
  it('uses a truthful personal profile without exposing contact email or invented ratings', () => {
    const value = profileStructuredData();
    expect(value.mainEntity.name).toBe('Shubham Prasad');
    expect(value.mainEntity.sameAs).toContain('https://github.com/knowprasad');
    expect(JSON.stringify(value)).not.toMatch(/@gmail|aggregateRating|reviewCount/);
  });
  it('keeps future CMS text from ending a structured-data script', () => {
    const value = serializeStructuredData({ name: '</script><script>alert(1)</script>' });
    expect(value).not.toContain('<');
    expect(JSON.parse(value).name).toContain('</script>');
  });
  it('publishes only public project source links and preserves in-progress status', () => {
    const pulse = projects.find(project => project.slug === 'pulse')!;
    const value = projectStructuredData(pulse);
    expect(value.creativeWorkStatus).toBe('Building');
    expect(value).not.toHaveProperty('codeRepository');
    expect(projectStructuredData(projects[0]).codeRepository).toBe(projects[0].github);
  });
  it('keeps the agent index aligned with visible projects without exposing email or private source', () => {
    const text = agentIndex();
    for (const project of projects) expect(text).toContain(`${siteOrigin}/projects/${project.slug}`);
    expect(text).not.toMatch(/@gmail|github\.com\/knowprasad\/pulse/);
    expect(text).toContain('snapshot date');
  });
});
