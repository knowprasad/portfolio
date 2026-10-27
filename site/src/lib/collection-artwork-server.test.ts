import {beforeEach,expect,it,vi} from 'vitest';
vi.mock('server-only',()=>({}));
vi.mock('next/cache',()=>({unstable_cache:(fn:unknown)=>fn}));
vi.mock('./artwork-provider',()=>({findArtwork:vi.fn()}));
import {findArtwork} from './artwork-provider';
import {withCollectionArtwork} from './collection-artwork-server';
import type {ContentEntry} from './content-model';
const entry:ContentEntry={id:'1',name:'Book',values:{Image:'https://images.unsplash.com/own-photo','Image credit':'My photo'},tags:[],featured:true};
beforeEach(()=>vi.resetAllMocks());
it('always prefers the owner image and credit without making a provider lookup',async()=>{
  expect(await withCollectionArtwork([entry],'books')).toEqual([entry]);expect(findArtwork).not.toHaveBeenCalled();
});
it('fills a missing image while preserving personal notes and unrelated metadata',async()=>{
  vi.mocked(findArtwork).mockResolvedValue({image:'https://covers.openlibrary.org/b/id/1-L.jpg',credit:'Source credit',source:'https://openlibrary.org/works/OL1W'});
  const result=await withCollectionArtwork([{...entry,values:{'My take':'My own opinion'}}],'books');
  expect(result[0].values['My take']).toBe('My own opinion');expect(result[0].values.Image).toContain('covers.openlibrary.org');
});
