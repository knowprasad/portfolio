import 'server-only';
import { cache } from 'react';
import { loadProjectReadme } from './project-readme';
export const getProjectReadme = cache(loadProjectReadme);
