import { expect, it } from 'vitest';
import { homepageProjects, projectCollection } from './project-selection';
import type { Project } from '@/data/site';
const base: Project = {slug:'a',name:'A',description:'',detail:'',tags:[],status:'Building',accent:'blue'};
it('never leaks side quests onto the homepage even when featured', () => {
  expect(homepageProjects([{...base,slug:'side',featured:true,collection:'side-quest'},{...base,slug:'building',featured:false},{...base,slug:'major',featured:true}]).map(p=>p.slug)).toEqual(['major']);
});
it('respects an empty homepage selection and does not fill it with unfeatured projects', () => {
  expect(homepageProjects([base])).toEqual([]);
});
it('lets Notion grouping override local fallback without deriving it from demo availability', () => {
  expect(projectCollection('Current projects','side-quest')).toBe('current');
  expect(projectCollection('Side quests','current')).toBe('side-quest');
  expect(projectCollection(undefined,'side-quest')).toBe('side-quest');
});
