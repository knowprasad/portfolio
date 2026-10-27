import {expect,it,vi} from 'vitest';
import {findArtwork,metadataImage,trustedMetadataUrl,type ArtworkQuery} from './artwork-provider';
const book:ArtworkQuery={kind:'books',name:'Atomic Habits',creator:'James Clear',format:'Book',link:''};
it('matches a book title and author and refuses unrelated search results',async()=>{
  const fetcher=vi.fn<typeof fetch>().mockResolvedValue(Response.json({docs:[{title:'Other book',cover_i:1,key:'/works/OL1W'},{title:'Atomic Habits',author_name:['James Clear'],cover_i:12539702,key:'/works/OL17930368W'}]}));
  expect((await findArtwork(book,fetcher))?.image).toContain('/12539702-L.jpg');
  expect(await findArtwork({...book,creator:'Another Author'},fetcher)).toBeNull();
});
it('does not fetch arbitrary article URLs or redirects into private/unknown hosts',async()=>{
  const fetcher=vi.fn<typeof fetch>().mockResolvedValue(new Response(null,{status:302,headers:{location:'http://127.0.0.1/private'}}));
  expect(await findArtwork({...book,kind:'articles',link:'https://evil.example/test'},fetcher)).toBeNull();expect(fetcher).not.toHaveBeenCalled();
  expect(await findArtwork({...book,kind:'articles',link:'https://noteswnat.substack.com/p/test'},fetcher)).toBeNull();expect(fetcher).toHaveBeenCalledTimes(1);
});
it('accepts only supported image CDNs from public metadata, independent of attribute order',()=>{
  expect(metadataImage('<meta content="https://substackcdn.com/image/a.jpg?a=1&amp;b=2" property="og:image">','https://noteswnat.substack.com/p/a')).toBe('https://substackcdn.com/image/a.jpg?a=1&b=2');
  expect(metadataImage('<meta property="og:image" content="https://evil.example/a.jpg">','https://noteswnat.substack.com')).toBeUndefined();
  expect(trustedMetadataUrl('https://substack.com.evil.example')).toBeUndefined();
});
it('keeps absent metadata and provider failures as unavailable artwork',async()=>{
  const fetcher=vi.fn<typeof fetch>().mockResolvedValue(new Response('<html></html>',{headers:{'content-type':'text/html'}}));
  expect(await findArtwork({...book,kind:'articles',link:'https://noteswnat.substack.com/p/a'},fetcher)).toBeNull();
  fetcher.mockRejectedValue(new Error('Offline'));expect(await findArtwork(book,fetcher)).toBeNull();
});
