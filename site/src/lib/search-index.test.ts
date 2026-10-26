import { describe, expect, it } from 'vitest';
import { mergeSearchEntries } from './search-index';
const base=[{title:'Projects',subtitle:'Page',href:'/projects'},{title:'Old project',subtitle:'Fallback',href:'/projects/old'}];
const projectPaths=new Set(['/projects/old']);
describe('published search index',()=>{
  it('removes archived fallback projects after a successful empty CMS response',()=>{
    expect(mergeSearchEntries(base,[],projectPaths,'live').map(e=>e.href)).toEqual(['/projects']);
  });
  it('does not briefly expose fallback projects while the index is loading',()=>{
    expect(mergeSearchEntries(base,[],projectPaths,'loading').map(e=>e.href)).toEqual(['/projects']);
  });
  it('uses verified fallbacks on failure and replaces matching entries on success',()=>{
    expect(mergeSearchEntries(base,[],projectPaths,'fallback')).toEqual(base);
    const live=[{title:'New title',subtitle:'Published',href:'/projects/old'}];
    expect(mergeSearchEntries(base,live,projectPaths,'live')).toEqual([base[0],live[0]]);
  });
});
