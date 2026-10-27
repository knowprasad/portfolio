import {beforeEach,expect,it,vi} from 'vitest';
vi.mock('@/lib/notion-server',()=>({getCollectionGallery:vi.fn()}));
import {getCollectionGallery} from '@/lib/notion-server';
import {GET} from '../app/api/collections/[kind]/[id]/gallery/route';
const id='40542b1c-345e-81e5-af3f-c134392f6fbb';
beforeEach(()=>vi.resetAllMocks());
it('rejects malformed IDs and unsupported sources before accessing content',async()=>{
  for(const params of [{kind:'private',id},{kind:'places',id:'../private'}])expect((await GET(new Request('https://knowprasad.me'),{params:Promise.resolve(params)})).status).toBe(404);
  expect(getCollectionGallery).not.toHaveBeenCalled();
});
it('does not expose a gallery when membership in published content is missing',async()=>{
  vi.mocked(getCollectionGallery).mockResolvedValue(null);
  expect((await GET(new Request('https://knowprasad.me'),{params:Promise.resolve({kind:'places',id})})).status).toBe(404);
});
it('returns a recoverable error without leaking provider details',async()=>{
  vi.mocked(getCollectionGallery).mockRejectedValue(new Error('Private upstream detail'));
  const response=await GET(new Request('https://knowprasad.me'),{params:Promise.resolve({kind:'places',id})});
  expect(response.status).toBe(503);expect(await response.text()).not.toContain('Private upstream detail');
});
