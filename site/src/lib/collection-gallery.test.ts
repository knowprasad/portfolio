import {expect,it} from 'vitest';
import {belongsToCollection,collectionPhotos} from './collection-gallery';
import type {ContentBlock,ContentEntry} from './content-model';
const entry:ContentEntry={id:'1',name:'A',values:{Shelf:'Books',Format:'Book'},tags:[],featured:false};
it('checks shelf and format membership before a public gallery can be read',()=>{
  expect(belongsToCollection(entry,'books')).toBe(true);
  expect(belongsToCollection(entry,'watchlist')).toBe(false);
  expect(belongsToCollection({...entry,values:{Shelf:'Books',Format:'Article'}},'books')).toBe(false);
});
it('returns supported image captions without exposing paragraph content or unsafe image URLs',()=>{
  const blocks:ContentBlock[]=[{id:'1',type:'paragraph',text:[{text:'Private unrelated text'}],children:[{id:'2',type:'image',url:'https://images.unsplash.com/a',text:[{text:'On the river at dawn.'}],children:[]}]},{id:'3',type:'image',url:'https://bad.example/image.jpg',text:[],children:[]}];
  expect(collectionPhotos(blocks)).toEqual([{src:'https://images.unsplash.com/a',caption:'On the river at dawn.'}]);
});
it('deduplicates images and bounds a gallery to thirty photos',()=>{
  const photos=Array.from({length:40},(_,i)=>({id:String(i),type:'image',url:`https://images.unsplash.com/${i}`,text:[],children:[]}));
  expect(collectionPhotos([...photos,photos[0]])).toHaveLength(30);
});
it('keeps source attribution clickable without a raw URL cluttering the caption',()=>{
  const photo:ContentBlock={id:'1',type:'image',url:'https://images.unsplash.com/a',text:[{text:'At the ghat. Source: https://commons.wikimedia.org/wiki/File:Photo.jpg'}],children:[]};
  expect(collectionPhotos([photo])[0]).toEqual({src:'https://images.unsplash.com/a',caption:'At the ghat.',source:'https://commons.wikimedia.org/wiki/File:Photo.jpg'});
});
